# flash.printing

Desktop printing support for rendering content to physical printers.

**Platform Support**: Desktop only (not supported on mobile browsers or AIR for TV).  
Check `PrintJob.isSupported` at runtime for availability.

---

## PrintJob

Main class for creating print jobs. Extends `EventDispatcher`.

### Constructor
- `new PrintJob()`: Creates a new print job instance.

### Static Properties
- `isSupported:Boolean`: (Read-only) Returns `true` if printing is available on the current platform.
- `printers:Vector.<String>`: (Read-only) List of available printer names on the system.
- `supportsPageSetupDialog:Boolean`: (Read-only) Returns `true` if the platform supports a page setup dialog.

### Instance Properties
- `paperHeight:Number`: (Read-only) Height of paper area in points (1/72 inch). Available after `start()`.
- `paperWidth:Number`: (Read-only) Width of paper area in points. Available after `start()`.
- `pageHeight:Number`: (Read-only) Printable page height in points. Available after `start()`.
- `pageWidth:Number`: (Read-only) Printable page width in points. Available after `start()`.
- `paperArea:Rectangle`: (Read-only) Bounds of the physical paper in printer coordinate space.
- `printableArea:Rectangle`: (Read-only) Bounds of the printable area (accounting for hardware margins).
- `orientation:String`: (Read-only) Paper orientation. See `PrintJobOrientation` constants.
- `printer:String`: (Read-only) Name of the currently selected printer.
- `jobName:String`: Job name shown in the printer queue. Set before `start()`.
- `maxPixelsPerInch:Number`: (Read-only) Maximum DPI supported by the printer.
- `isColor:Boolean`: (Read-only) Returns `true` if printer supports color.
- `active:Boolean`: (Read-only) Returns `true` if the print job is active (between `start()` and `send()`).
- `copies:int`: Number of copies to print. Set before `start()`. Supported on macOS only.
- `firstPage:int`: First page number for partial printing. Set before `start()`. Supported on macOS only.
- `lastPage:int`: Last page number for partial printing. Set before `start()`. Supported on macOS only.

### Methods

#### start():Boolean
Opens the system print dialog. Returns `true` if user clicks OK, `false` if canceled.

After a successful `start()`, you have **15 seconds** to call the first `addPage()`.

#### start2(uiOptions:PrintUIOptions = null):Boolean
Opens a customized print dialog (AIR 2.0+).  
- `uiOptions`: Specify which UI elements appear in the dialog (copies, page range, etc.).

Returns `true` if user clicks OK, `false` if canceled.

#### addPage(sprite:Sprite, printArea:Rectangle = null, options:PrintJobOptions = null, frameNum:int = 0):void
Adds a page to the print job.
- `sprite`: The display object to render. Can be offscreen or invisible to the user.
- `printArea`: The region of the sprite to print (in sprite's coordinate space). If `null`, prints entire sprite bounds.
- `options`: Optional configuration (see `PrintJobOptions`).
- `frameNum`: For MovieClip, which frame to render.

**Timing Constraint**: Must be called within 15 seconds of the previous `addPage()` or `start()`.

#### send():void
Sends all added pages to the printer spooler. Must be called within 15 seconds of the last `addPage()`.

Closes the print job session. Call this after adding all pages.

#### terminate():void
Cancels the print job without sending pages to the printer.

#### showPageSetupDialog():Boolean
(AIR 2.0+) Opens a page setup dialog for margin/orientation configuration.  
Returns `true` if user clicked OK, `false` if canceled.

Call this **before** `start()`.

#### selectPaperSize(paperSize:PaperSize):Boolean
(AIR 3.3+) Programmatically sets the paper size before `start()`.  
Returns `true` on success.

### Events
- `statusEvent.STATUS`: Dispatched when print job status changes (AIR only).

### Workflow Example
```actionscript
var pj:PrintJob = new PrintJob();
var sheet:Sprite = new Sprite();
sheet.graphics.beginFill(0x336699);
sheet.graphics.drawRect(0, 0, 100, 100);

if (pj.start()) {
    try {
        pj.addPage(sheet);
        pj.send();
    } catch (e:Error) {
        trace("Print failed: " + e.message);
    }
} else {
    trace("User canceled");
}
```

### Important Notes
- **15-Second Timeout**: Between `start()`, `addPage()`, and `send()`, no interval can exceed 15 seconds or the job will fail.
- **Resolution**: Content is printed at screen resolution. Scale your graphics accordingly using the `paperWidth`/`paperHeight` properties.
- **Vector vs. Bitmap**: By default, vector content is preserved. Use `PrintJobOptions.printAsBitmap = true` to force bitmap rendering for complex transparency or filters.

---

## PrintJobOptions

Configuration for individual pages added with `addPage()`.

### Constructor
- `new PrintJobOptions(printAsBitmap:Boolean = false)`: Creates options with optional bitmap rendering flag.

### Properties
- `printAsBitmap:Boolean`: If `true`, renders the entire page as a bitmap instead of vector. Useful for content with filters, blend modes, or transparency that doesn't translate well to PostScript/PDF.
- `printMethod:String`: (AIR 52+, macOS only) Specifies print method. See `PrintMethod` constants.

### Example
```actionscript
var opts:PrintJobOptions = new PrintJobOptions(true); // Force bitmap
pj.addPage(complexSprite, null, opts);
```

---

## PrintUIOptions

(AIR 2.0+) Customizes which controls appear in the print dialog shown by `start2()`.

### Constructor
- `new PrintUIOptions()`: Creates a UI options object.

### Properties
All properties are `Boolean` and default to `false`:
- `showCopies`: Show the "Number of Copies" input.
- `showPageRange`: Show "All Pages" vs. "Page Range" controls.
- `showPaperSize`: Show paper size dropdown.
- `showOrientation`: Show portrait/landscape toggle.
- `showPrinterSelection`: Show printer selection dropdown.

### Example
```actionscript
var uiOpts:PrintUIOptions = new PrintUIOptions();
uiOpts.showCopies = true;
uiOpts.showPrinterSelection = true;

if (pj.start2(uiOpts)) {
    // User clicked OK
}
```

---

## PrintJobOrientation

(AIR 2.0+) Constants for paper orientation.

### Constants
- `LANDSCAPE:String = "landscape"`: Wide orientation.
- `PORTRAIT:String = "portrait"`: Tall orientation.

Use with `PrintJob.orientation` (read-only, set by user in print dialog).

---

## PrintMethod

(AIR 52+, macOS only) Constants for print rendering method.

### Constants
- `AUTO:String = "auto"`: (Default) Runtime chooses the best method.
- `RASTER:String = "raster"`: Force bitmap/raster rendering.
- `VECTOR:String = "vector"`: Force vector rendering.

Use with `PrintJobOptions.printMethod`.

---

## PaperSize

(AIR 3.3+) Represents a standard paper size.

### Constructor
- `new PaperSize(width:Number, height:Number)`: Creates a custom paper size (in points, 1/72 inch).

### Properties
- `width:Number`: Width in points.
- `height:Number`: Height in points.

### Static Methods
- `getPaperSizes():Vector.<PaperSize>`: Returns all available paper sizes on the current printer.

### Standard Sizes
Use `selectPaperSize()` with predefined sizes:
- **Letter**: 8.5 x 11 inches (612 x 792 points)
- **Legal**: 8.5 x 14 inches (612 x 1008 points)
- **A4**: 210 x 297 mm (~595 x 842 points)

### Example
```actionscript
var sizes:Vector.<PaperSize> = PaperSize.getPaperSizes();
for each (var size:PaperSize in sizes) {
    trace(size.width + " x " + size.height);
}

// Select letter size
var letterSize:PaperSize = new PaperSize(612, 792);
pj.selectPaperSize(letterSize);
```

---

## Common Patterns

### Multi-Page Printing
```actionscript
var pj:PrintJob = new PrintJob();
if (pj.start()) {
    for (var i:int = 0; i < pages.length; i++) {
        pj.addPage(pages[i]);
    }
    pj.send();
}
```

### Scaling Content to Fit Page
```actionscript
var pj:PrintJob = new PrintJob();
if (pj.start()) {
    var scaleX:Number = pj.pageWidth / content.width;
    var scaleY:Number = pj.pageHeight / content.height;
    var scale:Number = Math.min(scaleX, scaleY);
    
    content.scaleX = scale;
    content.scaleY = scale;
    
    pj.addPage(content);
    pj.send();
}
```

### Checking Support
```actionscript
if (PrintJob.isSupported) {
    // Printing is available
    var printers:Vector.<String> = PrintJob.printers;
    trace("Available printers: " + printers.join(", "));
} else {
    trace("Printing not supported on this platform");
}
```

---

## Platform Notes

- **Desktop**: Full support (Windows, macOS, Linux).
- **Mobile Browsers**: Not supported.
- **AIR for TV**: Not supported.
- **AIR Mobile**: Limited support. Check `isSupported` at runtime.
- **macOS Specific**: `copies`, `firstPage`, `lastPage` properties work. Windows ignores these.
- **Windows**: Page range/copies must be set in the system print dialog.

---

## Performance Considerations

- **Bitmap Rendering**: Larger pages rendered as bitmaps consume significant memory. Be cautious with high-DPI content.
- **Vector Rendering**: Generally more efficient but can fail with complex filters, blend modes, or 3D content. Use `printAsBitmap = true` if artifacts appear.
- **Offscreen Content**: You can print content that isn't on the display list. Create temporary sprites for printing without affecting the visible stage.
