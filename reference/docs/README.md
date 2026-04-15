# ActionScript 3.0 Documentation - Table of Contents

Complete reference documentation for ActionScript 3.0 and Adobe AIR APIs, organized by category.

## 📖 Quick Navigation

- [Core Language](#core-language)
- [Display & Graphics](#display--graphics)
- [Events & Interactivity](#events--interactivity)
- [Media](#media)
- [Networking](#networking)
- [Data & Storage](#data--storage)
- [System & Runtime](#system--runtime)
- [Text & Internationalization](#text--internationalization)
- [Adobe AIR Desktop Features](#adobe-air-desktop-features)
- [Adobe AIR Mobile Features](#adobe-air-mobile-features)
- [Advanced Security](#advanced-security)

---

## Core Language

Fundamental ActionScript 3.0 types and language features.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Object.md](Object.md) | Base object class and prototype chain | `Object` |
| [Array.md](Array.md) | Indexed collections and array methods | `Array` |
| [Vector.md](Vector.md) | Typed arrays for better performance | `Vector.<T>` |
| [String.md](String.md) | String manipulation and methods | `String` |
| [Boolean.md](Boolean.md) | Boolean type and truthiness | `Boolean` |
| [NumericTypes.md](NumericTypes.md) | Numeric types and operations | `Number`, `int`, `uint` |
| [Math.md](Math.md) | Mathematical constants and functions | `Math` |
| [Date.md](Date.md) | Date and time handling | `Date` |
| [Function.md](Function.md) | Functions and bound methods | `Function` |
| [RegExp.md](RegExp.md) | Regular expressions | `RegExp` |
| [JSON.md](JSON.md) | JSON serialization and parsing | `JSON` |
| [XML.md](XML.md) | E4X XML processing | `XML`, `XMLList` |
| [Errors.md](Errors.md) | Exception handling and error types | `Error`, `ArgumentError`, `TypeError`, etc. |
| [SpecialTypes.md](SpecialTypes.md) | Special language constructs | `Class`, `Namespace`, `QName`, `TimeZone`, `arguments` |
| [SpecializedErrors.md](SpecializedErrors.md) | Domain-specific error types | `SQLError`, `DRMManagerError`, `InvalidSWFError`, `PermissionError` |

---

## Display & Graphics

Visual rendering, sprites, bitmaps, and graphics.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Display.md](Display.md) | Display list, sprites, and stage | `DisplayObject`, `Sprite`, `MovieClip`, `Stage`, `Bitmap` |
| [Geom.md](Geom.md) | Geometric primitives and transformations | `Point`, `Rectangle`, `Matrix`, `Transform` |
| [Filters.md](Filters.md) | Visual effects and filters | `BitmapFilter`, `BlurFilter`, `DropShadowFilter`, `ShaderFilter` |
| [Display3D.md](Display3D.md) | Stage3D GPU-accelerated 3D rendering **(Advanced)** | `Context3D`, `VertexBuffer3D`, `IndexBuffer3D`, `Program3D` |

---

## Events & Interactivity

Event system, user input, and interactive controls.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Events.md](Events.md) | Event dispatching and handling | `Event`, `EventDispatcher`, `EventPhase` |
| [UI.md](UI.md) | User input devices | `Mouse`, `Keyboard`, `GameInput`, `TouchEvent` |

---

## Media

Audio, video, and multimedia functionality.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Media.md](Media.md) | Audio and video playback | `Sound`, `SoundChannel`, `Video`, `Camera`, `Microphone` |

---

## Networking

Network communication and data loading.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Net.md](Net.md) | HTTP, sockets, and network protocols | `URLLoader`, `URLRequest`, `Socket`, `XMLSocket`, `NetConnection` |

---

## Data & Storage

Data structures, serialization, and persistent storage.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Utils.md](Utils.md) | Utility classes and binary data | `ByteArray`, `Timer`, `Dictionary`, `Proxy` |
| [Database.md](Database.md) | SQLite databases and encrypted storage **(AIR)** | `SQLConnection`, `SQLStatement`, `EncryptedLocalStore` |

---

## System & Runtime

System information, security, concurrency, and runtime features.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [System.md](System.md) | System capabilities, security, and workers | `Capabilities`, `Security`, `Worker`, `ApplicationDomain` |
| [Concurrent.md](Concurrent.md) | Multithreading primitives **(Advanced)** | `Mutex`, `Condition` |
| [Profiler.md](Profiler.md) | Performance profiling and telemetry **(AIR)** | `Telemetry`, `Sample` |

---

## Text & Internationalization

Text rendering, formatting, and locale-aware operations.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Text.md](Text.md) | Text fields, fonts, and formatting | `TextField`, `TextFormat`, `Font`, `StyleSheet` |
| [Globalization.md](Globalization.md) | Internationalization and localization | `DateTimeFormatter`, `NumberFormatter`, `CurrencyFormatter`, `Collator` |

---

## Adobe AIR Desktop Features

Desktop-specific AIR functionality.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Desktop.md](Desktop.md) | Native desktop integration **(AIR)** | `NativeApplication`, `Clipboard`, `NativeDragManager`, `NativeProcess`, `SystemTrayIcon`, `DockIcon` |
| [Filesystem.md](Filesystem.md) | File system access **(AIR)** | `File`, `FileStream`, `FileMode` |
| [Printing.md](Printing.md) | Print job management **(AIR)** | `PrintJob`, `PrintJobOptions` |
| [HTML.md](HTML.md) | WebKit HTML rendering **(AIR)** | `HTMLLoader`, `HTMLHost` |
| [Updates.md](Updates.md) | Application update framework **(AIR)** | `ApplicationUpdater`, `ApplicationUpdaterUI` |
| [AIRUtilities.md](AIRUtilities.md) | ZIP, encryption, and WebSocket **(AIR)** | `ZipArchive`, `Encryption`, `Digest`, `WebSocket` |
| [Bridge_Sensors.md](Bridge_Sensors.md) | External communication and sensors | `ExternalInterface`, `Geolocation`, `Accelerometer` |
| [Accessibility.md](Accessibility.md) | Screen readers and accessibility | `Accessibility`, `AccessibilityProperties` |

---

## Adobe AIR Mobile Features

Mobile-specific AIR functionality.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [Notifications.md](Notifications.md) | Push notifications **(AIR Mobile)** | `RemoteNotifier`, `RemoteNotifierSubscribeOptions`, `NotificationStyle` |
| [Permissions.md](Permissions.md) | Runtime permission management **(AIR Mobile - Android)** | `PermissionManager`, `PermissionStatus` |

---

## Advanced Security

Digital signatures, certificates, and cryptography.

| Document | Description | Key Classes |
|----------|-------------|-------------|
| [AdvancedSecurity.md](AdvancedSecurity.md) | XML signatures and certificate validation | `XMLSignatureValidator`, `CertificateStatus`, `RevocationCheckSettings` |

---

## Document Statistics

- **Total Documents**: 41 (100% Complete! 🎉)
- **Core Language**: 15 documents
- **Display & Graphics**: 4 documents
- **Events & UI**: 2 documents
- **Media**: 1 document
- **Networking**: 1 document
- **Data & Storage**: 2 documents
- **System & Runtime**: 3 documents
- **Text & i18n**: 2 documents
- **AIR Desktop**: 8 documents
- **AIR Mobile**: 2 documents
- **Advanced Security**: 1 document

---

## Usage Tips

### For Learning

Start with **Core Language** documents to understand ActionScript 3.0 fundamentals, then move to specific areas based on your project needs.

### For Reference

Use your editor's search or `grep` to quickly find specific classes and methods across all documents.

### For AI/LLM Context

Each document is optimized for AI context windows with high-density information and minimal boilerplate. Feed relevant documents to your AI assistant for ActionScript 3.0 coding help.

---

## Related Resources

- [README.md](../README.md) - Project overview and usage guide

---

## 🛠 Project Status

All 41 primary documentation packages have been 100% synthesized. The project is now in a maintenance-only state.

---

*Last Updated: January 2026 - 100% Complete!*
