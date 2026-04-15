# flash.notifications Package **[AIR Only - Mobile]**

Push notification support for mobile AIR applications (iOS and Android).

## RemoteNotifier

Manages remote push notifications from services like Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM).

**Static Properties**:
- `isSupported: Boolean` (read-only): Whether remote notifications are supported on this device.

**Instance Properties**:
- `supportedNotificationStyles: Vector.<String>` (read-only): Available notification styles on this device.

**Methods**:
- `subscribe(options:RemoteNotifierSubscribeOptions = null): void`: Subscribes to remote notifications.
- `unsubscribe(): void`: Unsubscribes from remote notifications.

**Events**:
- `RemoteNotificationEvent.TOKEN`: Device token received from notification service.
- `RemoteNotificationEvent.NOTIFICATION`: Notification received.
- `StatusEvent.STATUS`: Error occurred during subscription.

**Example**:

```as3
if (RemoteNotifier.isSupported) {
    var notifier:RemoteNotifier = new RemoteNotifier();
    
    // Subscribe to notifications
    var options:RemoteNotifierSubscribeOptions = new RemoteNotifierSubscribeOptions();
    options.notificationStyles = Vector.<String>([
        NotificationStyle.ALERT,
        NotificationStyle.BADGE,
        NotificationStyle.SOUND
    ]);
    
    // Handle device token
    notifier.addEventListener(RemoteNotificationEvent.TOKEN, function(e:RemoteNotificationEvent):void {
        var deviceToken:String = e.token;
        trace("Device token: " + deviceToken);
        // Send token to your server
        sendTokenToServer(deviceToken);
    });
    
    // Handle incoming notifications
    notifier.addEventListener(RemoteNotificationEvent.NOTIFICATION, function(e:RemoteNotificationEvent):void {
        trace("Notification received: " + e.payload);
        // Process notification payload
        handleNotification(e.payload);
    });
    
    // Handle errors
    notifier.addEventListener(StatusEvent.STATUS, function(e:StatusEvent):void {
        trace("Error: " + e.level + " - " + e.code);
    });
    
    notifier.subscribe(options);
}
```

## RemoteNotifierSubscribeOptions

Configuration options for push notification subscription.

**Properties**:
- `notificationStyles: Vector.<String>`: Desired notification styles.

**Example**:

```as3
var options:RemoteNotifierSubscribeOptions = new RemoteNotifierSubscribeOptions();
options.notificationStyles = Vector.<String>([
    NotificationStyle.ALERT,
    NotificationStyle.BADGE,
    NotificationStyle.SOUND
]);
```

## NotificationStyle

Constants for notification presentation styles.

**Constants**:
- `ALERT`: Show alert messages.
- `BADGE`: Show badge on app icon.
- `SOUND`: Play notification sound.

## Remote Notification Payload

The notification payload contains custom data sent from your server.

**Example Payload Structure**:

```as3
// iOS APNs format
{
    "aps": {
        "alert": "New message received",
        "badge": 5,
        "sound": "default"
    },
    "customKey": "customValue"
}

// Android FCM format
{
    "notification": {
        "title": "New Message",
        "body": "You have a new message"
    },
    "data": {
        "customKey": "customValue"
    }
}
```

## Best Practices

- Always check `RemoteNotifier.isSupported` before using
- Store device tokens on your server for sending notifications
- Handle token refresh - tokens can change
- Test with both foreground and background notification scenarios
- Request appropriate notification styles for your app's needs
- Respect user's notification preferences
- Handle notification data even when app is not running

## Platform-Specific Notes

### iOS
- Requires configuration in app descriptor (`iPhone > Entitlements > get-task-allow`)
- Production vs development certificates differ
- User must grant permission for notifications

### Android
- Requires FCM configuration in app descriptor
- Uses Firebase Cloud Messaging (FCM)
- Notifications work automatically without user permission prompt

## Security Considerations

- Never expose device tokens in client-side code
- Validate notification payloads before processing
- Use HTTPS for all server communications
- Implement token refresh mechanisms
- Handle malformed notification data gracefully

## See Also

- `flash.desktop.NativeApplication` - App lifecycle events
- `flash.events.RemoteNotificationEvent` - Notification event details
- `flash.permissions` - Runtime permissions
