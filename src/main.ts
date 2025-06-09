import { VibeButton } from "../lib/vibe-button";
import "./style.css";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Get the first vibe-button element
  const vibeButton = document.querySelector("vibe-button") as VibeButton;

  // Get DOM elements
  const userInput = document.getElementById("user-input") as HTMLTextAreaElement;
  const sendButton = document.getElementById("send-button") as HTMLButtonElement;
  const resetButton = document.getElementById("reset-button") as HTMLButtonElement;
  const outputArea = document.getElementById("output-area") as HTMLDivElement;

  // Handle send button click
  sendButton.addEventListener("click", async () => {
    const prompt = userInput.value.trim();
    if (!prompt) {
      outputArea.textContent = "Please enter a prompt.";
      return;
    }

    // Disable buttons during processing
    sendButton.disabled = true;
    resetButton.disabled = true;
    outputArea.textContent = "Sending request...";

    try {
      const response = await vibeButton.send(prompt);
      outputArea.textContent = response;
    } catch (error) {
      outputArea.textContent = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    } finally {
      sendButton.disabled = false;
      resetButton.disabled = false;
    }
  });

  // Handle reset button click
  resetButton.addEventListener("click", () => {
    vibeButton.reset();
    userInput.value = "";
    outputArea.textContent = "Conversation reset.";
  });

  // Allow Enter key to send (Shift+Enter for new line)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
});
