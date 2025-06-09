Help me implement the reset feature of an AI Agent chat experience. I can access the chat API by quering the `<vibe-button>` element on the page. I can submit new messages with the `send` method. The button will remember all the messages sent during the session. I need to call `reset` to clear the memory.

```javascript
const vibeButton = document.querySelector("vibe-button");
if (!vibeButton) window.alert("Vibe Button not found!");
vibeButton.send("Hello, AI!").then((response) => {
  console.log("AI response:", response);
});

vibeButton.reset(); // <- This clears the memory
```
