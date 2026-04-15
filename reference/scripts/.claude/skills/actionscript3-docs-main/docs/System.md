# flash.system

High-level system, security, and runtime management.

## System

The `System` class contains properties and methods for managing memory, garbage collection, and runtime lifecycle.

### Properties

- `freeMemory: Number`: Memory (in bytes) allocated but not in use.
- `totalMemory: uint`: Total memory (in bytes) currently in use by the runtime.
- `privateMemory: Number`: Memory (in bytes) used by the application (AIR).
- `useCodePage: Boolean`: Whether to use the system's default code page for external text files (UTF-8 preferred if false).
- `ime: IME`: Reference to the system's Input Method Editor.

### Methods

- `gc(): void`: Forces the garbage collection process (available in debugger or AIR).
- `exit(code: uint): void`: Closes the application.
- `setClipboard(string: String): void`: Copies a string to the system clipboard.
- `pause(): void`: Pauses the runtime.
- `resume(): void`: Resumes the runtime.
- `disposeXML(node: XML): void`: Marks XML for immediate garbage collection.

---

## Capabilities

Static properties describing the client system and runtime.

### Key Properties

- `os: String`: Operating system name.
- `version: String`: Runtime version (e.g., "WIN 32,0,0,465").
- `manufacturer: String`: Client manufacturer.
- `playerType: String`: "StandAlone", "External", "PlugIn", "ActiveX", or "Desktop".
- `language: String`: Language code of the system (e.g., "en", "ja").
- `screenResolutionX / screenResolutionY: Number`: Screen dimensions.
- `screenDPI: Number`: Dots per inch.
- `isDebugger: Boolean`: Whether the runtime is a debugger version.
- `hasAudio / hasVideoEncoder / hasMP3: Boolean`: Hardware capabilities.
- `touchscreenType: String`: "none", "stylus", or "finger".
- `serverString: String`: URL-encoded string containing all capabilities.

---

## Security

Manages cross-domain communication and security sandboxes.

### Sandbox Types (Constants)

- `REMOTE`: Domain-based rules (web).
- `LOCAL_WITH_FILE`: Local file, no network.
- `LOCAL_WITH_NETWORK`: Local file, network access but no local file access.
- `LOCAL_TRUSTED`: Full access (trusted by user/mms.cfg).
- `APPLICATION`: AIR application sandbox (full access to its own package).

### Properties & Methods

- `sandboxType: String`: Current security sandbox.
- `allowDomain(...domains): void`: Grants SWFs in specified domains access to the current SWF.
- `allowInsecureDomain(...domains): void`: Grants HTTP SWFs access to the current HTTPS SWF.
- `loadPolicyFile(url: String): void`: Loads a cross-domain policy file (crossdomain.xml).
- `showSettings(panel: String = "default"): void`: Opens the Flash Player Settings Manager.

---

## ApplicationDomain

Containers for groups of class definitions. Allows versioning and definition sharing.

### Properties

- `currentDomain: ApplicationDomain`: (Static) The current domain.
- `parentDomain: ApplicationDomain`: The parent domain in the hierarchy.
- `domainMemory: ByteArray`: Global memory for specialized operations.

### Methods

- `getDefinition(name: String): Object`: Retrieves a public definition (Class, Function, etc.) by name.
- `hasDefinition(name: String): Boolean`: Checks if a definition exists.
- `getQualifiedDefinitionNames(): Vector.<String>`: Lists all class names in the domain.

---

## Worker & Concurrency (AIR 3.4+)

Enables multi-threaded execution through Workers.

### Worker

- `isSupported: Boolean`: (Static) Whether Workers are available.
- `current: Worker`: (Static) The worker running the current code.
- `isPrimordial: Boolean`: Whether this is the main worker.
- `state: String`: "new", "running", "suspended", "terminated".
- `start(): void`: Begins execution.
- `terminate(): void`: Stops the worker.
- `setSharedProperty(key: String, value: *): void / getSharedProperty(key: String): *`: Thread-safe property sharing.
- `createMessageChannel(receiver: Worker): MessageChannel`: Creates a communication link.

### MessageChannel

- `send(message: *): void`: Queues a message for the receiver.
- `receive(blockUntilMessage: Boolean = false): *`: Retrieves a message.
- `messageAvailable: Boolean`: Whether messages are in the queue.
- `Event.CHANNEL_MESSAGE`: Dispatched when a message arrives.

### WorkerDomain

- `current: WorkerDomain`: (Static) Manager for all workers in the security domain.
- `createWorker(swf: ByteArray): Worker`: Spawns a new worker from SWF bytes.

---

## LoaderContext

Configures how content is treated when loaded via `Loader.load()`.

### Properties

- `applicationDomain: ApplicationDomain`: The domain to load classes into.
- `checkPolicyFile: Boolean`: Whether to look for a policy file on the server.
- `securityDomain: SecurityDomain`: (Flash Player only) The security sandbox to place the loaded content in.
- `imageDecodingPolicy: String`: `ON_DEMAND` or `ON_LOAD`.

---

## Functions

- `fscommand(command: String, args: String): void`: Sends a message to the program hosting Flash Player (e.g., browser or projector).
