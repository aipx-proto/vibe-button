# Vibe SDK documentation

## Install

Include a script tag in <head> of html

```html
<script type="module" src="https://esm.sh/vibe-sdk"></script>
``

Put the settings button somewhere in the <body> of your HTML

```html
<vibe-settings-button></vibe-settings-button>
```

To display it at a specific corner of the screen, set `position`. Default is `"bottom-right"`.

```html
<vibe-settings-button position="top-right"></vibe-settings-button>
<vibe-settings-button position="top-left"></vibe-settings-button>
<vibe-settings-button position="bottom-right"></vibe-settings-button>
<vibe-settings-button position="bottom-left"></vibe-settings-button>
```

## Usage

The user can click the <vibe-settings-button> to open the settings dialog where they can provide Azure OpenAI endpoint, deployment name, and API key

The developer can get the SDK instance by querying the button element:

```javascript
const client = document.querySelector('vibe-settings-button').getClient();
```

The `client` object is the same as the return value of `new AzureOpenAI({...})` as documented in `https://github.com/openai/openai-node`.
Unlike OpenAI, you must retrieve the user selected model from the button element.

```javascript
const { client, model } = document.querySelector('vibe-settings-button');

const response = await client.responses.create({
  model,
  instructions: 'You are a coding assistant that talks like a pirate',
  input: 'Are semicolons optional in JavaScript?',
});

console.log(response.output_text);
```

To stream the response, you can set `stream: true`
```javascript
const { client, model } = document.querySelector('vibe-settings-button');
const stream = await client.responses.create({
  model,
  input: 'Say "Sheep sleep deep" ten times fast!',
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```
