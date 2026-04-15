# ActionScript 3.0 External API & Sensors Reference

## flash.external.ExternalInterface

The primary bridge between ActionScript and the container (Web Browser/JavaScript or AIR Host).

- `available`: (Static) `true` if the container supports ExternalInterface.
- `objectID`: (Static) The `id` (IE) or `name` (NPAPI) attribute of the SWF in HTML.
- `marshallExceptions`: (Static) Set to `true` to pass errors between AS and JS.
- `addCallback(name:String, closure:Function)`: Registers an AS function to be callable from JS as `swfObject.name()`.
- `call(name:String, ...args)`: Calls a JS function. Returns the value returned by JS.

**Usage Note**: Always check `ExternalInterface.available` before calling. In browsers, ensures `<param name="allowScriptAccess" value="always" />` is set in HTML.

---

## flash.sensors.Accelerometer

Provides access to the device's motion sensor (Mobile only).

- `isSupported`: (Static) Check if hardware is available.
- `muted`: Read-only. `true` if the user denied permission.
- `setRequestedUpdateInterval(interval:Number)`: Update rate in milliseconds.
- **Event**: `AccelerometerEvent.UPDATE`
  - `accelerationX` / `accelerationY` / `accelerationZ`: G-force values.
  - `timestamp`: Time since app start.

---

## flash.sensors.Geolocation

Provides GPS and network-based location data (Mobile only).

- `isSupported`: (Static) Check if hardware is available.
- `muted`: Read-only. `true` if the user denied permission.
- `permissionStatus`: `PermissionStatus.GRANTED`, `DENIED`, or `UNKNOWN`.
- `desiredAccuracy`: (iOS) Accuracy constants like `LOCATION_ACCURACY_BEST`, `KILOMETER`, etc.
- `setRequestedUpdateInterval(interval:Number)`: Update rate in milliseconds.
- **Event**: `GeolocationEvent.UPDATE`
  - `latitude` / `longitude`: Coordinates in WGS-84.
  - `altitude`: Meters above sea level.
  - `horizontalAccuracy` / `verticalAccuracy`: Meters.
  - `speed`: Meters per second.
  - `heading`: Degrees relative to true north.

---

## flash.sensors.DeviceRotation (AIR)

Determines the physical orientation of the device.

- `isSupported`: (Static) Check if hardware is available.
- **Event**: `DeviceRotationEvent.UPDATE`
  - `roll`, `pitch`, `yaw`: Rotation in degrees.

---

## flash.external.ExtensionContext (AIR ANE)

Used for communicating with Native Extensions (ANE).

- `createExtensionContext(extensionID:String, contextType:String)`: (Static) Initialization.
- `call(functionName:String, ...args)`: Call native code.
- `dispose()`: Clean up native resources.
- **Event**: `StatusEvent.STATUS` (Used for native-to-AS updates).
