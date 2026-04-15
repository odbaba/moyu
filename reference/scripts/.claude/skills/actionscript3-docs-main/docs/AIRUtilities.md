# air.utils, air.security, air.net Packages **[AIR Only]**

Additional AIR-specific utilities for ZIP archives, cryptography, and WebSocket communication.

## air.utils - ZIP Archive Support

### ZipArchive

Read and extract ZIP archive files.

**Constructor**: `ZipArchive()`

**Properties**:
- `file: File`: The ZIP file being read.

**Methods**:
- `open(file:File, mode:String = "read"): void`: Opens a ZIP archive.
- `close(): void`: Closes the archive.
- `getEntries(): Vector.<ZipEntry>`: Gets all entries in the archive.
- `getEntry(name:String): ZipEntry`: Gets a specific entry by name.
- `extract(entry:ZipEntry, destination:File): void`: Extracts an entry to a file.
- `extractAll(destination:File): void`: Extracts all entries to a directory.

**Example - Extract ZIP Archive**:

```as3
var archive:ZipArchive = new ZipArchive();
var zipFile:File = File.desktopDirectory.resolvePath("archive.zip");

try {
    archive.open(zipFile);
    
    // List all entries
    var entries:Vector.<ZipEntry> = archive.getEntries();
    for each (var entry:ZipEntry in entries) {
        trace("File: " + entry.name);
        trace("Size: " + entry.uncompressedSize);
        trace("Compressed: " + entry.compressedSize);
        trace("Is Directory: " + entry.isDirectory);
    }
    
    // Extract specific file
    var readme:ZipEntry = archive.getEntry("README.txt");
    if (readme) {
        var outputFile:File = File.desktopDirectory.resolvePath("README.txt");
        archive.extract(readme, outputFile);
        trace("Extracted README.txt");
    }
    
    // Extract all files
    var extractDir:File = File.desktopDirectory.resolvePath("extracted");
    archive.extractAll(extractDir);
    trace("Extracted all files to: " + extractDir.nativePath);
    
} catch (error:Error) {
    trace("Error: " + error.message);
} finally {
    archive.close();
}
```

### ZipEntry

Represents a single file or directory within a ZIP archive.

**Properties**:
- `name: String` (read-only): Entry path within archive.
- `isDirectory: Boolean` (read-only): Whether entry is a directory.
- `size: Number` (read-only): Uncompressed size in bytes.
- `compressedSize: Number` (read-only): Compressed size in bytes.
- `lastModified: Date` (read-only): Last modification date.

**Example - Read Entry Data**:

```as3
var entry:ZipEntry = archive.getEntry("data.json");
if (entry && !entry.isDirectory) {
    // Extract to ByteArray
    var data:ByteArray = new ByteArray();
    archive.extractToByteArray(entry, data);
    
    // Read as string
    data.position = 0;
    var jsonString:String = data.readUTFBytes(data.length);
    var jsonData:Object = JSON.parse(jsonString);
    
    trace("Loaded data: " + JSON.stringify(jsonData));
}
```

## air.security - Cryptography

### Encryption

Provides encryption and decryption functionality.

**Static Methods**:
- `encrypt(data:ByteArray, key:ByteArray): ByteArray`: Encrypts data.
- `decrypt(data:ByteArray, key:ByteArray): ByteArray`: Decrypts data.

**Example - Encrypt/Decrypt Data**:

```as3
import air.security.Encryption;

// Data to encrypt
var plaintext:String = "Secret message";
var data:ByteArray = new ByteArray();
data.writeUTFBytes(plaintext);

// Encryption key (should be securely generated/stored)
var key:ByteArray = new ByteArray();
key.writeUTFBytes("MySecretKey12345"); // 16 bytes for AES-128

// Encrypt
data.position = 0;
var encrypted:ByteArray = Encryption.encrypt(data, key);
trace("Encrypted: " + encrypted.length + " bytes");

// Decrypt
var decrypted:ByteArray = Encryption.decrypt(encrypted, key);
decrypted.position = 0;
var decryptedText:String = decrypted.readUTFBytes(decrypted.length);
trace("Decrypted: " + decryptedText); // "Secret message"
```

### Digest

Generates cryptographic hashes (message digests).

**Static Methods**:
- `digest(algorithm:String, data:ByteArray): ByteArray`: Computes hash.

**Supported Algorithms**:
- `Digest.SHA_1`: SHA-1 hash.
- `Digest.SHA_256`: SHA-256 hash.
- `Digest.SHA_512`: SHA-512 hash.
- `Digest.MD5`: MD5 hash (not recommended for security).

**Example - Hash Data**:

```as3
import air.security.Digest;

// Data to hash
var data:ByteArray = new ByteArray();
data.writeUTFBytes("Hello, World!");

// Compute SHA-256 hash
data.position = 0;
var hash:ByteArray = Digest.digest(Digest.SHA_256, data);

// Convert to hex string
var hexHash:String = "";
hash.position = 0;
for (var i:int = 0; i < hash.length; i++) {
    var byte:uint = hash.readUnsignedByte();
    hexHash += ("0" + byte.toString(16)).substr(-2);
}
trace("SHA-256: " + hexHash);
```

**Example - Verify File Integrity**:

```as3
function verifyFileHash(file:File, expectedHash:String):Boolean {
    var fileStream:FileStream = new FileStream();
    fileStream.open(file, FileMode.READ);
    
    var data:ByteArray = new ByteArray();
    fileStream.readBytes(data);
    fileStream.close();
    
    data.position = 0;
    var hash:ByteArray = Digest.digest(Digest.SHA_256, data);
    
    // Convert to hex and compare
    var hexHash:String = "";
    hash.position = 0;
    for (var i:int = 0; i < hash.length; i++) {
        hexHash += ("0" + hash.readUnsignedByte().toString(16)).substr(-2);
    }
    
    return hexHash.toLowerCase() == expectedHash.toLowerCase();
}

// Usage
var downloadedFile:File = File.desktopDirectory.resolvePath("download.pdf");
var expectedSHA256:String = "abc123..."; // From server
if (verifyFileHash(downloadedFile, expectedSHA256)) {
    trace("File integrity verified");
} else {
    trace("File corrupted or tampered!");
}
```

## air.net - WebSocket

### WebSocket

WebSocket client for full-duplex communication with WebSocket servers.

**Constructor**: `WebSocket()`

**Properties**:
- `url: String`: WebSocket server URL.
- `protocol: String`: WebSocket sub-protocol.
- `readyState: uint` (read-only): Connection state (CONNECTING, OPEN, CLOSING, CLOSED).
- `bufferedAmount: uint` (read-only): Bytes queued but not yet sent.

**Methods**:
- `connect(url:String, protocol:String = ""): void`: Connects to WebSocket server.
- `send(data:*): void`: Sends data (String, ByteArray, or ArrayBuffer).
- `close(code:uint = 1000, reason:String = ""): void`: Closes the connection.

**Events**:
- `Event.CONNECT`: Connection established.
- `MessageEvent.MESSAGE`: Message received.
- `Event.CLOSE`: Connection closed.
- `IOErrorEvent.IO_ERROR`: Connection error.

**Example - Basic WebSocket Client**:

```as3
import air.net.WebSocket;

var ws:WebSocket = new WebSocket();

// Connection opened
ws.addEventListener(Event.CONNECT, function(e:Event):void {
    trace("WebSocket connected");
    
    // Send message
    ws.send("Hello, Server!");
    
    // Send binary data
    var data:ByteArray = new ByteArray();
    data.writeUTFBytes("Binary message");
    data.position = 0;
    ws.send(data);
});

// Message received
ws.addEventListener(MessageEvent.MESSAGE, function(e:MessageEvent):void {
    if (e.data is String) {
        trace("Text message: " + e.data);
    } else if (e.data is ByteArray) {
        var bytes:ByteArray = e.data as ByteArray;
        bytes.position = 0;
        var text:String = bytes.readUTFBytes(bytes.length);
        trace("Binary message: " + text);
    }
});

// Connection closed
ws.addEventListener(Event.CLOSE, function(e:Event):void {
    trace("WebSocket closed");
});

// Error handling
ws.addEventListener(IOErrorEvent.IO_ERROR, function(e:IOErrorEvent):void {
    trace("WebSocket error: " + e.text);
});

// Connect to server
ws.connect("ws://example.com:8080/socket");
```

**Example - Chat Application**:

```as3
var chatSocket:WebSocket = new WebSocket();
var connected:Boolean = false;

function connectToChat(username:String):void {
    chatSocket.addEventListener(Event.CONNECT, function():void {
        connected = true;
        trace("Connected to chat");
        
        // Send join message
        var joinMsg:Object = {
            type: "join",
            username: username
        };
        chatSocket.send(JSON.stringify(joinMsg));
    });
    
    chatSocket.addEventListener(MessageEvent.MESSAGE, function(e:MessageEvent):void {
        var msg:Object = JSON.parse(e.data as String);
        
        switch (msg.type) {
            case "chat":
                displayChatMessage(msg.username, msg.message);
                break;
            case "join":
                displaySystemMessage(msg.username + " joined");
                break;
            case "leave":
                displaySystemMessage(msg.username + " left");
                break;
        }
    });
    
    chatSocket.connect("ws://chat.example.com:8080");
}

function sendChatMessage(message:String):void {
    if (connected) {
        var chatMsg:Object = {
            type: "chat",
            message: message
        };
        chatSocket.send(JSON.stringify(chatMsg));
    }
}

function disconnect():void {
    if (connected) {
        chatSocket.close();
    }
}
```

**Example - Reconnection Logic**:

```as3
var reconnectAttempts:int = 0;
var maxReconnectAttempts:int = 5;

function connectWithReconnect():void {
    ws.addEventListener(Event.CLOSE, function(e:Event):void {
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            var delay:int = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            trace("Reconnecting in " + (delay/1000) + " seconds...");
            
            setTimeout(function():void {
                ws.connect("ws://example.com:8080/socket");
            }, delay);
        } else {
            trace("Max reconnection attempts reached");
        }
    });
    
    ws.addEventListener(Event.CONNECT, function():void {
        reconnectAttempts = 0; // Reset on successful connection
    });
    
    ws.connect("ws://example.com:8080/socket");
}
```

## Best Practices

### ZIP Archives
- Always close ZipArchive after use
- Check entry.isDirectory before extracting
- Validate extraction paths to prevent directory traversal attacks
- Handle corrupt ZIP files gracefully

### Encryption
- Use strong, randomly generated keys
- Don't hardcode encryption keys in source code
- Use appropriate key sizes (AES-256 recommended)
- Consider using EncryptedLocalStore for key storage
- Encrypt sensitive data before storing

### Hashing
- Use SHA-256 or SHA-512, not MD5 or SHA-1 for security
- Verify file integrity for downloads
- Use for password hashing with salt
- Compare hashes in constant time to prevent timing attacks

### WebSocket
- Always handle connection errors
- Implement reconnection logic with exponential backoff
- Validate and sanitize incoming messages
- Use secure WebSocket (wss://) for sensitive data
- Handle connection state properly
- Implement heartbeat/ping-pong for connection monitoring

## Security Considerations

- Validate ZIP entry paths before extraction
- Generate encryption keys securely (crypto-random)
- Use HTTPS/WSS for sensitive communications
- Never trust data from WebSocket without validation
- Implement proper authentication for WebSocket connections
- Rate limit WebSocket messages
- Use TLS/SSL certificates properly

## See Also

- `flash.utils.ByteArray` - Binary data handling
- `flash.filesystem.File` - File system operations
- `flash.filesystem.FileStream` - File I/O
- `flash.data.EncryptedLocalStore` - Secure local storage
- `flash.net.Socket` - TCP sockets
