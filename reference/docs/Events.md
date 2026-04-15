# flash.events Package Summary

The ActionScript 3.0 event model, which follows the DOM Level 3 Events specification.

## EventDispatcher

The base class for all classes that dispatch events. It allows any object on the display list to be an event target.

### Key Methods

- `addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void`
  - `useCapture`: If true, listener handles the event during the capture phase.
  - `priority`: Higher numbers are executed first.
  - `useWeakReference`: If true, the listener does not prevent the target from being garbage collected.
- `removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void`
- `dispatchEvent(event:Event):Boolean`: Dispatches an event into the event flow.
- `hasEventListener(type:String):Boolean`: Checks if a listener is registered.
- `willTrigger(type:String):Boolean`: Checks if a listener is registered on this object or any ancestor.

---

## Event

The base class for event objects passed to listeners.

### Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `type` | `String` | The name of the event (case-sensitive). |
| `target` | `Object` | The object that dispatched the event (the "origin"). |
| `currentTarget` | `Object` | The object currently processing the event (the "listener"). |
| `eventPhase` | `uint` | 1: Capture, 2: Target, 3: Bubbling. |
| `bubbles` | `Boolean` | Whether the event moves back up the display list. |
| `cancelable` | `Boolean` | Whether `preventDefault()` can be called. |

### Methods

- `stopPropagation():void`: Prevents the event from moving to the next node in the flow.
- `stopImmediatePropagation():void`: Prevents other listeners on the *current* node from executing.
- `preventDefault():void`: Cancels the default behavior associated with the event (if `cancelable` is true).
- `clone():Event`: Returns a copy of the event (required for custom events).

### Common Event Types

- `Event.ADDED_TO_STAGE`: Dispatched when a display object is added to the stage.
- `Event.REMOVED_FROM_STAGE`: Dispatched when a display object is removed.
- `Event.ENTER_FRAME`: Dispatched at the beginning of every frame.
- `Event.COMPLETE`: Dispatched when a load operation finishes.
- `Event.CHANGE`: Dispatched when a control (like a text field) changes.

---

## MouseEvent (Extends Event)

Dispatched when a mouse/pointer interaction occurs.

### Key Properties

- `localX`, `localY`: Coordinates relative to the `target`.
- `stageX`, `stageY`: Coordinates relative to the Stage (global).
- `buttonDown`: Whether the primary button is pressed.
- `altKey`, `ctrlKey`, `shiftKey`: Whether modifier keys are pressed.

### Common Types

- `MouseEvent.CLICK`, `DOUBLE_CLICK`
- `MouseEvent.MOUSE_DOWN`, `MOUSE_UP`
- `MouseEvent.MOUSE_OVER`, `MOUSE_OUT`, `ROLL_OVER`, `ROLL_OUT`
- `MouseEvent.MOUSE_MOVE`

---

## KeyboardEvent (Extends Event)

Dispatched when keyboard interaction occurs.

### Key Properties

- `keyCode`: Numeric code for the key (e.g., `Keyboard.SPACE`).
- `charCode`: Numeric character code (e.g., `65` for 'A').
- `keyLocation`: Location (Standard, Left, Right, NumPad).

### Common Types

- `KeyboardEvent.KEY_DOWN`
- `KeyboardEvent.KEY_UP`

---

## Example: Event Handling

```actionscript
import flash.events.MouseEvent;

myButton.addEventListener(MouseEvent.CLICK, onClick);

function onClick(event:MouseEvent):void {
    trace("Clicked at: " + event.stageX + ", " + event.stageY);
    // target is myButton
    // currentTarget is whatever object added the listener
}
```
