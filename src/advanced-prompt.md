Help me implement an AI Agent chat experience.

## Prequisites - Load AzureOpenAI SDK

I'm using the AzureOpenAI node.js SDK in a browser environment.

I can initialize the AzureOpenSDK using the settings from the `<vibe-button>` element on the page. The button is a custom web component that provides an easy way to interact with the Azure OpenAI API.

```javascript
import { AzureOpenAI } from "https://esm.sh/openai";
```

## Install vibe-button

I need to load the script dynamically in JavaScript:

```javascript
import("https://esm.sh/vibe-button");
```

Or load the library in HTML like this

```html
<script type="module" src="https://esm.sh/vibe-button"></script>
```

The button is fixed positioned as a float button. If needed, it can be displayed in any of the four corners. The default position is `bottom-right`. Note that the button is positioned within the shadow DOM so you cannot manipulate its position with CSS. This is by design.

```html
<vibe-button position="top-left"></vibe-button>
<vibe-button position="top-right"></vibe-button>
<vibe-button position="bottom-left"></vibe-button>
<vibe-button position="bottom-right"></vibe-button>
```

## User experience

The user can click the `<vibe-button>` to open the settings dialog where they can provide Azure OpenAI endpoint, deployment name, and API key

## Integrate with AzureOpenAI SDK

As a developer, I need to get the settings object **after** the vibe-button `<script>` tag is loaded.
I can instantiate an AzureOpenAI client instance using the settings from the button element:

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
