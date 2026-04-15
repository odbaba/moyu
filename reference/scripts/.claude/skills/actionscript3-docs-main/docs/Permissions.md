# flash.permissions Package **[AIR Only - Mobile]**

Runtime permission management for mobile AIR applications (Android primarily).

## PermissionManager

Manages runtime permissions required by the application on Android devices.

**Static Properties**:
- `isSupported: Boolean` (read-only): Whether runtime permissions are supported (Android 6.0+).

**Methods**:
- `requestPermissions(permissions:Vector.<String>): void`: Requests one or more permissions from the user.

**Events**:
- `PermissionEvent.PERMISSION_STATUS`: Fired when permission request is completed.

**Example**:

```as3
if (PermissionManager.isSupported) {
    var pm:PermissionManager = new PermissionManager();
    
    // Check if we have camera permission
    var cameraStatus:PermissionStatus = pm.checkPermission(Permission.CAMERA);
    
    if (cameraStatus == PermissionStatus.DENIED) {
        // Request permission
        pm.addEventListener(PermissionEvent.PERMISSION_STATUS, function(e:PermissionEvent):void {
            if (e.permission == Permission.CAMERA) {
                if (e.status == PermissionStatus.GRANTED) {
                    trace("Camera permission granted");
                    startCamera();
                } else {
                    trace("Camera permission denied");
                    showPermissionDeniedMessage();
                }
            }
        });
        
        pm.requestPermissions(Vector.<String>([Permission.CAMERA]));
    } else if (cameraStatus == PermissionStatus.GRANTED) {
        startCamera();
    }
}
```

**Common Permissions**:

```as3
// Location
Permission.ACCESS_FINE_LOCATION
Permission.ACCESS_COARSE_LOCATION

// Camera and Microphone
Permission.CAMERA
Permission.RECORD_AUDIO

// Storage
Permission.READ_EXTERNAL_STORAGE
Permission.WRITE_EXTERNAL_STORAGE

// Contacts
Permission.READ_CONTACTS
Permission.WRITE_CONTACTS

// Calendar
Permission.READ_CALENDAR
Permission.WRITE_CALENDAR

// Phone
Permission.CALL_PHONE
Permission.READ_PHONE_STATE

// SMS
Permission.SEND_SMS
Permission.READ_SMS
```

## PermissionStatus

Constants representing permission states.

**Constants**:
- `GRANTED`: Permission is granted.
- `DENIED`: Permission is denied.
- `UNKNOWN`: Permission status is unknown.

## Permission Request Flow

```as3
function requestLocationPermission():void {
    var pm:PermissionManager = new PermissionManager();
    
    // 1. Check current status
    var status:PermissionStatus = pm.checkPermission(Permission.ACCESS_FINE_LOCATION);
    
    switch (status) {
        case PermissionStatus.GRANTED:
            // Already granted, proceed
            enableLocationFeatures();
            break;
            
        case PermissionStatus.DENIED:
            // Need to request
            pm.addEventListener(PermissionEvent.PERMISSION_STATUS, onPermissionResponse);
            pm.requestPermissions(Vector.<String>([Permission.ACCESS_FINE_LOCATION]));
            break;
            
        case PermissionStatus.UNKNOWN:
            // Not supported or not applicable
            trace("Permission system not supported");
            break;
    }
}

function onPermissionResponse(e:PermissionEvent):void {
    if (e.permission == Permission.ACCESS_FINE_LOCATION) {
        if (e.status == PermissionStatus.GRANTED) {
            enableLocationFeatures();
        } else {
            // User denied permission
            showLocationDeniedMessage();
            
            // Optionally show rationale
            if (shouldShowRationale(Permission.ACCESS_FINE_LOCATION)) {
                showPermissionRationale();
            }
        }
    }
}
```

## Handling Multiple Permissions

```as3
function requestCameraAndMicrophone():void {
    var pm:PermissionManager = new PermissionManager();
    
    var permissions:Vector.<String> = Vector.<String>([
        Permission.CAMERA,
        Permission.RECORD_AUDIO
    ]);
    
    pm.addEventListener(PermissionEvent.PERMISSION_STATUS, function(e:PermissionEvent):void {
        trace("Permission: " + e.permission + " = " + e.status);
        
        // Check if all required permissions are granted
        var allGranted:Boolean = true;
        for each (var perm:String in permissions) {
            if (pm.checkPermission(perm) != PermissionStatus.GRANTED) {
                allGranted = false;
                break;
            }
        }
        
        if (allGranted) {
            startVideoRecording();
        }
    });
    
    pm.requestPermissions(permissions);
}
```

## Best Practices

### Request Permissions Contextually
Request permissions when the feature is needed, not at app startup:

```as3
// BAD - requesting at startup
addEventListener(Event.ACTIVATE, function():void {
    requestAllPermissions();
});

// GOOD - requesting when feature is used
cameraButton.addEventListener(MouseEvent.CLICK, function():void {
    requestCameraPermission();
});
```

### Show Rationale
Explain why you need permissions before requesting:

```as3
function requestLocationWithRationale():void {
    showDialog("Location Permission Needed", 
               "We need your location to show nearby restaurants.",
               function():void {
                   requestLocationPermission();
               });
}
```

### Handle Permanent Denial
Guide users to settings if they've permanently denied permission:

```as3
if (status == PermissionStatus.DENIED && !shouldShowRationale(permission)) {
    // User selected "Never ask again"
    showSettingsDialog("Permission Required",
                      "Please enable location in Settings > Apps > MyApp > Permissions");
}
```

### Check Before Using Features

```as3
function takePicture():void {
    if (!PermissionManager.isSupported) {
        // Older Android or iOS - permissions granted at install
        openCamera();
        return;
    }
    
    var pm:PermissionManager = new PermissionManager();
    if (pm.checkPermission(Permission.CAMERA) == PermissionStatus.GRANTED) {
        openCamera();
    } else {
        requestCameraPermission();
    }
}
```

## Platform Differences

### Android
- Runtime permissions required for Android 6.0+ (API 23+)
- User can deny permissions at runtime
- Permissions must be declared in app descriptor
- "Never ask again" option available

### iOS
- No runtime permission API in AIR
- Permissions requested automatically on first use
- User can change permissions in Settings
- Check feature availability through capability APIs

## App Descriptor Configuration

Declare permissions in your AIR app descriptor:

```xml
<android>
    <manifestAdditions><![CDATA[
        <manifest>
            <uses-permission android:name="android.permission.CAMERA"/>
            <uses-permission android:name="android.permission.RECORD_AUDIO"/>
            <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
            <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
        </manifest>
    ]]></manifestAdditions>
</android>
```

## Testing Permission Scenarios

```as3
// Simulate different permission states during development
function testPermissionFlow():void {
    trace("Testing: Permission granted");
    simulatePermission(PermissionStatus.GRANTED);
    
    trace("Testing: Permission denied");
    simulatePermission(PermissionStatus.DENIED);
    
    trace("Testing: Permission denied with rationale");
    simulatePermission(PermissionStatus.DENIED, true);
}
```

## Error Handling

```as3
try {
    pm.requestPermissions(Vector.<String>([Permission.CAMERA]));
} catch (e:Error) {
    trace("Permission request failed: " + e.message);
    // Handle gracefully - maybe permission not declared in manifest
}
```

## See Also

- `flash.media.Camera` - Camera access
- `flash.media.Microphone` - Microphone access
- `flash.sensors.Geolocation` - Location services
- `flash.filesystem.File` - File system access
- Android Permissions documentation
