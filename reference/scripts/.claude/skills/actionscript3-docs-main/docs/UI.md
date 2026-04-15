# ActionScript 3.0 User Interface & Input API Reference

## flash.ui.Mouse

Static class for controlling the mouse cursor appearance.

- `hide()` / `show()`: Toggles cursor visibility.
- `cursor`: The current cursor name (e.g., `MouseCursor.AUTO`, `MouseCursor.BUTTON`, `MouseCursor.HAND`).
- `registerCursor(name:String, data:MouseCursorData)`: Registers a custom cursor using a `Vector.<BitmapData>` for animation.

---

## flash.ui.Keyboard

Static class containing constants for key codes and hardware status.

- `capsLock` / `numLock`: Read-only status of the keys.
- `physicalKeyboardType`: `KeyboardType.ALPHANUMERIC`, `KeyboardType.KEYPAD`, etc.
- **Common Constants**: `A` ... `Z`, `NUMBER_0` ... `NUMBER_9`, `F1` ... `F15`, `UP`, `DOWN`, `LEFT`, `RIGHT`, `SPACE`, `ENTER`, `SHIFT`, `CONTROL`, `ALTERNATE` (Option), `COMMAND`, `BACKSPACE`, `ESCAPE`.

---

## flash.ui.ContextMenu & ContextMenuItem

Used to customize the right-click menu.

- **ContextMenu**:
  - `customItems`: Array of `ContextMenuItem` objects.
  - `hideBuiltInItems()`: Hides default items like "Print" or "Zoom".
  - `clipboardMenu`: If `true`, enables standard copy/paste items.
- **ContextMenuItem**:
  - `label`: Internal name.
  - `caption`: User-visible text.
  - `separatorBefore`: If `true`, adds a line above the item.
  - `enabled` / `visible`: Control state.
  - `ContextMenuEvent.MENU_ITEM_SELECT`: Dispatched when item is clicked.

---

## flash.ui.Multitouch

Static class for managing touch and gesture input.

- `inputMode`: Set to `MultitouchInputMode` constants:
  - `NONE`: Handled as mouse events.
  - `TOUCH_POINT`: Basic touch events (individual points).
  - `GESTURE`: Complex gestures like pinch/zoom.
- `supportsTouchEvents` / `supportsGestureEvents`: Hardware capability checks.
- `maxTouchPoints`: Max simultaneous touches supported.

---

## flash.ui.GameInput

Entry point for game controllers (Joysticks, Gamepads).

- `isSupported`: Capability check.
- `numDevices`: Number of connected controllers.
- `getDeviceAt(index:int)`: Returns a `GameInputDevice`.
- **GameInputDevice**:
  - `enabled`: Must be set to `true` to receive input.
  - `id`, `name`: Hardware identifiers.
  - `numControls`: Number of buttons/axes.
  - `getControlAt(index:int)`: Returns a `GameInputControl`.
- **GameInputControl**:
  - `id`: Button/Axis ID.
  - `value`: Current value (Number).
  - `minValue`, `maxValue`: Range of values.
  - `Event.CHANGE`: Dispatched when the control state changes.

---

## Key Input Events (flash.events)

- `KeyboardEvent.KEY_DOWN` / `KeyboardEvent.KEY_UP`:
  - `keyCode`: Numeric code.
  - `charCode`: Character code.
  - `shiftKey`, `ctrlKey`, `altKey`: Modifier status.
- `TouchEvent.TOUCH_BEGIN` / `TOUCH_END` / `TOUCH_MOVE`:
  - `touchPointID`: Unique ID for each finger.
  - `isPrimaryTouchPoint`: Whether it's the first finger down.
- `TransformGestureEvent.GESTURE_ZOOM` / `GESTURE_ROTATE` / `GESTURE_PAN`:
  - `scaleX` / `scaleY`, `rotation`, `offsetX` / `offsetY`.
  - `phase`: `GesturePhase.BEGIN`, `UPDATE`, `END`.
