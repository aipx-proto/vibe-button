Help me implement an AI Agent chat experience. I can access the chat API by quering the `<vibe-button>` element on the page. I can submit new messages with the `send` method. The response string will be returned asynchronously.

```javascript
const vibeButton = document.querySelector("vibe-button");
if (!vibeButton) window.alert("Vibe Button not found!");
vibeButton.send("Hello, AI!").then((response) => {
  console.log("AI response:", response);
});
```

Note that the button comes with memory for the duration of the session. You can call `reset` to clear the memory.

```javascript
vibeButton.reset();
```
