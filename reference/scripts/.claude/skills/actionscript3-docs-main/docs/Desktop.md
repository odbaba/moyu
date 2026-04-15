# flash.desktop Package **[AIR Only]**

Native desktop application features for Adobe AIR. Provides clipboard access, drag-and-drop, system tray icons, native processes, and application lifecycle management.

## NativeApplication

Central controller for AIR desktop applications. Provides access to application lifecycle, menus, and system integration.

**Static Properties**:
- `nativeApplication: NativeApplication` (read-only): The singleton instance of the application.
- `supportsDefaultApplication: Boolean` (read-only): Whether the OS supports default application registration.
- `supportsMenu: Boolean` (read-only): Whether the OS supports application menus.
- `supportsSystemTrayIcon: Boolean` (read-only): Whether system tray icons are supported (Windows/Linux).
- `supportsDockIcon: Boolean` (read-only): Whether dock icons are supported (macOS).
- `supportsStartAtLogin: Boolean` (read-only): Whether launch at login is supported.

**Instance Properties**:
- `applicationID: String` (read-only): Application identifier from descriptor.
- `autoExit: Boolean`: Whether app exits when all windows close (default: `true`).
- `icon: InteractiveIcon`: System tray or dock icon.
- `idleThreshold: int`: Seconds of inactivity before user is considered idle.
- `menu: NativeMenu`: Application menu (macOS only).
- `openedWindows: Array`: All open windows.
- `startAtLogin: Boolean`: Whether app launches at system startup.
- `timeSinceLastUserInput: int` (read-only): Milliseconds since last user input.

**Methods**:
- `exit(exitCode:int = 0): void`: Exits the application immediately.
- `getDefaultApplication(extension:String): String`: Gets default app for file extension.
- `setAsDefaultApplication(extension:String): void`: Sets this app as default for extension.

**Events**:
- `Event.ACTIVATE`: Application gains focus.
- `Event.DEACTIVATE`: Application loses focus.
- `Event.EXITING`: Application is about to exit (cancellable).
- `Event.NETWORK_CHANGE`: Network connectivity changes.
- `Event.USER_IDLE`: User becomes idle.
- `Event.USER_PRESENT`: User returns from idle state.
- `InvokeEvent.INVOKE`: Application is invoked (launch or reactivation).

**Example**:

```as3
// Prevent auto-exit when last window closes
NativeApplication.nativeApplication.autoExit = false;

// Handle application exit
NativeApplication.nativeApplication.addEventListener(Event.EXITING, function(e:Event):void {
    if (!confirmExit()) {
        e.preventDefault(); // Cancel exit
    }
});

// Monitor user activity
NativeApplication.nativeApplication.addEventListener(Event.USER_IDLE, function(e:Event):void {
    trace("User is idle");
    pauseBackgroundWork();
});
```

## Clipboard

System clipboard access for copy/paste operations. Supports multiple data formats.

**Static Methods**:
- `generalClipboard: Clipboard` (read-only): The system clipboard.

**Methods**:
- `clear(): void`: Clears all clipboard data.
- `clearData(format:String): void`: Clears data of specific format.
- `getData(format:String, transferMode:String = "originalPreferred"): Object`: Retrieves clipboard data.
- `hasFormat(format:String): Boolean`: Checks if clipboard contains format.
- `setData(format:String, data:Object, serializable:Boolean = true): Boolean`: Sets clipboard data.
- `setDataHandler(format:String, handler:Function, serializable:Boolean = true): Boolean`: Sets deferred data handler.

**Common Formats** (ClipboardFormats constants):
- `TEXT_FORMAT`: Plain text
- `HTML_FORMAT`: HTML markup
- `RICH_TEXT_FORMAT`: RTF text
- `BITMAP_FORMAT`: Bitmap image
- `FILE_LIST_FORMAT`: Array of File objects
- `URL_FORMAT`: URL string

**Example**:

```as3
// Copy text to clipboard
Clipboard.generalClipboard.clear();
Clipboard.generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, "Hello, World!");

// Copy multiple formats
Clipboard.generalClipboard.clear();
Clipboard.generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, "Plain text");
Clipboard.generalClipboard.setData(ClipboardFormats.HTML_FORMAT, "<b>HTML text</b>");

// Paste from clipboard
if (Clipboard.generalClipboard.hasFormat(ClipboardFormats.TEXT_FORMAT)) {
    var text:String = Clipboard.generalClipboard.getData(ClipboardFormats.TEXT_FORMAT) as String;
    trace("Pasted: " + text);
}

// Copy files
var files:Array = [new File("path/to/file.txt")];
Clipboard.generalClipboard.clear();
Clipboard.generalClipboard.setData(ClipboardFormats.FILE_LIST_FORMAT, files);
```

## NativeDragManager

Manages drag-and-drop operations between the application and OS.

**Static Methods**:
- `acceptDragDrop(target:InteractiveObject): void`: Accepts a drag operation.
- `doDrag(dragInitiator:InteractiveObject, clipboard:Clipboard, dragImage:BitmapData = null, offset:Point = null, allowedActions:NativeDragOptions = null): void`: Starts a drag operation.
- `dropAction: String` (read-only): The action selected by the user (copy, move, link).
- `isDragging: Boolean` (read-only): Whether a drag is in progress.

**Example - Drag Out Files**:

```as3
var sprite:Sprite = new Sprite();
sprite.addEventListener(MouseEvent.MOUSE_DOWN, function(e:MouseEvent):void {
    var clipboard:Clipboard = new Clipboard();
    var files:Array = [new File("path/to/file.txt")];
    clipboard.setData(ClipboardFormats.FILE_LIST_FORMAT, files);
    
    NativeDragManager.doDrag(sprite, clipboard);
});
```

**Example - Drop Handler**:

```as3
sprite.addEventListener(NativeDragEvent.NATIVE_DRAG_ENTER, function(e:NativeDragEvent):void {
    if (e.clipboard.hasFormat(ClipboardFormats.FILE_LIST_FORMAT)) {
        NativeDragManager.acceptDragDrop(sprite);
    }
});

sprite.addEventListener(NativeDragEvent.NATIVE_DRAG_DROP, function(e:NativeDragEvent):void {
    var files:Array = e.clipboard.getData(ClipboardFormats.FILE_LIST_FORMAT) as Array;
    for each (var file:File in files) {
        trace("Dropped: " + file.nativePath);
    }
});
```

## SystemTrayIcon / DockIcon

Platform-specific application icons in system tray (Windows/Linux) or dock (macOS).

**Common Properties**:
- `bitmaps: Array`: Array of BitmapData objects at different sizes.
- `height: int` (read-only): Icon height in pixels.
- `width: int` (read-only): Icon width in pixels.
- `menu: NativeMenu`: Context menu for the icon.

**SystemTrayIcon Specific**:
- `tooltip: String`: Tooltip text.

**DockIcon Specific**:
- `bounce(priority:String = "informational"): void`: Bounces the dock icon.

**Example**:

```as3
// System tray icon (Windows/Linux)
if (NativeApplication.supportsSystemTrayIcon) {
    var icon:SystemTrayIcon = NativeApplication.nativeApplication.icon as SystemTrayIcon;
    icon.tooltip = "My Application";
    icon.bitmaps = [icon16x16, icon32x32];
    
    // Add context menu
    var menu:NativeMenu = new NativeMenu();
    menu.addItem(new NativeMenuItem("Show Window"));
    menu.addItem(new NativeMenuItem("Exit"));
    icon.menu = menu;
}

// Dock icon (macOS)
if (NativeApplication.supportsDockIcon) {
    var dockIcon:DockIcon = NativeApplication.nativeApplication.icon as DockIcon;
    dockIcon.bounce("critical"); // Bounce until user responds
}
```

## NativeProcess

Launch and communicate with native processes (command-line programs).

**Constructor**: `NativeProcess()`

**Properties**:
- `running: Boolean` (read-only): Whether process is running.
- `standardInput: IDataOutput`: Stream for writing to process stdin.
- `standardOutput: IDataInput`: Stream for reading from process stdout.
- `standardError: IDataInput`: Stream for reading from process stderr.

**Methods**:
- `start(info:NativeProcessStartupInfo): void`: Starts the process.
- `exit(force:Boolean = false): void`: Terminates the process.

**Events**:
- `ProgressEvent.STANDARD_OUTPUT_DATA`: Data available on stdout.
- `ProgressEvent.STANDARD_ERROR_DATA`: Data available on stderr.
- `NativeProcessExitEvent.EXIT`: Process has exited.
- `IOErrorEvent.STANDARD_OUTPUT_IO_ERROR`: stdout error.
- `IOErrorEvent.STANDARD_ERROR_IO_ERROR`: stderr error.

**Example**:

```as3
var process:NativeProcess = new NativeProcess();
var info:NativeProcessStartupInfo = new NativeProcessStartupInfo();
info.executable = new File("/bin/ls");
info.arguments = Vector.<String>(["-la"]);

process.addEventListener(ProgressEvent.STANDARD_OUTPUT_DATA, function(e:ProgressEvent):void {
    var output:String = process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable);
    trace("Output: " + output);
});

process.addEventListener(NativeProcessExitEvent.EXIT, function(e:NativeProcessExitEvent):void {
    trace("Process exited with code: " + e.exitCode);
});

process.start(info);
```

## NativeProcessStartupInfo

Configuration for launching native processes.

**Properties**:
- `arguments: Vector.<String>`: Command-line arguments.
- `executable: File`: The executable file to launch.
- `workingDirectory: File`: Working directory for the process.

**Example**:

```as3
var info:NativeProcessStartupInfo = new NativeProcessStartupInfo();
info.executable = new File("C:\\Windows\\System32\\cmd.exe");
info.arguments = new Vector.<String>();
info.arguments.push("/c", "dir");
info.workingDirectory = File.documentsDirectory;
```

## Updater

Simple application update mechanism (basic version - see air.update for full updater).

**Static Methods**:
- `update(url:String): void`: Updates the application from the specified AIR file URL.

**Example**:

```as3
// Simple update
Updater.update("http://example.com/app-update.air");
```

**Note**: For production apps, use the more robust `air.update.ApplicationUpdater` framework.

## InvokeEventReason

Constants for why an application was invoked.

**Constants**:
- `LOGIN`: Launched at system login.
- `NOTIFICATION`: Launched from notification.
- `OPEN_URL`: Opened via URL scheme.
- `STANDARD`: Normal launch.

## SystemIdleMode

Constants for system sleep behavior.

**Constants**:
- `KEEP_AWAKE`: Prevent system sleep.
- `NORMAL`: Allow normal system sleep.

**Example**:

```as3
// Prevent system sleep during video playback
NativeApplication.nativeApplication.systemIdleMode = SystemIdleMode.KEEP_AWAKE;

// Restore normal behavior
NativeApplication.nativeApplication.systemIdleMode = SystemIdleMode.NORMAL;
```

## Best Practices

- Always check support flags before using platform-specific features
- Handle `InvokeEvent.INVOKE` to support file associations and URL schemes
- Set `autoExit = false` for applications that should persist without windows
- Use deferred clipboard data handlers for large data to improve performance
- Validate dropped files before processing them
- Clean up NativeProcess listeners to prevent memory leaks

## See Also

- `flash.filesystem.File` - File system access
- `flash.events.InvokeEvent` - Application invocation events
- `flash.events.NativeDragEvent` - Drag-and-drop events
- `air.update.ApplicationUpdater` - Full-featured updater framework
