# flash.accessibility

Screen reader and assistive technology support for visually impaired users.

**Platform Support**: Desktop only (Windows with MSAA/JAWS, macOS with VoiceOver). Not supported on mobile browsers or AIR for TV.

---

## Accessibility

Static class for managing communication with screen readers and querying accessibility support.

### Static Properties

- `active:Boolean`: (Read-only) Returns `true` if a screen reader is currently active and communicating with the application.

### Static Methods

#### updateProperties():void

Forces the runtime to update accessibility information and notify the screen reader of changes.

Call this after dynamically changing accessible properties (via `AccessibilityProperties`) to ensure screen readers receive updates immediately.

**Example**:

```actionscript
var button:Sprite = new Sprite();
button.accessibilityProperties = new AccessibilityProperties();
button.accessibilityProperties.name = "Submit Button";
button.accessibilityProperties.description = "Click to submit the form";
Accessibility.updateProperties(); // Notify screen reader
```

### Checking Support

Use `Capabilities.hasAccessibility` to determine if the OS supports accessibility aids:

```actionscript
import flash.system.Capabilities;
import flash.accessibility.Accessibility;

if (Capabilities.hasAccessibility) {
    trace("Accessibility support is available");
    if (Accessibility.active) {
        trace("A screen reader is currently active");
    }
}
```

---

## AccessibilityProperties

Defines accessible properties for a `DisplayObject`. Assign an instance to `DisplayObject.accessibilityProperties` to make an object accessible to screen readers.

### Constructor

- `new AccessibilityProperties()`: Creates an AccessibilityProperties object.

### Properties

- `name:String`: The accessible name of the object (read by screen readers). Equivalent to an `alt` attribute in HTML.
- `description:String`: A detailed description of the object. Provides additional context beyond the name.
- `shortcut:String`: Keyboard shortcut for the object (e.g., "Ctrl+S"). Screen readers announce this to users.
- `silent:Boolean`: If `true`, the object is ignored by screen readers. Useful for decorative elements.
- `forceSimple:Boolean`: If `true`, forces simple accessibility (no child elements exposed). Useful for complex objects that should be treated as a single unit.
- `noAutoLabeling:Boolean`: If `true`, prevents automatic label assignment from adjacent text. By default, Flash may associate nearby text as a label.

### Example: Accessible Button

```actionscript
var button:Sprite = new Sprite();
button.graphics.beginFill(0x0000FF);
button.graphics.drawRect(0, 0, 100, 30);

var props:AccessibilityProperties = new AccessibilityProperties();
props.name = "Submit";
props.description = "Submit the form to the server";
props.shortcut = "Ctrl+Enter";
button.accessibilityProperties = props;

Accessibility.updateProperties();
```

### Example: Hiding Decorative Elements

```actionscript
var decorativeImage:Bitmap = new Bitmap(bitmapData);
var props:AccessibilityProperties = new AccessibilityProperties();
props.silent = true; // Screen readers will skip this image
decorativeImage.accessibilityProperties = props;

Accessibility.updateProperties();
```

---

## AccessibilityImplementation

Base class for custom accessibility implementations. Extend this class to provide specialized accessibility behavior for custom components.

**Note**: Most applications do not need to implement this class. Use `AccessibilityProperties` for standard accessibility needs.

### Properties

- `errno:uint`: Error code for the most recent accessibility operation.
- `stub:Boolean`: If `true`, indicates this is a placeholder implementation with no real functionality.

### Methods

Override these methods to provide custom accessibility behavior:

#### get_accRole(childID:uint):uint

Returns the MSAA role constant for the object or child.

#### get_accName(childID:uint):String

Returns the accessible name for the object or child.

#### get_accValue(childID:uint):String

Returns the accessible value for the object or child (e.g., slider position, text field content).

#### get_accState(childID:uint):uint

Returns the MSAA state flags for the object or child (e.g., focused, checked, unavailable).

#### get_accDefaultAction(childID:uint):String

Returns the default action description (e.g., "Press" for a button).

#### accDoDefaultAction(childID:uint):void

Performs the default action for the object or child (e.g., click a button, toggle a checkbox).

#### get_accFocus():uint

Returns the childID of the currently focused child, or 0 if the parent is focused.

#### get_accSelection():Array

Returns an array of childIDs for selected children.

#### isLabeledBy(labelBounds:Rectangle):Boolean

Called by the runtime to determine if a text object labels this object.

### Example: Custom Slider Accessibility

```actionscript
package {
    import flash.accessibility.AccessibilityImplementation;
    import flash.accessibility.AccessibilityProperties;
    
    public class SliderAccessibility extends AccessibilityImplementation {
        private var _slider:CustomSlider;
        
        public function SliderAccessibility(slider:CustomSlider) {
            _slider = slider;
        }
        
        override public function get_accRole(childID:uint):uint {
            return 0x33; // ROLE_SYSTEM_SLIDER (MSAA constant)
        }
        
        override public function get_accName(childID:uint):String {
            return _slider.label || "Slider";
        }
        
        override public function get_accValue(childID:uint):String {
            return String(_slider.value);
        }
        
        override public function get_accState(childID:uint):uint {
            var state:uint = 0x0;
            if (_slider.enabled) {
                state |= 0x00000004; // STATE_SYSTEM_FOCUSABLE
            } else {
                state |= 0x00000001; // STATE_SYSTEM_UNAVAILABLE
            }
            return state;
        }
    }
}
```

---

## ISearchableText

Interface for objects that support text search by screen readers. Implement this to allow screen readers to search within your custom text components.

### Methods

- `searchText(text:String):int`: Searches for `text` in the object. Returns the index of the match, or -1 if not found.

**Note**: Very rarely used. Most applications use `TextField` which already supports searchable text.

---

## ISimpleTextSelection

Interface for objects that support basic text selection by screen readers. Implement this for custom text components.

### Properties

- `selectionAnchorIndex:int`: The character index where the selection starts.
- `selectionActiveIndex:int`: The character index where the selection ends.

### Methods

- `setSelection(anchorIndex:int, activeIndex:int):void`: Sets the text selection range.

**Note**: Most applications use `TextField` which already implements this interface.

---

## Best Practices

### 1. Always Provide Names

Every interactive element should have an accessible name:

```actionscript
// ✅ Good
var button:Sprite = createButton();
button.accessibilityProperties = new AccessibilityProperties();
button.accessibilityProperties.name = "Save Document";
Accessibility.updateProperties();

// ❌ Bad - No accessible name
var button:Sprite = createButton();
// Screen readers won't know what this button does
```

### 2. Hide Decorative Elements

Mark non-functional, decorative elements as silent:

```actionscript
var backgroundImage:Bitmap = new Bitmap(bitmapData);
var props:AccessibilityProperties = new AccessibilityProperties();
props.silent = true;
backgroundImage.accessibilityProperties = props;
```

### 3. Use Descriptions for Complex Objects

For objects that need more explanation:

```actionscript
var chart:Sprite = createComplexChart();
chart.accessibilityProperties = new AccessibilityProperties();
chart.accessibilityProperties.name = "Sales Chart";
chart.accessibilityProperties.description = "Bar chart showing quarterly sales from January to December. Q4 had the highest sales at $500K.";
Accessibility.updateProperties();
```

### 4. Update After Dynamic Changes

Call `Accessibility.updateProperties()` after changing accessible properties:

```actionscript
function updateButtonLabel(newLabel:String):void {
    button.accessibilityProperties.name = newLabel;
    Accessibility.updateProperties(); // Important!
}
```

### 5. Test with Actual Screen Readers

- **Windows**: JAWS, NVDA, Narrator
- **macOS**: VoiceOver

Enable the screen reader and navigate your app using only the keyboard to ensure all functionality is accessible.

### 6. Support Keyboard Navigation

Accessibility depends on keyboard support. Ensure all interactive elements are reachable via Tab key:

```actionscript
button.tabEnabled = true;
button.tabIndex = 1;
```

### 7. Provide Focus Indicators

Visual focus indicators help all users, not just screen reader users:

```actionscript
button.addEventListener(FocusEvent.FOCUS_IN, function(e:Event):void {
    button.filters = [new GlowFilter(0x0000FF)];
});

button.addEventListener(FocusEvent.FOCUS_OUT, function(e:Event):void {
    button.filters = [];
});
```

---

## MSAA Role Constants

Common Microsoft Active Accessibility (MSAA) roles for `get_accRole()`:

| Role | Constant | Value |
|------|----------|-------|
| Button | `ROLE_SYSTEM_PUSHBUTTON` | 0x2B (43) |
| CheckBox | `ROLE_SYSTEM_CHECKBUTTON` | 0x2C (44) |
| ComboBox | `ROLE_SYSTEM_COMBOBOX` | 0x2E (46) |
| Link | `ROLE_SYSTEM_LINK` | 0x1E (30) |
| List | `ROLE_SYSTEM_LIST` | 0x21 (33) |
| Menu | `ROLE_SYSTEM_MENUPOPUP` | 0x0B (11) |
| MenuItem | `ROLE_SYSTEM_MENUITEM` | 0x0C (12) |
| RadioButton | `ROLE_SYSTEM_RADIOBUTTON` | 0x2D (45) |
| ScrollBar | `ROLE_SYSTEM_SCROLLBAR` | 0x03 (3) |
| Slider | `ROLE_SYSTEM_SLIDER` | 0x33 (51) |
| Text | `ROLE_SYSTEM_TEXT` | 0x2A (42) |
| StaticText | `ROLE_SYSTEM_STATICTEXT` | 0x29 (41) |

---

## MSAA State Constants

Common MSAA state flags for `get_accState()`:

| State | Constant | Value |
|-------|----------|-------|
| Unavailable (Disabled) | `STATE_SYSTEM_UNAVAILABLE` | 0x00000001 |
| Focused | `STATE_SYSTEM_FOCUSED` | 0x00000004 |
| Focusable | `STATE_SYSTEM_FOCUSABLE` | 0x00100000 |
| Checked | `STATE_SYSTEM_CHECKED` | 0x00000010 |
| Pressed | `STATE_SYSTEM_PRESSED` | 0x00000008 |
| Invisible | `STATE_SYSTEM_INVISIBLE` | 0x00008000 |
| Offscreen | `STATE_SYSTEM_OFFSCREEN` | 0x00010000 |

---

## Platform Notes

### Windows

- Supports MSAA (Microsoft Active Accessibility) for JAWS, NVDA, and Narrator.
- AIR 2+ supports JAWS 11 or higher.
- Flash Player supports most Windows screen readers.

### macOS

- Supports VoiceOver via the macOS accessibility APIs.
- Flash Player and AIR integrate with VoiceOver automatically if accessibility properties are set.

### Mobile & TV

- **Not supported** on mobile browsers, AIR for iOS, AIR for Android, or AIR for TV.
- Mobile platforms have their own native accessibility APIs that Flash/AIR does not integrate with.

### Linux

- Limited support. Flash Player may work with Orca screen reader, but support is not guaranteed.

---

## Common Use Cases

### Accessible Form

```actionscript
// Text input field
var nameField:TextField = new TextField();
nameField.type = TextFieldType.INPUT;
nameField.border = true;
var nameProps:AccessibilityProperties = new AccessibilityProperties();
nameProps.name = "Full Name";
nameProps.description = "Enter your full name";
nameField.accessibilityProperties = nameProps;

// Submit button
var submitButton:Sprite = createButton();
var buttonProps:AccessibilityProperties = new AccessibilityProperties();
buttonProps.name = "Submit";
buttonProps.description = "Submit the form";
buttonProps.shortcut = "Enter";
submitButton.accessibilityProperties = buttonProps;

Accessibility.updateProperties();
```

### Accessible Navigation Menu

```actionscript
for (var i:int = 0; i < menuItems.length; i++) {
    var item:Sprite = menuItems[i];
    item.tabEnabled = true;
    item.tabIndex = i + 1;
    
    var props:AccessibilityProperties = new AccessibilityProperties();
    props.name = menuLabels[i];
    props.description = "Navigate to " + menuLabels[i];
    item.accessibilityProperties = props;
}

Accessibility.updateProperties();
```

---

## Resources

- **Adobe Accessibility**: [www.adobe.com/accessibility](https://www.adobe.com/accessibility/)
- **WCAG Guidelines**: [www.w3.org/WAI/WCAG21/quickref](https://www.w3.org/WAI/WCAG21/quickref/)
- **JAWS Screen Reader**: [www.freedomscientific.com/products/software/jaws](https://www.freedomscientific.com/products/software/jaws/)
- **NVDA Screen Reader**: [www.nvaccess.org](https://www.nvaccess.org/)
