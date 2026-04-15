# flash.net Package

The `flash.net` package contains classes for network communication, data loading, and localized data persistence.

## HTTP Data Loading

### URLRequest

Defines a request to a server, including the target URL, HTTP method, and optional data.

- **Properties**:
  - `url: String` — Target URL.
  - `method: String` — HTTP method (see `URLRequestMethod`).
  - `data: Object` — Data to send (String, ByteArray, or `URLVariables`).
  - `requestHeaders: Array` — List of `URLRequestHeader` objects.
  - `contentType: String` — MIME type (default `application/x-www-form-urlencoded`).

### URLLoader

Downloads data from a URL as text, binary, or variables.

- **Properties**:
  - `data: *` — The received data (type depends on `dataFormat`).
  - `dataFormat: String` — `URLLoaderDataFormat.TEXT` (default), `BINARY`, or `VARIABLES`.
  - `bytesLoaded / bytesTotal: uint` — Progress tracking.
- **Methods**:
  - `load(request: URLRequest): void` — Starts the download.
  - `close(): void` — Cancels an in-progress operation.
- **Events**: `Event.COMPLETE`, `ProgressEvent.PROGRESS`, `IOErrorEvent.IO_ERROR`, `HTTPStatusEvent.HTTP_STATUS`.

### URLVariables

A dynamic class for managing name-value pairs in URL-encoded format.

- **Methods**:
  - `decode(source: String): void` — Parses a URL-encoded string.
  - `toString(): String` — Returns a URL-encoded string of the variables.

---

## Socket Communication

### Socket

Low-level TCP socket for asynchronous binary communication. Implements `IDataInput` and `IDataOutput`.

- **Properties**:
  - `connected: Boolean` — Connection status.
  - `bytesAvailable: uint` — Bytes waiting in the read buffer.
  - `endian: String` — Byte order (`Endian.BIG_ENDIAN` or `LITTLE_ENDIAN`).
- **Methods**:
  - `connect(host: String, port: int): void` — Connects to server.
  - `flush(): void` — Sends data in the write buffer immediately.
  - `read/write[Type]()` — (e.g., `readInt`, `writeUTFBytes`, `readObject`) for data transfer.
- **Events**: `Event.CONNECT`, `Event.CLOSE`, `ProgressEvent.SOCKET_DATA`, `SecurityErrorEvent.SECURITY_ERROR`.

---

## Persistence

### SharedObject

Local or remote data storage (similar to cookies). Locally persistent data is stored across sessions.

- **Properties**:
  - `data: Object` — Key-value store for attributes.
- **Static Methods**:
  - `getLocal(name: String, localPath: String = null): SharedObject` — Returns a reference to a local shared object.
- **Instance Methods**:
  - `flush(minDiskSpace: int = 0): String` — Writes data to disk immediately.
  - `clear(): void` — Deletes all data.

---

## Streaming and Real-time Data

### NetConnection

Establishes a connection for RTMP streaming (FMS), Flash Remoting, or peer-to-peer (RTMFP).

- **Methods**:
  - `connect(command: String, ...args): void` — Connects to a server (use `null` for local/progressive files).
  - `call(command: String, responder: Responder, ...args): void` — Invokes a server-side function.

### NetStream

Sends or receives a stream of video, audio, and data over a `NetConnection`.

- **Methods**:
  - `play(name: String, ...args): void` — Plays a stream/file.
  - `publish(name: String, type: String = null): void` — Streams local camera/mic to server.
  - `pause()`, `resume()`, `seek(offset: Number)`, `close()`.
  - `appendBytes(bytes: ByteArray): void` — Feeds raw data into the buffer (Data Generation Mode).
- **Events**: `NetStatusEvent.NET_STATUS` (handles status codes like `NetStream.Play.Start`).

---

## Constants

| Class | Constants |
| :--- | :--- |
| **URLRequestMethod** | `POST`, `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS` |
| **URLLoaderDataFormat** | `TEXT`, `BINARY`, `VARIABLES` |
| **SharedObjectFlushStatus** | `FLUSHED`, `PENDING` |

### Example: Loading XML

```actionscript
var loader:URLLoader = new URLLoader();
loader.addEventListener(Event.COMPLETE, (e:Event) => {
    var xml:XML = new XML(loader.data);
    trace(xml.toXMLString());
});
loader.load(new URLRequest("data.xml"));
```
