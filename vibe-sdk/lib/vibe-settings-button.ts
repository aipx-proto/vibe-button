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
  private doneButton = this.shadowRoot.querySelector<HTMLButtonElement>("#done")!;
  private testButton = this.shadowRoot.querySelector<HTMLButtonElement>("#test")!;
  private deleteButton = this.shadowRoot.querySelector<HTMLButtonElement>("#delete")!;
  private form = this.shadowRoot.querySelector<HTMLFormElement>("#settings-form")!;
  private testOutput = this.shadowRoot.querySelector<HTMLDivElement>("#test-output")!;

  private abortControllers = [] as AbortController[];

  connectedCallback() {
    const abortController = new AbortController();
    this.abortControllers.push(abortController);

    this.loadFormValues();
    this.form.addEventListener("input", () => this.saveFormValues(), { signal: abortController.signal });

    // Add drag functionality
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    let wasDragging = false; // Track if we were recently dragging

    this.trigger.addEventListener(
      "mousedown",
      (e) => {
        isDragging = true;
        wasDragging = false;
        startX = e.clientX;
        startY = e.clientY;

        // Get current CSS variable values or default to 0
        const computedStyle = getComputedStyle(this.trigger);
        initialX = parseInt(computedStyle.getPropertyValue("--x")) || 0;
        initialY = parseInt(computedStyle.getPropertyValue("--y")) || 0;

        e.preventDefault(); // Prevent text selection
      },
      { signal: abortController.signal }
    );

    document.addEventListener(
      "mousemove",
      (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Consider it dragging if moved more than a few pixels
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
          wasDragging = true;
        }

        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

        this.trigger.style.setProperty("--x", `${newX}px`);
        this.trigger.style.setProperty("--y", `${newY}px`);
      },
      { signal: abortController.signal }
    );

    document.addEventListener(
      "mouseup",
      () => {
        if (isDragging) {
          isDragging = false;
          // Reset wasDragging after a short delay to allow click event to check it
          setTimeout(() => {
            wasDragging = false;
          }, 10);
        }
      },
      { signal: abortController.signal }
    );

    this.doneButton.addEventListener("click", (e) => {
      this.dialog.close();
    });

    this.trigger.addEventListener(
      "click",
      (_e) => {
        // Only show dialog if we weren't dragging
        if (!wasDragging) {
          this.dialog.showModal();
        }
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

  get model(): string {
    const savedConfig = localStorage.getItem("vibe-settings");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as Record<string, string>;
        return config["aoai-deployment"] || "";
      } catch (e) {
        console.error("Failed to parse saved configuration:", e);
        return "";
      }
    }
    return "";
  }

  get client(): AzureOpenAI | null {
    const savedConfig = localStorage.getItem("vibe-settings");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as Record<string, string>;
        const endpoint = config["aoai-endpoint"];
        const apiKey = config["aoai-api-key"];
        const deployment = config["aoai-deployment"];
        if (!endpoint || !apiKey || !deployment) {
          const isOpenConfigConfirmed = window.confirm("Incomplete Azure OpenAI configuration found. Would you like to reconfigure it?");
          if (isOpenConfigConfirmed) this.dialog.showModal();
          return null;
        }
        return new AzureOpenAI({
          dangerouslyAllowBrowser: true,
          endpoint,
          apiKey,
          deployment,
          apiVersion: "2025-04-01-preview",
        });
      } catch (e) {
        console.error("Failed to parse saved configuration:", e);
        return null;
      }
    }

    return null;
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
