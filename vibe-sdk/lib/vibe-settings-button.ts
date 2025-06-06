import { AzureOpenAI } from "openai";
import template from "./vibe-settings-button.html?raw";

export class VibeSettingsButton extends HTMLElement {
  static define(tag = "vibe-settings-button") {
    if (customElements.get(tag)) {
      console.warn(`Custom element with tag "${tag}" is already defined. Did you re-define it by accident?`);
      return;
    }
    customElements.define(tag, VibeSettingsButton);
  }

  shadowRoot = attachHTML(this, template);
  private trigger = this.shadowRoot.querySelector<HTMLButtonElement>("#trigger")!;
  private dialog = this.shadowRoot.querySelector<HTMLDialogElement>("dialog")!;
  private testButton = this.shadowRoot.querySelector<HTMLButtonElement>("#test")!;
  private deleteButton = this.shadowRoot.querySelector<HTMLButtonElement>("#delete")!;
  private form = this.shadowRoot.querySelector<HTMLFormElement>("#settings-form")!;
  private testOutput = this.shadowRoot.querySelector<HTMLDivElement>("#test-output")!;

  private abortControllers = [] as AbortController[];

  constructor() {
    super();
  }

  connectedCallback() {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    this.loadFormValues();
    this.form.addEventListener("input", () => this.saveFormValues(), { signal: abortController.signal });

    this.trigger.addEventListener(
      "click",
      () => {
        this.dialog.showModal();
      },
      {
        signal: abortController.signal,
      }
    );

    this.testButton.addEventListener("click", async () => this.handleTest(), {
      signal: abortController.signal,
    });

    this.deleteButton.addEventListener(
      "click",
      () => {
        if (confirm("Are you sure you want to delete all settings? This cannot be undone.")) {
          localStorage.removeItem("vibe-settings");
          this.form.reset();
          this.dialog.close();
        }
      },
      {
        signal: abortController.signal,
      }
    );
  }

  disconnectedCallback() {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers = [];
  }

  private validateForm(): boolean {
    const isValid = this.form.reportValidity();
    return isValid;
  }

  private saveFormValues(): void {
    const formData = new FormData(this.form);
    const values: Record<string, string> = {};

    formData.forEach((value, key) => {
      values[key] = value.toString();
    });

    localStorage.setItem("vibe-settings", JSON.stringify(values));
  }

  private loadFormValues(): void {
    try {
      const savedData = localStorage.getItem("vibe-settings");
      if (!savedData) return;

      const values = JSON.parse(savedData) as Record<string, string>;

      Object.entries(values).forEach(([key, value]) => {
        const input = this.form.querySelector<HTMLInputElement>(`[name="${key}"]`);
        if (input) {
          input.value = value;
        }
      });
    } catch (error) {
      console.warn("Failed to load saved form values:", error);
    }
  }

  private async handleTest() {
    if (!this.validateForm()) return;

    this.testOutput.textContent = '⏳ Asking LLM to say "Hello"...';

    try {
      const endpoint = this.shadowRoot.querySelector<HTMLInputElement>("#aoai-endpoint")!.value;
      const apiKey = this.shadowRoot.querySelector<HTMLInputElement>("#aoai-api-key")!.value;
      const deployment = this.shadowRoot.querySelector<HTMLInputElement>("#aoai-deployment")!.value;
      const openai = new AzureOpenAI({
        dangerouslyAllowBrowser: true,
        endpoint,
        apiKey,
        deployment,
        apiVersion: "2025-04-01-preview",
      });

      const response = await openai.responses.create({
        model: deployment,
        input: `say "hello" and nothing else`,
        max_output_tokens: 32,
      });

      console.log(response.output_text);
      this.testOutput.textContent += `\n✅ Test successful. LLM says "${response.output_text}"`;
    } catch (error: any) {
      this.testOutput.textContent += `\n❌ Test failed. ${[error?.name, error?.message].filter(Boolean).join(" ")}`;
    }
  }
}

function attachHTML(element: HTMLElement, html: string) {
  element.attachShadow({ mode: "open" });
  element.shadowRoot!.innerHTML = html;
  return element.shadowRoot!;
}
