# Vibe Button

A single button that connects your user to Azure OpenAI.*

[Live demo](https://protovibe.azurewebsites.net/users/chusun/vibe-button-demo/)

> One Button to rule them all  
> One Button to find them  
> One Button to bring them all  
> and in Café 16  
> Vibe them  
> —Gandalf the Vibe

*This is NOT a Microsoft official library.

## Install

Include a script tag in <head> of html

```html
<head>
  <script type="module" src="https://esm.sh/vibe-button"></script>
</head>
```

Put the settings button somewhere in the `<body>` of your HTML

```html
<body>
  <vibe-button></vibe-button>
</body>
```

To display it at a specific corner of the screen, set `position`. Default is `"bottom-right"`.

```html
<vibe-button position="top-right"></vibe-button>
<vibe-button position="top-left"></vibe-button>
<vibe-button position="bottom-right"></vibe-button>
<vibe-button position="bottom-left"></vibe-button>
```

## Usage

The user can click the `<vibe-button>` to open the settings dialog where they can provide Azure OpenAI endpoint, deployment name, and API key

As a developer, you can only query the settings object **after** the SDK script tag is loaded.
You can instantiate an AzureOpenAI client instance using the settings from the button element:

```javascript
const settings = document.querySelector("vibe-button").settings;
```

The `settings` object contains all the necessary properties to construct the `new AzureOpenAI({...})` instance as documented in `https://github.com/openai/openai-node`. Note that the `AzureOpenAI` constructor only requires `endpoint`, `apiKey`, `deployment`, and `apiVersion` properties. The `model` property is only used for creating the response.

```javascript
import { AzureOpenAI } from 'https://esm.sh/openai';

function submitChat() {
  const settings = document.querySelector('vibe-button').settings;
  const client = new AzureOpenAI({
    endpoint: settings.endpoint,
    apiKey: settings.apiKey,
    deployment: settings.deployment,
    apiVersion: settings.apiVersion,
    dangerouslyAllowBrowser: true
  });
  const response = await client.responses.create({
    model: settings.model,
    instructions: 'You are a coding assistant that talks like a pirate',
    input: 'Are semicolons optional in JavaScript?',
  });

  console.log(response.output_text);
}
```

To stream the response, you can set `stream: true`

```javascript
import { AzureOpenAI } from 'https://esm.sh/openai';

function streamChat() {
  const settings = document.querySelector('vibe-button').settings;
  const client = new AzureOpenAI({
    endpoint: settings.endpoint,
    apiKey: settings.apiKey,
    deployment: settings.deployment,
    apiVersion: settings.apiVersion,
    dangerouslyAllowBrowser: true
  });

  const stream = await client.responses.create({
    model: settings.model,
    input: 'Say "Sheep sleep deep" ten times fast!',
    stream: true,
  });

  for await (const event of stream) {
    console.log(event);
    /** Example delta event:
      {
        "type": "response.output_text.delta",
        "item_id": "msg_68438d02463081908f4fdce178bc5c74007cd4a1adc270d4",
        "output_index": 0,
        "content_index": 0,
        "delta": "Sheep, "
      }
    */
  }
}
```

The `AzureOpenAI` constructor is not provided by the SDK.
If in the browser environment, we recommend using `https://esm.sh/openai`. Otherwise, you can use `openai` package from npm.
