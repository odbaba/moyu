# ActionScript 3.0 Text Rendering API Reference

## flash.text.TextField

The core class for all text display (Labels) and user input (Inputs). Inherits from `InteractiveObject`.

### Text Content & Alignment

- `text`: Raw text string.
- `htmlText`: Text with HTML tags (supports a subset like `<b>`, `<i>`, `<a>`, `<p>`, `<span>`, `<font>`, `<img>`).
- `autoSize`: Automatically resize the field. Use `TextFieldAutoSize` constants: `LEFT`, `RIGHT`, `CENTER`, `NONE`.
- `wordWrap`: If `true`, text wraps to next line.
- `multiline`: If `true`, field supports multiple lines.

### Input & Interaction

- `type`: Either `TextFieldType.DYNAMIC` (default) or `TextFieldType.INPUT`.
- `selectable`: Whether user can select text.
- `restrict`: Restricts characters user can enter (e.g., `"0-9"`).
- `maxChars`: Maximum number of characters allowed.
- `displayAsPassword`: Hides characters with asterisks.
- `useRichTextClipboard`: Preserves formatting when copying/pasting.

### Formatting & Styles

- `defaultTextFormat`: The `TextFormat` applied to any NEW text inserted.
- `setTextFormat(format:TextFormat, beginIndex:int = -1, endIndex:int = -1)`: Applies formatting to a range or the whole field (existing text).
- `getTextFormat(beginIndex:int = -1, endIndex:int = -1)`: Returns the format for a range.
- `styleSheet`: A `StyleSheet` object for CSS-based formatting (makes field read-only).
- `embedFonts`: Set to `true` if using fonts exported in the SWF library.
- `sharpness`, `thickness`, `antiAliasType`: Rendering quality settings.

### Scrolling & Metrics

- `scrollV` / `scrollH`: Current vertical/horizontal scroll position (1-based).
- `maxScrollV` / `maxScrollH`: Maximum scroll values.
- `textWidth` / `textHeight`: Dimensions of the text content itself (independent of field size).
- `numLines`: Total number of lines.
- `getLineMetrics(lineIndex:int)`: Returns `TextLineMetrics` (ascent, descent, leading, etc.).

### Events

- `Event.CHANGE`: Dispatched when user changes input text.
- `TextEvent.TEXT_INPUT`: Dispatched before text is committed to the field. Can be cancelled.
- `TextEvent.LINK`: Dispatched when user clicks an `<a href="event:myData">` link.
- `Event.SCROLL`: Dispatched when text is scrolled.

---

## flash.text.TextFormat

Defines character and paragraph formatting.

- `font`: Font name string (e.g., `"Arial"`, `"_sans"`).
- `size`: Font size in pixels.
- `color`: Hex color (e.g., `0xFF0000`).
- `bold`, `italic`, `underline`: Boolean style toggles.
- `align`: `TextFormatAlign` (`LEFT`, `RIGHT`, `CENTER`, `JUSTIFY`).
- `leading`: Vertical space between lines.
- `letterSpacing`: Horizontal space between characters.
- `leftMargin`, `rightMargin`, `indent`: Paragraph indentation.
- `url`: Makes text a clickable hyperlink.
- `target`: Target window for the `url` (e.g., `"_blank"`).
- `bullet`: If `true`, the paragraph is bulleted.
- `tabStops`: Array of non-negative integers for custom tab positions.

---

## flash.text.StyleSheet

Handles CSS styles for `htmlText`.

- `parseCSS(CSSText:String)`: Parses a CSS string.
- `setStyle(styleName:String, styleObject:Object)`: Defines a style manually (e.g., `sheet.setStyle(".red", {color:'#FF0000'})`).
- `getStyle(styleName:String)`: Retrieves a style object.
- `styleNames`: Array of registered style names.

---

## flash.text.Font

Manages embedded fonts.

- `static enumerateFonts(enumerateDeviceFonts:Boolean = false)`: Returns list of available `Font` objects.
- `static registerFont(fontClass:Class)`: Registers a font embedded in a project.
- `fontName`: The name of the font.
- `fontType`: `FontType.EMBEDDED`, `FontType.DEVICE`, etc.
- `fontStyle`: `FontStyle.REGULAR`, `FontStyle.BOLD`, etc.

---

## Utility Classes

- `TextFieldAutoSize`: `CENTER`, `LEFT`, `NONE`, `RIGHT`.
- `TextFieldType`: `DYNAMIC`, `INPUT`.
- `TextFormatAlign`: `CENTER`, `JUSTIFY`, `LEFT`, `RIGHT`.
- `AntiAliasType`: `NORMAL`, `ADVANCED`.
- `GridFitType`: `NONE`, `PIXEL`, `SUBPIXEL`.
