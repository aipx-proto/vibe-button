import { codeToHtml } from "shiki";
import { VibeButton } from "../lib/vibe-button";
import "./style.css";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Get the first vibe-button element
  const vibeButton = document.querySelector("vibe-button") as VibeButton;

  // Get DOM elements
  const userInput = document.getElementById("user-input") as HTMLTextAreaElement;
  const sampleCodeContainer = document.getElementById("sample-code") as HTMLElement;
  const sendButton = document.getElementById("send-button") as HTMLButtonElement;
  const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
  const promptOutput = document.getElementById("prompt-output-area") as HTMLDivElement;
  const resetOutput = document.getElementById("reset-output-area") as HTMLDivElement;
  const resetCodeContainer = document.getElementById("reset-code") as HTMLElement;
  const installCodeContainer = document.getElementById("install-code") as HTMLElement;
  const installOptions = document.getElementById("install-options") as HTMLFieldSetElement;

  // react to events
  vibeButton.addEventListener("test-done", (e) => {
    const isSuccess = e.detail.isSuccess;
    document.querySelector<HTMLInputElement>(`[data-task="test-connection"]`)!.checked = isSuccess;
  });
  vibeButton.addEventListener("input-changed", (e) => {
    switch (e.detail.name) {
      case "aoaiEndpoint": {
        const isValid = e.detail.value.startsWith("https://");
        document.querySelector<HTMLInputElement>(`[data-task="endpoint"]`)!.checked = isValid;
        break;
      }
      case "aoaiDeployment": {
        const isValid = e.detail.value.length > 0;
        document.querySelector<HTMLInputElement>(`[data-task="deployment"]`)!.checked = isValid;
        break;
      }
      case "aoaiApiKey": {
        const isValid = e.detail.value.length > 0;
        document.querySelector<HTMLInputElement>(`[data-task="api-key"]`)!.checked = isValid;
        break;
      }
    }
  });

  // render code preview
  userInput.addEventListener("input", async () => {
    const code = userInput.value.trim();
    renderCode(code, sampleCodeContainer);
  });

  installOptions.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "position") {
      const newPosition = target.value;
      document.querySelector("vibe-button")?.setAttribute("position", newPosition);
      renderInstallCode(installCodeContainer, newPosition);
    }
  });

  renderCode(userInput.value, sampleCodeContainer);
  renderResetCode(resetCodeContainer);
  renderInstallCode(installCodeContainer);

  // Handle send button click
  sendButton.addEventListener("click", async () => {
    const prompt = userInput.value.trim();
    if (!prompt) {
      promptOutput.textContent = "Please enter a prompt.";
      return;
    }

    // Disable buttons during processing
    sendButton.disabled = true;
    resetButton.disabled = true;
    promptOutput.textContent = "Sending request...";

    try {
      const response = await vibeButton.send(prompt);
      promptOutput.textContent = response;
    } catch (error) {
      promptOutput.textContent = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    } finally {
      sendButton.disabled = false;
      resetButton.disabled = false;
    }
  });

  // Handle reset button click
  resetButton.addEventListener("click", () => {
    vibeButton.reset();
    userInput.value = "";
    resetOutput.textContent = "Conversation reset.";
  });

  // Allow Enter key to send (Shift+Enter for new line)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
});

function hygradeCodeTemplate(prompt: string) {
  return `
document.querySelector("vibe-button")
  .send(${JSON.stringify(prompt)})
  .then(response => console.log(response));
  `.trim();
}

async function renderCode(code: string, container: HTMLElement) {
  try {
    const promptCode = hygradeCodeTemplate(code);
    const html = await codeToHtml(promptCode, { lang: "javascript", theme: "one-dark-pro" });
    container.innerHTML = html;
  } catch (error) {
    container.textContent = `Error rendering code: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

function hygradeResetTemplate() {
  return `
document.querySelector("vibe-button").reset();
`.trim();
}

async function renderResetCode(container: HTMLElement) {
  try {
    const resetCode = hygradeResetTemplate();
    const html = await codeToHtml(resetCode, { lang: "javascript", theme: "one-dark-pro" });
    container.innerHTML = html;
  } catch (error) {
    container.textContent = `Error rendering reset code: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

function hygradeInstallTemplate(position?: string) {
  return `
<head>
  <!-- Existing code --> 
  <script type="module" src="https://esm.sh/vibe-button@latest"></script>
  <!-- Existing code -->
</head>
<body>
  <!-- Existing code -->
  ${position ? `<vibe-button position="${position}"></vibe-button>` : `<vibe-button></vibe-button>`} 
</body>
 `.trim();
}

async function renderInstallCode(container: HTMLElement, position?: string) {
  try {
    const installCode = hygradeInstallTemplate(position);
    const html = await codeToHtml(installCode, { lang: "html", theme: "one-dark-pro" });
    container.innerHTML = html;
  } catch (error) {
    container.textContent = `Error rendering install code: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}
