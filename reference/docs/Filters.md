# ActionScript 3.0 Visual Filters API Reference

## flash.filters.BitmapFilter

Base class for all filters. Filters are applied to the `filters` property of a `DisplayObject`.

### Usage Note

To update filters on an object, you must retrieve the array, modify it, and re-assign it:

```actionscript
var myFilters:Array = myDisplayObject.filters;
myFilters.push(new BlurFilter());
myDisplayObject.filters = myFilters;
```

---

## flash.filters.BlurFilter

Softens details of an image.

- `blurX` / `blurY`: Horizontal and vertical blur amount (0-255).
- `quality`: Number of iterations (1=low, 2=medium, 3=high/Gaussian).

## flash.filters.DropShadowFilter

Adds a shadow to the object.

- `distance`: Offset distance in pixels.
- `angle`: Shadow angle (0-360 degrees).
- `color`: Hex color.
- `alpha`: Transparency (0-1).
- `blurX` / `blurY`: Softness of the shadow.
- `strength`: Imprint/spread strength.
- `inner`: If `true`, shadow is inside the object.
- `knockout`: If `true`, hides the object and only shows the shadow.

## flash.filters.GlowFilter

Applies a glow effect (essentially a DropShadow with distance/angle at 0).

- `color`, `alpha`, `blurX`, `blurY`, `strength`, `quality`, `inner`, `knockout`.

## flash.filters.ColorMatrixFilter

Applies a 4x5 matrix transformation to every pixel (RGBA).

- `matrix`: An array of 20 numbers.

  ```
  redResult   = (a[0]*R) + (a[1]*G) + (a[2]*B) + (a[3]*A) + a[4]
  greenResult = (a[5]*R) + (a[6]*G) + (a[7]*B) + (a[8]*A) + a[9]
  ...and so on for Blue and Alpha.
  ```

## flash.filters.ConvolutionFilter

Applies a matrix convolution (neighboring pixel math). Used for sharpening, edge detection, blurring, etc.

- `matrixX` / `matrixY`: Matrix dimensions.
- `matrix`: Array of values (e.g., 3x3 = 9 values).
- `divisor`: Value that divides the sum of the matrix multiplication.
- `bias`: Value added to the result.
- `preserveAlpha`: If `false`, applies filter to alpha channel too.

## flash.filters.DisplacementMapFilter

Distorts the object using another `BitmapData` (displacement map).

- `mapBitmap`: The source map.
- `mapPoint`: Offset for the map.
- `componentX` / `componentY`: Which channel (R, G, B, A) in the map affects X/Y displacement.
- `scaleX` / `scaleY`: Global scale of the displacement.
- `mode`: How to handle out-of-bounds pixels (`wrap`, `clamp`, `ignore`, `color`).

## flash.filters.BevelFilter

Applies a bevel effect to an object.

- `distance`, `angle`, `highlightColor`, `highlightAlpha`, `shadowColor`, `shadowAlpha`, `blurX`, `blurY`, `strength`, `quality`, `type`, `knockout`.

---

## Performance Considerations

- Filters force `cacheAsBitmap = true`.
- Large objects with filters (especially high quality) significantly impact CPU/GPU.
- Objects larger than 8191x8191 pixels (or 16MP total) will have filters disabled by the runtime.
- Power-of-two blur values (2, 4, 8, 16...) are optimized and render faster.
