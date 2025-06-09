import type { VibeButton } from "./vibe-button";

declare global {
  interface HTMLElementTagNameMap {
    "vibe-button": VibeButton;
  }

  interface ElementEventMap {
    "test-done": CustomEvent<{ isSuccess: boolean }>;
    "input-changed": CustomEvent<{ name: string; value: string }>;
  }
}
