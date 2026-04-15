# ActionScript 3.0 Documentation Index

Quick reference for finding AS3 documentation in `/docs/`. Use this index to locate the appropriate documentation file for any topic.

## Core Language

| Topic | File | Key Classes |
| ----- | ---- | ----------- |
| Base object, prototype chain | `docs/Object.md` | `Object` |
| Indexed arrays | `docs/Array.md` | `Array` |
| Typed arrays (performance) | `docs/Vector.md` | `Vector.<T>` |
| String manipulation | `docs/String.md` | `String` |
| Boolean logic | `docs/Boolean.md` | `Boolean` |
| Numbers (int, uint, Number) | `docs/NumericTypes.md` | `Number`, `int`, `uint` |
| Math functions | `docs/Math.md` | `Math` |
| Date/time handling | `docs/Date.md` | `Date` |
| Functions, closures | `docs/Function.md` | `Function` |
| Regular expressions | `docs/RegExp.md` | `RegExp` |
| JSON parsing/serialization | `docs/JSON.md` | `JSON` |
| E4X XML processing | `docs/XML.md` | `XML`, `XMLList` |
| Error handling | `docs/Errors.md` | `Error`, `ArgumentError`, `TypeError` |
| Special constructs | `docs/SpecialTypes.md` | `Class`, `Namespace`, `QName` |
| Domain-specific errors | `docs/SpecializedErrors.md` | `SQLError`, `DRMManagerError` |

## Display & Graphics

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Display list, sprites, stage | `docs/Display.md` | `DisplayObject`, `Sprite`, `MovieClip`, `Stage`, `Bitmap`, `Graphics` |
| Geometry, transformations | `docs/Geom.md` | `Point`, `Rectangle`, `Matrix`, `Transform` |
| Visual filters/effects | `docs/Filters.md` | `BlurFilter`, `DropShadowFilter`, `GlowFilter`, `ColorMatrixFilter` |
| Stage3D (GPU 3D rendering) | `docs/Display3D.md` | `Context3D`, `VertexBuffer3D`, `Program3D` |

## Events & User Input

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Event system | `docs/Events.md` | `Event`, `EventDispatcher`, `MouseEvent`, `KeyboardEvent` |
| Input devices | `docs/UI.md` | `Mouse`, `Keyboard`, `TouchEvent`, `GameInput` |

## Media

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Audio/video playback | `docs/Media.md` | `Sound`, `SoundChannel`, `Video`, `Camera`, `Microphone` |

## Networking

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| HTTP, sockets, protocols | `docs/Net.md` | `URLLoader`, `URLRequest`, `Socket`, `XMLSocket`, `NetConnection` |

## Data & Utilities

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Binary data, timers, reflection | `docs/Utils.md` | `ByteArray`, `Timer`, `Dictionary`, `Proxy`, `describeType` |
| SQLite databases (AIR) | `docs/Database.md` | `SQLConnection`, `SQLStatement`, `EncryptedLocalStore` |

## System & Runtime

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Capabilities, security, domains | `docs/System.md` | `Capabilities`, `Security`, `ApplicationDomain`, `Worker` |
| Multithreading primitives | `docs/Concurrent.md` | `Mutex`, `Condition` |
| Performance profiling (AIR) | `docs/Profiler.md` | `Telemetry`, `Sample` |

## Text & Internationalization

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Text fields, fonts, formatting | `docs/Text.md` | `TextField`, `TextFormat`, `Font`, `StyleSheet` |
| Locale-aware formatting | `docs/Globalization.md` | `DateTimeFormatter`, `NumberFormatter`, `Collator` |

## Adobe AIR - Desktop

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Desktop integration | `docs/Desktop.md` | `NativeApplication`, `Clipboard`, `NativeProcess`, `NativeWindow` |
| File system access | `docs/Filesystem.md` | `File`, `FileStream`, `FileMode` |
| Print jobs | `docs/Printing.md` | `PrintJob`, `PrintJobOptions` |
| WebKit HTML | `docs/HTML.md` | `HTMLLoader`, `HTMLHost` |
| App updates | `docs/Updates.md` | `ApplicationUpdater`, `ApplicationUpdaterUI` |
| ZIP, encryption, WebSocket | `docs/AIRUtilities.md` | `ZipArchive`, `Encryption`, `Digest`, `WebSocket` |
| External interface, sensors | `docs/Bridge_Sensors.md` | `ExternalInterface`, `Geolocation`, `Accelerometer` |
| Screen readers | `docs/Accessibility.md` | `Accessibility`, `AccessibilityProperties` |

## Adobe AIR - Mobile

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| Push notifications | `docs/Notifications.md` | `RemoteNotifier`, `NotificationStyle` |
| Runtime permissions (Android) | `docs/Permissions.md` | `PermissionManager`, `PermissionStatus` |

## Security

| Topic | File | Key Classes |
| ----- | ----- | ------------ |
| XML signatures, certificates | `docs/AdvancedSecurity.md` | `XMLSignatureValidator`, `CertificateStatus` |

## Search by Task

### "I need to..."

| Task | Documentation |
| ----- | --------------- |
| Load external data/assets | `docs/Net.md` (URLLoader, URLRequest) |
| Handle user clicks/keyboard | `docs/Events.md`, `docs/UI.md` |
| Draw shapes programmatically | `docs/Display.md` (Graphics class) |
| Work with images/bitmaps | `docs/Display.md` (Bitmap, BitmapData) |
| Play audio/video | `docs/Media.md` |
| Save/load local data | `docs/Database.md`, `docs/Filesystem.md` |
| Connect via sockets | `docs/Net.md` (Socket, XMLSocket) |
| Use timers/delays | `docs/Utils.md` (Timer) |
| Work with binary data | `docs/Utils.md` (ByteArray) |
| Create visual effects | `docs/Filters.md` |
| Handle text input | `docs/Text.md` (TextField) |
| Run native processes (AIR) | `docs/Desktop.md` (NativeProcess) |
| Access GPS/accelerometer | `docs/Bridge_Sensors.md` |
| Use threads/workers | `docs/System.md`, `docs/Concurrent.md` |
| Parse/generate JSON | `docs/JSON.md` |
| Process XML | `docs/XML.md` |

## Documentation Format

Each documentation file in `/docs/` contains:

- Class overview and purpose
- Key properties and methods with signatures
- Behavioral notes and gotchas
- Idiomatic code examples

Files are optimized for AI/LLM context windows with high-density information.
