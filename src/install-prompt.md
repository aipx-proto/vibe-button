Help me install the vibe-button library in the approperiate file.

You can load the script dynamically in JavaScript:

```javascript
import("https://esm.sh/vibe-button");
```

Or load the library script in HTML like this

```html
<script type="module" src="https://esm.sh/vibe-button"></script>
```

Then add the vibe-button element like this

```html
<vibe-button></vibe-button>
```

The button is fixed positioned as a float button. If needed, it can be displayed in any of the four corners. The default position is `bottom-right`. Note that the button is positioned within the shadow DOM so you cannot manipulate its position with CSS. This is by design. However, you may set a higher z-index to ensure the button is on top of other elements.

```html
<vibe-button position="top-left"></vibe-button>
<vibe-button position="top-right"></vibe-button>
<vibe-button position="bottom-left"></vibe-button>
<vibe-button position="bottom-right"></vibe-button>
```
