# flash.html Package **[AIR Only]**

HTML rendering engine for Adobe AIR applications. Embeds WebKit-based HTML content in AIR apps.

## HTMLLoader

WebKit-based HTML renderer that can display web content within AIR applications.

**Constructor**: `HTMLLoader()`

**Properties**:
- `location: String`: Current URL being displayed.
- `width: Number`: Width of the HTMLLoader.
- `height: Number`: Height of the HTMLLoader.
- `userAgent: String`: User agent string sent with HTTP requests.
- `htmlHost: HTMLHost`: Host object for JavaScript-to-ActionScript communication.
- `window: Object`: Reference to the JavaScript window object.
- `historyLength: int` (read-only): Number of items in history.
- `historyPosition: int` (read-only): Current position in history.
- `isHistoryBackEnabled: Boolean` (read-only): Whether back navigation is available.
- `isHistoryForwardEnabled: Boolean` (read-only): Whether forward navigation is available.
- `paintsDefaultBackground: Boolean`: Whether to paint default white background.
- `placeLoadStringContentInApplicationSandbox: Boolean`: Security setting for `loadString()` content.

**Methods**:
- `load(request:URLRequest): void`: Loads a URL.
- `loadString(html:String): void`: Loads HTML from a string.
- `reload(): void`: Reloads the current page.
- `historyBack(): void`: Navigates back in history.
- `historyForward(): void`: Navigates forward in history.
- `historyGo(steps:int): void`: Navigates to a specific history position.
- `cancelLoad(): void`: Cancels current page load.

**Events**:
- `Event.COMPLETE`: Page finished loading.
- `Event.HTML_RENDER`: Page rendered.
- `LocationChangeEvent.LOCATION_CHANGE`: URL changed.
- `LocationChangeEvent.LOCATION_CHANGING`: URL about to change (cancellable).
- `HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION`: JavaScript error occurred.

**Example - Basic HTML Loading**:

```as3
var htmlLoader:HTMLLoader = new HTMLLoader();
htmlLoader.width = 800;
htmlLoader.height = 600;

// Load external website
htmlLoader.load(new URLRequest("https://www.example.com"));

// Or load HTML string
htmlLoader.loadString("<html><body><h1>Hello from AIR!</h1></body></html>");

addChild(htmlLoader);
```

**Example - JavaScript Communication**:

```as3
var htmlLoader:HTMLLoader = new HTMLLoader();
htmlLoader.width = 800;
htmlLoader.height = 600;

// Create host for JS-to-AS communication
var host:HTMLHost = new HTMLHost();
htmlLoader.htmlHost = host;

htmlLoader.addEventListener(Event.COMPLETE, function():void {
    // Access JavaScript window object
    var jsWindow:Object = htmlLoader.window;
    
    // Call JavaScript function from ActionScript
    jsWindow.alert("Hello from ActionScript!");
    
    // Set JavaScript variable
    jsWindow.myVar = "Value from AS3";
    
    // Execute JavaScript
    var result:* = jsWindow.eval("2 + 2");
    trace("Result: " + result); // 4
});

htmlLoader.loadString(`
    <html>
    <head>
        <script>
            function callFromAS(message) {
                document.getElementById('output').innerHTML = message;
            }
            
            function callToAS() {
                // Access AIR runtime (if in app sandbox)
                if (window.runtime) {
                    var file = new window.runtime.flash.filesystem.File();
                    alert('AIR runtime available');
                }
            }
        </script>
    </head>
    <body>
        <div id="output">Waiting...</div>
        <button onclick="callToAS()">Call ActionScript</button>
    </body>
    </html>
`);

addChild(htmlLoader);

// Call JavaScript function after load
setTimeout(function():void {
    htmlLoader.window.callFromAS("Hello from ActionScript!");
}, 1000);
```

## HTMLHost

Facilitates communication between JavaScript and ActionScript.

**Methods**:
- `createWindow(windowCreateOptions:HTMLWindowCreateOptions): HTMLLoader`: Creates a new window for popup/target.
- `updateLocation(locationURL:String): void`: Called when location changes.
- `updateStatus(status:String): void`: Called when status text changes.
- `updateTitle(title:String): void`: Called when document title changes.
- `windowClose(): void`: Called when window.close() is invoked.

**Example - Custom Window Creation**:

```as3
public class MyHTMLHost extends HTMLHost {
    override public function createWindow(options:HTMLWindowCreateOptions):HTMLLoader {
        var newLoader:HTMLLoader = new HTMLLoader();
        newLoader.width = options.width || 800;
        newLoader.height = options.height || 600;
        
        // Add to display
        var window:NativeWindow = new NativeWindow();
        window.stage.addChild(newLoader);
        window.visible = true;
        
        return newLoader;
    }
    
    override public function updateTitle(title:String):void {
        trace("Page title changed: " + title);
    }
}

// Usage
var loader:HTMLLoader = new HTMLLoader();
loader.htmlHost = new MyHTMLHost();
```

## HTMLHistoryItem

Represents an item in the HTMLLoader's navigation history.

**Properties**:
- `url: String` (read-only): The URL of the history item.
- `title: String` (read-only): The page title.
- `originalUrl: String` (read-only): Original requested URL (before redirects).

## HTMLPDFCapability / HTMLSWFCapability

Check support for embedded PDF and SWF content.

**HTMLPDFCapability Constants**:
- `STATUS_OK`: PDF rendering supported.
- `ERROR_CANNOT_LOAD_READER`: Cannot load PDF reader.
- `ERROR_INSTALLED_READER_NOT_FOUND`: No PDF reader installed.
- `ERROR_INSTALLED_READER_TOO_OLD`: PDF reader too old.
- `ERROR_PREFERRED_READER_TOO_OLD`: Preferred reader too old.

**HTMLSWFCapability Constants**:
- `STATUS_OK`: SWF rendering supported.
- `ERROR_CANNOT_PLACE_SWF`: Cannot place SWF in HTML.

**Example**:

```as3
var pdfSupport:int = HTMLLoader.pdfCapability;
if (pdfSupport == HTMLPDFCapability.STATUS_OK) {
    trace("PDF rendering supported");
} else {
    trace("PDF not supported: " + pdfSupport);
}
```

## Security Sandboxes

HTMLLoader content can run in two sandboxes:

### Application Sandbox
- Full access to AIR APIs
- Can load file:// URLs
- Security restricted for remote content
- Set via `placeLoadStringContentInApplicationSandbox = true`

### Non-Application Sandbox  
- Limited AIR API access
- For remote content
- Normal browser security rules
- Set via `placeLoadStringContentInApplicationSandbox = false`

**Example**:

```as3
// Local HTML with full AIR access
var localLoader:HTMLLoader = new HTMLLoader();
localLoader.placeLoadStringContentInApplicationSandbox = true;
localLoader.load(new URLRequest("app:/local.html"));

// Remote HTML with restricted access
var remoteLoader:HTMLLoader = new HTMLLoader();
remoteLoader.placeLoadStringContentInApplicationSandbox = false;
localLoader.load(new URLRequest("https://example.com"));
```

## Common Patterns

### Inject ActionScript Object into JavaScript

```as3
htmlLoader.addEventListener(Event.COMPLETE, function():void {
    // Make AS3 object available to JavaScript
    htmlLoader.window.myApp = {
        version: "1.0",
        openFile: function(path:String):void {
            var file:File = new File(path);
            file.openWithDefaultApplication();
        }
    };
});
```

### Handle JavaScript Errors

```as3
htmlLoader.addEventListener(HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION, 
    function(e:HTMLUncaughtScriptExceptionEvent):void {
        trace("JavaScript error:");
        trace("  Line: " + e.exceptionValue.line);
        trace("  Message: " + e.exceptionValue.message);
        trace("  Stack: " + e.exceptionValue.stack);
    }
);
```

### Progress Indication

```as3
htmlLoader.addEventListener(LocationChangeEvent.LOCATION_CHANGING, function(e:LocationChangeEvent):void {
    showLoadingIndicator();
});

htmlLoader.addEventListener(Event.COMPLETE, function():void {
    hideLoadingIndicator();
});
```

## Best Practices

- Set appropriate `placeLoadStringContentInApplicationSandbox` for security
- Handle `UNCAUGHT_SCRIPT_EXCEPTION` events for debugging
- Use `LocationChangeEvent.LOCATION_CHANGING` to validate navigation
- Dispose of HTMLLoader when done to free memory
- Be careful with `loadString()` and user-generated content
- Consider using StageWebView for simpler HTML display needs

## Performance Tips

- Limit number of concurrent HTMLLoader instances
- Set `paintsDefaultBackground = false` if using custom background
- Avoid frequent `window` object access (cache references)
- Use CSS hardware acceleration where supported
- Optimize JavaScript execution in embedded content

## See Also

- `flash.html.HTMLHost` - JavaScript-ActionScript bridge
- `flash.media.StageWebView` - Alternative HTML renderer (mobile)
- `flash.external.ExternalInterface` - SWF-to-JavaScript communication
- `flash.desktop.NativeWindow` - Native windows for HTMLLoader
