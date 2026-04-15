# air.update Package **[AIR Only]**

Application update framework for Adobe AIR. Provides automated checking, downloading, and installing of application updates.

## ApplicationUpdater / ApplicationUpdaterUI

Full-featured update frameworks with different UI approaches.

### ApplicationUpdaterUI

Provides a complete update UI with built-in dialogs.

**Constructor**: `ApplicationUpdaterUI()`

**Properties**:
- `updateURL: String`: URL to the update descriptor XML file.
- `isCheckForUpdateVisible: Boolean`: Show "Checking for updates..." dialog.
- `isDownloadUpdateVisible: Boolean`: Show download progress dialog.
- `isDownloadProgressVisible: Boolean`: Show detailed download progress.
- `isInstallUpdateVisible: Boolean`: Show "Installing update..." dialog.
- `isFileUpdateVisible: Boolean`: Show file update progress.
- `isUnexpectedErrorVisible: Boolean`: Show unexpected error dialogs.
- `delay: Number`: Delay in days between automatic update checks.
- `configurationFile: File`: Local configuration file path.

**Methods**:
- `initialize(): void`: Initializes the updater.
- `checkNow(): void`: Manually triggers update check.
- `cancelUpdate(): void`: Cancels the update process.

**Events**:
- `UpdateEvent.INITIALIZED`: Updater initialized.
- `UpdateEvent.CHECK_FOR_UPDATE`: Update check started.
- `StatusUpdateEvent.UPDATE_STATUS`: Update status changed.
- `UpdateEvent.DOWNLOAD_START`: Download started.
- `DownloadErrorEvent.DOWNLOAD_ERROR`: Download failed.
- `StatusUpdateErrorEvent.UPDATE_ERROR`: Update error occurred.

**Example - Basic Auto-Update**:

```as3
var appUpdater:ApplicationUpdaterUI = new ApplicationUpdaterUI();

// Set update descriptor URL
appUpdater.updateURL = "https://example.com/updates/update.xml";

// Configure UI visibility
appUpdater.isCheckForUpdateVisible = true;
appUpdater.isDownloadUpdateVisible = true;
appUpdater.isInstallUpdateVisible = true;

// Check every 7 days
appUpdater.delay = 7;

// Event handlers
appUpdater.addEventListener(UpdateEvent.INITIALIZED, function(e:UpdateEvent):void {
    trace("Updater initialized");
});

appUpdater.addEventListener(StatusUpdateEvent.UPDATE_STATUS, function(e:StatusUpdateEvent):void {
    if (e.available) {
        trace("Update available: version " + e.version);
    } else {
        trace("No updates available");
    }
});

appUpdater.addEventListener(UpdateEvent.DOWNLOAD_COMPLETE, function(e:UpdateEvent):void {
    trace("Update downloaded, will install on next launch");
});

// Initialize the updater
appUpdater.initialize();
```

### ApplicationUpdater

Headless updater for custom UI implementation.

**Constructor**: `ApplicationUpdater()`

**Properties**:
- `updateURL: String`: URL to update descriptor.
- `currentVersion: String` (read-only): Current application version.
- `previousVersion: String` (read-only): Previous installed version.
- `currentState: String` (read-only): Current updater state.
- `isFirstRun: Boolean` (read-only): Whether this is first run after install/update.
- `wasPendingUpdate: Boolean` (read-only): Whether an update was pending.

**Methods**:
- `initialize(): void`: Initializes the updater.
- `checkForUpdate(): void`: Checks for updates.
- `downloadUpdate(): void`: Downloads the available update.
- `installUpdate(): void`: Installs the downloaded update.
- `cancelUpdate(): void`: Cancels ongoing operation.

**Example - Custom UI Update Flow**:

```as3
var updater:ApplicationUpdater = new ApplicationUpdater();
updater.updateURL = "https://example.com/updates/update.xml";

// 1. Initialize
updater.addEventListener(UpdateEvent.INITIALIZED, function(e:UpdateEvent):void {
    trace("Checking for updates...");
    updater.checkForUpdate();
});

// 2. Check result
updater.addEventListener(StatusUpdateEvent.UPDATE_STATUS, function(e:StatusUpdateEvent):void {
    if (e.available) {
        trace("Update available:");
        trace("  Version: " + e.version);
        trace("  Description: " + e.details[0]);
        
        // Show custom dialog
        showUpdateDialog(e.version, e.details[0], function(download:Boolean):void {
            if (download) {
                updater.downloadUpdate();
            }
        });
    } else {
        trace("Application is up to date");
    }
});

// 3. Download progress
updater.addEventListener(DownloadErrorEvent.DOWNLOAD_ERROR, function(e:DownloadErrorEvent):void {
    trace("Download error: " + e.text);
});

updater.addEventListener(UpdateEvent.DOWNLOAD_START, function(e:UpdateEvent):void {
    showProgressBar();
});

updater.addEventListener(ProgressEvent.PROGRESS, function(e:ProgressEvent):void {
    var percent:Number = (e.bytesLoaded / e.bytesTotal) * 100;
    updateProgressBar(percent);
});

updater.addEventListener(UpdateEvent.DOWNLOAD_COMPLETE, function(e:UpdateEvent):void {
    hideProgressBar();
    
    // Ask to install now or later
    showInstallDialog(function(installNow:Boolean):void {
        if (installNow) {
            updater.installUpdate(); // Restarts app
        } else {
            trace("Update will install on next launch");
        }
    });
});

updater.initialize();
```

## Update Descriptor XML

The update descriptor XML file defines update information:

```xml
<?xml version="1.0" encoding="utf-8"?>
<update xmlns="http://ns.adobe.com/air/framework/update/description/1.0">
    <!-- Latest version number -->
    <version>2.0.1</version>
    
    <!-- Update package URL -->
    <url>https://example.com/downloads/MyApp-2.0.1.air</url>
    
    <!-- Update description (supports multiple languages) -->
    <description>
        <text xml:lang="en">
            New Features:
            - Feature 1
            - Feature 2
            
            Bug Fixes:
            - Fixed issue A
            - Fixed issue B
        </text>
        <text xml:lang="fr">
            Nouvelles fonctionnalités:
            - Fonction 1
            - Fonction 2
        </text>
    </description>
</update>
```

## Update States

ApplicationUpdater goes through these states:

1. **UNINITIALIZED**: Initial state.
2. **INITIALIZING**: Loading configuration.
3. **READY**: Ready for operations.
4. **BEFORE_CHECKING**: About to check for updates.
5. **CHECKING**: Checking for updates.
6. **AVAILABLE**: Update available.
7. **DOWNLOADING**: Downloading update.
8. **DOWNLOADED**: Download complete.
9. **INSTALLING**: Installing update.
10. **PENDING_INSTALLING**: Will install on next launch.

## Update Events

### StatusUpdateEvent
- `available: Boolean`: Whether update is available.
- `version: String`: Update version.
- `details: Array`: Update description texts.

### StatusFileUpdateEvent
- `file: File`: The file being updated.
- `status: String`: Update status.

### DownloadErrorEvent
- `errorID: int`: Error code.
- `text: String`: Error description.
- `subErrorID: int`: Additional error info.

## Configuration File

Store local update configuration:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns="http://ns.adobe.com/air/framework/update/configuration/1.0">
    <url>https://example.com/updates/update.xml</url>
    <delay>7</delay>
    <defaultUI>
        <dialog name="checkForUpdate" visible="true"/>
        <dialog name="downloadUpdate" visible="true"/>
        <dialog name="downloadProgress" visible="true"/>
        <dialog name="installUpdate" visible="true"/>
        <dialog name="fileUpdate" visible="true"/>
        <dialog name="unexpectedError" visible="true"/>
    </defaultUI>
</configuration>
```

## Best Practices

### Versioning
Use semantic versioning (major.minor.patch):

```as3
// Compare versions
function isNewer(current:String, available:String):Boolean {
    var currParts:Array = current.split(".");
    var availParts:Array = available.split(".");
    
    for (var i:int = 0; i < 3; i++) {
        var curr:int = parseInt(currParts[i]);
        var avail:int = parseInt(availParts[i]);
        if (avail > curr) return true;
        if (avail < curr) return false;
    }
    return false;
}
```

### Handling First Run

```as3
if (updater.isFirstRun) {
    // Show welcome screen or tutorial
    showWelcomeScreen();
}

if (updater.wasPendingUpdate) {
    // Show "What's New" after update
    showWhatsNew(updater.previousVersion, updater.currentVersion);
}
```

### Error Handling

```as3
updater.addEventListener(StatusUpdateErrorEvent.UPDATE_ERROR, function(e:StatusUpdateErrorEvent):void {
    switch (e.errorID) {
        case 16800: // Update descriptor not found
            trace("Update server unavailable");
            scheduleRetry();
            break;
        case 16801: // Update descriptor invalid
            trace("Invalid update configuration");
            logError(e);
            break;
        case 16802: // Update file not found
            trace("Update package not found");
            break;
        case 16803: // Update file invalid
            trace("Update package is invalid");
            break;
        default:
            trace("Update error: " + e.text);
    }
});
```

### Silent Updates

```as3
// Silent background update
updater.isCheckForUpdateVisible = false;
updater.isDownloadUpdateVisible = false;
updater.isDownloadProgressVisible = false;

updater.addEventListener(StatusUpdateEvent.UPDATE_STATUS, function(e:StatusUpdateEvent):void {
    if (e.available) {
        // Download silently
        updater.downloadUpdate();
    }
});

updater.addEventListener(UpdateEvent.DOWNLOAD_COMPLETE, function(e:UpdateEvent):void {
    // Notify user subtly
    showNotification("Update downloaded. Will install on next launch.");
});
```

### Update Frequency

```as3
// Check on startup, then every 7 days
appUpdater.delay = 7;
appUpdater.initialize();

// Or manual check
checkUpdateButton.addEventListener(MouseEvent.CLICK, function():void {
    appUpdater.checkNow();
});
```

## Security Considerations

- Always use HTTPS for update URLs
- Sign your AIR packages with a trusted certificate
- Validate update descriptor XML schema
- Verify update package integrity
- Don't expose update URLs in client code if possible
- Implement server-side version validation

## Testing Updates

```as3
// Test with different descriptor versions
updater.updateURL = "https://test.example.com/updates/beta-update.xml";

// Test error scenarios
updater.updateURL = "https://invalid-url.example.com/update.xml";

// Test with local descriptor for development
var localDescriptor:File = File.applicationDirectory.resolvePath("test-update.xml");
updater.updateURL = localDescriptor.url;
```

## See Also

- `flash.desktop.NativeApplication` - Application lifecycle
- `flash.filesystem.File` - File system access
- `flash.desktop.Updater` - Simple updater (basic version)
- Adobe AIR Update Framework documentation
