Help me install the vibe-button library in the approperiate HTML file. First load the library script in `<head>` element like this

```html
<head>
  <!-- existing code -->
  <script type="module" src="https://esm.sh/vibe-button"></script>
</head>
```

Then add the vibe-button element in `<body>` element like this

```html
<body>
  <!-- existing code -->
  <vibe-button></vibe-button>
</body>
```

The button is fixed positioned as a float button. If needed, it can be displayed in any of the four corners. The default position is `bottom-right`. Note that the button is positioned within the shadow DOM so you cannot manipulate its position with CSS. This is by design.

```html
<vibe-button position="top-left"></vibe-button>
<vibe-button position="top-right"></vibe-button>
<vibe-button position="bottom-left"></vibe-button>
<vibe-button position="bottom-right"></vibe-button>
```
