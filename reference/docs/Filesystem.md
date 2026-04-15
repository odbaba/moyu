# flash.filesystem

**[AIR Only]** File system access for reading, writing, and navigating files and directories in Adobe AIR applications.

---

## File

Represents a path to a file or directory. Extends `FileReference` (available in Flash Player), adding AIR-specific file system operations.

### Constructor
- `new File(path:String = null)`: Creates a File object for the specified native path.

### Static Directory Properties

These cross-platform properties point to standard system locations:

- `applicationDirectory:File`: (Read-only) The directory where the AIR application is installed. **Do not write to this directory** (may invalidate app signature).
- `applicationStorageDirectory:File`: A private storage directory unique to the AIR application. Use this for internal app data.
- `applicationRemovableStorageDirectory:File`: **[Android only]** Storage on external/removable media.
- `cacheDirectory:File`: **[AIR 3.6+]** A cache directory for temporary files that may be deleted by the OS.
- `desktopDirectory:File`: The user's desktop folder.
- `documentsDirectory:File`: The user's documents folder.
- `userDirectory:File`: The user's home directory.

### Static Properties
- `separator:String`: Platform path separator ("/" on macOS/Linux, "\" on Windows).
- `lineEnding:String`: Platform line ending ("\n" on macOS/Linux, "\r\n" on Windows).
- `systemCharset:String`: Default character encoding for the OS (e.g., "UTF-8", "windows-1252").

### Instance Properties
- `nativePath:String`: The platform-specific path string (e.g., `C:\Users\...` on Windows, `/Users/...` on macOS).
- `url:String`: The file:// URL representation of the path.
- `exists:Boolean`: (Read-only) `true` if the file or directory exists.
- `isDirectory:Boolean`: (Read-only) `true` if this is a directory.
- `isHidden:Boolean`: (Read-only) `true` if hidden by the OS.
- `isPackage:Boolean`: (Read-only) **[macOS only]** `true` if the directory is an application package (.app).
- `isSymbolicLink:Boolean`: (Read-only) `true` if this is a symbolic link.
- `parent:File`: (Read-only) The parent directory. `null` if at root.
- `spaceAvailable:Number`: (Read-only) Available disk space in bytes on the volume containing this path.
- `icon:Array`: (Read-only) An array of `BitmapData` representing the file's icon at various sizes.
- `downloaded:Boolean`: (Read-only) **[AIR 3.5+]** `true` if the file was downloaded from the Internet (macOS quarantine flag).
- `preventBackup:Boolean`: **[AIR 3.5+, iOS only]** If `true`, excludes file from iCloud backup.
- `permissionStatus:String`: **[AIR 25+, Android 6+ only]** Permission status for external storage (`"granted"`, `"denied"`, `"unknown"`).

### Path Methods

#### resolvePath(path:String):File
Returns a new File object for a path relative to this File. Supports `..` for parent directory.

```actionscript
var appDir:File = File.applicationDirectory;
var configFile:File = appDir.resolvePath("config/settings.xml");
```

#### getRelativePath(referenceFile:File, useDotDot:Boolean = false):String
Gets the relative path from `referenceFile` to this File.

#### canonicalize():void
Resolves symbolic links and normalizes the path (removes `.` and `..`).

#### clone():File
Creates a copy of the File object.

### Static Creation Methods

#### getRootDirectories():Array
Returns an array of File objects representing filesystem roots (e.g., C:\, D:\ on Windows; / on macOS/Linux).

#### createTempFile():File
**[AIR 1.5+]** Creates a temporary file in the OS temp directory with a unique name.

#### createTempDirectory():File
**[AIR 1.5+]** Creates a temporary directory in the OS temp directory with a unique name.

### Browse Methods

Opens native file/folder picker dialogs. These are **asynchronous** and dispatch events when complete.

#### browseForOpen(title:String = null, typeFilter:Array = null):void
Opens a dialog for the user to select a file to open.

#### browseForOpenMultiple(title:String = null, typeFilter:Array = null):void
Opens a dialog for the user to select multiple files.

#### browseForSave(title:String = null):void
Opens a dialog for the user to specify a file path to save.

#### browseForDirectory(title:String = null):void
Opens a dialog for the user to select a directory.

**Events**:
- `Event.SELECT`: Dispatched when user selects a file/directory.
- `Event.CANCEL`: Dispatched when user cancels the dialog.
- `FileListEvent.SELECT_MULTIPLE`: Dispatched when user selects multiple files (for `browseForOpenMultiple`).

**Type Filter Example**:
```actionscript
var imageFilter:FileFilter = new FileFilter("Images", "*.jpg;*.png;*.gif");
var docFilter:FileFilter = new FileFilter("Documents", "*.pdf;*.doc");
file.browseForOpen("Select a file", [imageFilter, docFilter]);
```

### File Operations

#### deleteFile():void
Deletes the file **synchronously**. Throws error if it's a directory or doesn't exist.

#### deleteFileAsync():void
Deletes the file **asynchronously**.

**Events**: `Event.COMPLETE`, `IOErrorEvent.IO_ERROR`

#### deleteDirectory(deleteDirectoryContents:Boolean = false):void
Deletes the directory **synchronously**. If `deleteDirectoryContents = true`, removes all contents recursively.

#### deleteDirectoryAsync(deleteDirectoryContents:Boolean = false):void
Deletes the directory **asynchronously**.

**Events**: `Event.COMPLETE`, `IOErrorEvent.IO_ERROR`

#### copyTo(newLocation:File, overwrite:Boolean = false):void
Copies file or directory **synchronously**. If `overwrite = false`, throws error if destination exists.

#### copyToAsync(newLocation:File, overwrite:Boolean = false):void
Copies file or directory **asynchronously**.

**Events**: `Event.COMPLETE`, `IOErrorEvent.IO_ERROR`, `ProgressEvent.PROGRESS`

#### moveTo(newLocation:File, overwrite:Boolean = false):void
Moves/renames file or directory **synchronously**.

#### moveToAsync(newLocation:File, overwrite:Boolean = false):void
Moves/renames file or directory **asynchronously**.

**Events**: `Event.COMPLETE`, `IOErrorEvent.IO_ERROR`, `ProgressEvent.PROGRESS`

#### moveToTrash():void
**[AIR 2+]** Moves file or directory to OS trash/recycle bin **synchronously**.

#### moveToTrashAsync():void
**[AIR 2+]** Moves file or directory to trash **asynchronously**.

**Events**: `Event.COMPLETE`, `IOErrorEvent.IO_ERROR`

#### createDirectory():void
Creates the directory and any missing parent directories. Does nothing if directory already exists.

#### getDirectoryListing():Array
**Synchronously** returns an array of File objects representing directory contents. Throws error if not a directory.

#### getDirectoryListingAsync():void
**Asynchronously** retrieves directory contents.

**Events**: `FileListEvent.DIRECTORY_LISTING` (contains `files:Array` property)

### Other Methods

#### openWithDefaultApplication():void
**[AIR 1.5+]** Opens the file with the OS default application (e.g., opens .txt in Notepad).

#### cancel():void
Cancels an ongoing async operation (browse, copy, move, delete, directory listing).

#### requestPermission():void
**[AIR 25+, Android 6+ only]** Requests external storage permission if not yet granted.

**Events**: `PermissionEvent.PERMISSION_STATUS`

### Example: Reading a Configuration File
```actionscript
var configFile:File = File.applicationStorageDirectory.resolvePath("config.txt");

if (configFile.exists) {
    var stream:FileStream = new FileStream();
    stream.open(configFile, FileMode.READ);
    var content:String = stream.readUTFBytes(stream.bytesAvailable);
    stream.close();
    trace("Config: " + content);
} else {
    trace("Config file not found");
}
```

### Example: Asynchronous Directory Listing
```actionscript
var dir:File = File.documentsDirectory;
dir.addEventListener(FileListEvent.DIRECTORY_LISTING, onListing);
dir.getDirectoryListingAsync();

function onListing(event:FileListEvent):void {
    for each (var file:File in event.files) {
        trace(file.name + (file.isDirectory ? " [DIR]" : ""));
    }
}
```

---

## FileStream

Used to read and write files. Implements `IDataInput` and `IDataOutput`, providing binary and text I/O.

### Constructor
- `new FileStream()`: Creates a FileStream object.

### Opening Files

#### open(file:File, fileMode:String):void
Opens a file **synchronously** in the specified mode. Blocks until file is ready.

#### openAsync(file:File, fileMode:String):void
Opens a file **asynchronously**. Does not block. Listen for events to know when data is ready.

**File Modes** (see `FileMode` constants):
- `READ`: Open for reading only.
- `WRITE`: Open for writing. Creates file if it doesn't exist. Truncates existing file to 0 bytes.
- `APPEND`: Open for writing at the end of file. Creates file if it doesn't exist.
- `UPDATE`: Open for reading and writing. Does not truncate. Creates file if it doesn't exist.

### Properties
- `bytesAvailable:uint`: (Read-only) Number of bytes available to read from the current position.
- `position:Number`: Current read/write position in the file (in bytes). Can be set to seek.
- `readAhead:Number`: **[Async only]** Number of bytes to buffer ahead. Default is 4096. Higher values improve performance for sequential reads.
- `endian:String`: Byte order for multi-byte reads/writes. `Endian.BIG_ENDIAN` or `Endian.LITTLE_ENDIAN`. Default is `BIG_ENDIAN`.
- `objectEncoding:uint`: AMF encoding version for `readObject()`/`writeObject()`. Use `ObjectEncoding.AMF0` or `ObjectEncoding.AMF3`.

### Reading Methods

All read methods are **synchronous** and read from the internal buffer (check `bytesAvailable` first).

- `readBoolean():Boolean`: Reads 1 byte as a Boolean.
- `readByte():int`: Reads 1 signed byte (-128 to 127).
- `readUnsignedByte():uint`: Reads 1 unsigned byte (0 to 255).
- `readShort():int`: Reads 2 bytes as signed short (-32768 to 32767).
- `readUnsignedShort():uint`: Reads 2 bytes as unsigned short (0 to 65535).
- `readInt():int`: Reads 4 bytes as signed int.
- `readUnsignedInt():uint`: Reads 4 bytes as unsigned int.
- `readFloat():Number`: Reads 4 bytes as IEEE 754 single-precision float.
- `readDouble():Number`: Reads 8 bytes as IEEE 754 double-precision float.
- `readBytes(bytes:ByteArray, offset:uint = 0, length:uint = 0):void`: Reads bytes into a ByteArray.
- `readUTFBytes(length:uint):String`: Reads UTF-8 bytes as a string (length in bytes, not characters).
- `readUTF():String`: Reads a UTF-8 string prefixed with a 16-bit length.
- `readMultiByte(length:uint, charSet:String):String`: Reads a string in the specified character set.
- `readObject():*`: Reads an AMF-encoded object.

### Writing Methods

All write methods are **synchronous** (async mode buffers and writes in background).

- `writeBoolean(value:Boolean):void`: Writes 1 byte.
- `writeByte(value:int):void`: Writes 1 signed byte.
- `writeShort(value:int):void`: Writes 2 bytes.
- `writeInt(value:int):void`: Writes 4 bytes.
- `writeUnsignedInt(value:uint):void`: Writes 4 bytes.
- `writeFloat(value:Number):void`: Writes 4 bytes.
- `writeDouble(value:Number):void`: Writes 8 bytes.
- `writeBytes(bytes:ByteArray, offset:uint = 0, length:uint = 0):void`: Writes bytes from a ByteArray.
- `writeUTFBytes(value:String):void`: Writes a UTF-8 string (no length prefix).
- `writeUTF(value:String):void`: Writes a UTF-8 string with 16-bit length prefix.
- `writeMultiByte(value:String, charSet:String):void`: Writes a string in the specified character set.
- `writeObject(object:*):void`: Writes an AMF-encoded object.

### Other Methods

#### close():void
Closes the file stream. Always call this when done to release the file handle.

#### truncate():void
**[AIR 1.5+]** Truncates the file at the current `position`. Useful for overwriting part of a file without rewriting the entire file.

### Events (Async Mode Only)
- `Event.OPEN`: Dispatched when file is successfully opened.
- `ProgressEvent.PROGRESS`: Dispatched as data becomes available for reading or as write buffer is flushed.
- `Event.COMPLETE`: Dispatched when all data has been read or written.
- `IOErrorEvent.IO_ERROR`: Dispatched on I/O errors.
- `Event.CLOSE`: Dispatched when file is closed.

### Example: Writing Text Synchronously
```actionscript
var file:File = File.applicationStorageDirectory.resolvePath("log.txt");
var stream:FileStream = new FileStream();
stream.open(file, FileMode.WRITE);
stream.writeUTFBytes("Hello, AIR!\n");
stream.close();
```

### Example: Reading Binary Data Asynchronously
```actionscript
var file:File = File.desktopDirectory.resolvePath("data.bin");
var stream:FileStream = new FileStream();

stream.addEventListener(Event.COMPLETE, onComplete);
stream.openAsync(file, FileMode.READ);

function onComplete(event:Event):void {
    var value:int = stream.readInt();
    trace("Read value: " + value);
    stream.close();
}
```

### Example: Appending to a Log File
```actionscript
var logFile:File = File.applicationStorageDirectory.resolvePath("debug.log");
var stream:FileStream = new FileStream();
stream.open(logFile, FileMode.APPEND);
stream.writeUTFBytes(new Date().toString() + ": Application started\n");
stream.close();
```

---

## FileMode

Constants for file opening modes.

### Constants
- `READ:String = "read"`: Open for reading. File must exist.
- `WRITE:String = "write"`: Open for writing. Creates file if missing. Truncates to 0 bytes if exists.
- `APPEND:String = "append"`: Open for writing at end. Creates file if missing. Does not truncate.
- `UPDATE:String = "update"`: Open for reading and writing. Creates file if missing. Does not truncate. Use `position` to seek.

---

## StorageVolume

**[AIR 3.4+]** Represents a mounted storage volume (hard drive, USB drive, SD card, etc.).

### Properties
- `drive:String`: (Read-only) Drive letter (Windows only, e.g., "C:").
- `name:String`: (Read-only) User-friendly volume name.
- `fileSystemType:String`: (Read-only) Type of filesystem (e.g., "NTFS", "FAT32", "HFS+", "ext4").
- `isRemovable:Boolean`: (Read-only) `true` if the volume is removable (USB, SD card).
- `isWritable:Boolean`: (Read-only) `true` if the volume is writable.
- `rootDirectory:File`: (Read-only) File object pointing to the root of the volume.

### Methods
- `getDirectoryListing():Vector.<File>`: Returns contents of the root directory.

---

## StorageVolumeInfo

**[AIR 3.4+]** Static class for querying available storage volumes.

### Static Properties
- `storageVolumeInfo:StorageVolumeInfo`: Singleton instance.

### Methods
- `getStorageVolumes():Vector.<StorageVolume>`: Returns all currently mounted storage volumes.

### Events
- `StorageVolumeChangeEvent.STORAGE_VOLUME_MOUNT`: Dispatched when a volume is mounted.
- `StorageVolumeChangeEvent.STORAGE_VOLUME_UNMOUNT`: Dispatched when a volume is unmounted.

### Example: Listing All Volumes
```actionscript
var volumes:Vector.<StorageVolume> = StorageVolumeInfo.storageVolumeInfo.getStorageVolumes();
for each (var volume:StorageVolume in volumes) {
    trace(volume.name + " (" + volume.drive + ") - " + 
          (volume.isRemovable ? "Removable" : "Fixed") + " - " +
          (volume.isWritable ? "Writable" : "Read-only"));
}
```

---

## Best Practices

### Security
- **Never write to `applicationDirectory`**. It may invalidate the app signature and break updates.
- Use `applicationStorageDirectory` for internal app data (preferences, cache, databases).
- Use `documentsDirectory` for user-created files.

### Synchronous vs. Asynchronous
- **Synchronous**: Simpler code, but blocks the UI. Good for small files or quick operations.
- **Asynchronous**: Non-blocking, but requires event handling. Essential for large files to avoid freezing the UI.

### Error Handling
Always wrap file operations in try-catch blocks:
```actionscript
try {
    var stream:FileStream = new FileStream();
    stream.open(file, FileMode.READ);
    // ... read operations
    stream.close();
} catch (e:Error) {
    trace("File error: " + e.message);
}
```

### Closing Streams
Always `close()` FileStream objects when done, even if an error occurs:
```actionscript
var stream:FileStream = new FileStream();
try {
    stream.open(file, FileMode.WRITE);
    stream.writeUTFBytes("data");
} finally {
    stream.close(); // Ensures file handle is released
}
```

### Path Portability
Use `File.resolvePath()` and static directory properties instead of hardcoded paths:
```actionscript
// ✅ Good (cross-platform)
var file:File = File.applicationStorageDirectory.resolvePath("data/config.xml");

// ❌ Bad (Windows-only)
var file:File = new File("C:\\Program Files\\MyApp\\config.xml");
```

### Character Encoding
When reading/writing text, use `readUTFBytes()` / `writeUTFBytes()` for UTF-8, or `readMultiByte()` / `writeMultiByte()` for other encodings. The `systemCharset` property provides the OS default encoding.
