# flash.errors Package

Specialized error classes for specific failure scenarios in ActionScript 3.0.

## SQLError

Errors related to SQLite database operations in AIR applications.

**Constructor**: `SQLError(operation:String, details:String = "", message:String = "", id:int = 0)`

**Properties** (in addition to base Error properties):
- `operation: String`: The database operation that failed (e.g., "open", "execute").
- `details: String`: Detailed error information.

**Common SQL Error Codes**:
- `3000-3999`: SQL errors
- `3000`: Syntax error
- `3001`: Table not found
- `3005`: Cannot open database
- `3115`: Column does not exist

**Example**:

```as3
var conn:SQLConnection = new SQLConnection();
try {
    conn.open(File.applicationStorageDirectory.resolvePath("db.db"));
    var stmt:SQLStatement = new SQLStatement();
    stmt.sqlConnection = conn;
    stmt.text = "SELECT * FROM nonexistent_table";
    stmt.execute();
} catch (error:SQLError) {
    trace("SQL Error: " + error.operation);
    trace("Details: " + error.details);
    trace("Error ID: " + error.errorID); // 3001 - table not found
}
```

## SQLErrorOperation

Constants for SQL operation types that can fail.

**Constants**:
- `ANALYZE`: Database analysis operation.
- `ATTACH`: Database attach operation.
- `BEGIN`: Transaction begin.
- `COMMIT`: Transaction commit.
- `COMPACT`: Database compaction.
- `DEANALYZE`: Deanalysis operation.
- `DETACH`: Database detach.
- `EXECUTE`: SQL statement execution.
- `OPEN`: Database open.
- `REENCRYPT`: Database reencryption.
- `RELEASE_SAVEPOINT`: Savepoint release.
- `ROLLBACK`: Transaction rollback.
- `ROLLBACK_TO_SAVEPOINT`: Rollback to savepoint.
- `SCHEMA`: Schema operation.

## DRMManagerError

Errors related to Digital Rights Management (DRM) operations.

**Constructor**: `DRMManagerError(message:String, id:int, subErrorID:int)`

**Properties**:
- `subErrorID: int`: Additional error code for DRM-specific failures.

**Common DRM Error Codes**:
- `3300-3399`: DRM errors
- `3301`: Authentication failed
- `3305`: Content expired
- `3315`: License server unavailable
- `3328`: DRM client update required

**Example**:

```as3
var stream:NetStream = new NetStream(connection);
stream.addEventListener(DRMErrorEvent.DRM_ERROR, function(e:DRMErrorEvent):void {
    var drmError:DRMManagerError = e.error as DRMManagerError;
    
    switch (drmError.errorID) {
        case 3301:
            trace("DRM authentication failed");
            promptForCredentials();
            break;
        case 3305:
            trace("Content license expired");
            showExpiredMessage();
            break;
        case 3315:
            trace("License server unavailable");
            showOfflineMessage();
            break;
        default:
            trace("DRM error: " + drmError.message);
    }
});
```

## InvalidSWFError

Thrown when attempting to load an invalid SWF file.

**Constructor**: `InvalidSWFError(message:String = "", id:int = 0)`

**Common Causes**:
- Corrupted SWF file
- Incompatible SWF version
- Tampered or modified SWF
- SWF from untrusted source

**Example**:

```as3
var loader:Loader = new Loader();
loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, function(e:IOErrorEvent):void {
    trace("Failed to load SWF: " + e.text);
});

try {
    loader.load(new URLRequest("corrupted.swf"));
} catch (error:InvalidSWFError) {
    trace("Invalid SWF file: " + error.message);
}
```

## PermissionError **[AIR Only - Mobile]**

Thrown when a required permission is denied or unavailable.

**Constructor**: `PermissionError(message:String = "")`

**Example**:

```as3
try {
    // Attempt to use camera without permission
    var camera:Camera = Camera.getCamera();
    if (camera) {
        video.attachCamera(camera);
    }
} catch (error:PermissionError) {
    trace("Camera permission denied: " + error.message);
    requestCameraPermission();
}
```

## MemoryError

Thrown when the runtime runs out of memory.

**Constructor**: `MemissionError(message:String = "")`

**Example**:

```as3
try {
    // Attempt to allocate large array
    var hugeArray:Array = new Array(Number.MAX_VALUE);
} catch (error:MemoryError) {
    trace("Out of memory: " + error.message);
    freeUpMemory();
}
```

## ScriptTimeoutError

Thrown when a script exceeds the execution time limit.

**Constructor**: `ScriptTimeoutError(message:String = "")`

**Example**:

```as3
// Long-running script
try {
    for (var i:int = 0; i < Number.MAX_VALUE; i++) {
        // Infinite or very long loop
    }
} catch (error:ScriptTimeoutError) {
    trace("Script timeout: " + error.message);
    // Break operation into smaller chunks
}
```

## StackOverflowError

Thrown when the call stack exceeds its limit (typically from infinite recursion).

**Constructor**: `StackOverflowError(message:String = "")`

**Example**:

```as3
function recursiveFunction():void {
    try {
        recursiveFunction(); // Infinite recursion
    } catch (error:StackOverflowError) {
        trace("Stack overflow: " + error.message);
        // Fix recursion issue
    }
}
```

## Error Handling Patterns

### Catching Specific Errors

```as3
try {
    performDatabaseOperation();
} catch (sqlError:SQLError) {
    handleSQLError(sqlError);
} catch (drmError:DRMManagerError) {
    handleDRMError(drmError);
} catch (error:Error) {
    handleGenericError(error);
}
```

### Logging Error Details

```as3
function logError(error:Error):void {
    var log:String = "";
    log += "Error Type: " + getQualifiedClassName(error) + "\n";
    log += "Message: " + error.message + "\n";
    log += "Error ID: " + error.errorID + "\n";
    
    if (error is SQLError) {
        log += "Operation: " + (error as SQLError).operation + "\n";
        log += "Details: " + (error as SQLError).details + "\n";
    }
    
    if (error is DRMManagerError) {
        log += "Sub Error ID: " + (error as DRMManagerError).subErrorID + "\n";
    }
    
    log += "Stack Trace:\n" + error.getStackTrace();
    
    trace(log);
    saveToFile(log);
}
```

### Graceful Degradation

```as3
function initializeDRM():void {
    try {
        setupDRMProtection();
    } catch (drmError:DRMManagerError) {
        trace("DRM not available, using basic protection");
        setupBasicProtection();
    }
}

function loadDatabase():void {
    try {
        openSQLDatabase();
    } catch (sqlError:SQLError) {
        trace("Database unavailable, using memory storage");
        useMemoryStorage();
    }
}
```

## Best Practices

- Always catch specific error types before generic Error
- Log detailed error information for debugging
- Provide user-friendly error messages
- Implement fallback mechanisms for critical errors
- Don't swallow errors silently - at minimum, log them
- Use `getStackTrace()` in debug builds
- Handle SQLErrors at the operation level for better control
- Check DRM support before attempting DRM operations
- Validate SWF sources before loading
- Monitor memory usage to prevent MemoryErrors
- Break long operations into chunks to avoid ScriptTimeoutError
- Prevent infinite recursion to avoid StackOverflowError

## Error Recovery Strategies

### Database Errors
```as3
var retryCount:int = 0;
function executeWithRetry():void {
    try {
        stmt.execute();
    } catch (error:SQLError) {
        if (retryCount < 3 && error.errorID == 3005) {
            retryCount++;
            setTimeout(executeWithRetry, 1000);
        } else {
            showErrorDialog(error);
        }
    }
}
```

### DRM Errors
```as3
function handleDRMError(error:DRMManagerError):void {
    switch (error.errorID) {
        case 3301: // Auth failed
            promptForCredentials();
            break;
        case 3305: // Expired
            requestNewLicense();
            break;
        case 3315: // Server unavailable
            enableOfflineMode();
            break;
        default:
            showError(error.message);
    }
}
```

## See Also

- `Error` (base class) - Core error handling
- `flash.data.SQLConnection` - Database operations
- `flash.net.NetStream` - DRM streaming
- `flash.display.Loader` - SWF loading
- `flash.permissions.PermissionManager` - Permission management
