# flash.geom Package

The `flash.geom` package provides classes for geometric math, coordinate systems, and transformations.

## Basic Geometry

### Point

Represents a location in a 2D coordinate system (x, y).

- **Properties**:
  - `x, y: Number` — Coordinates.
  - `length: Number` (Read-only) — Distance from (0,0) to this point.
- **Methods**:
  - `add(v: Point): Point` — Returns a new point (this + v).
  - `subtract(v: Point): Point` — Returns a new point (this - v).
  - `offset(dx: Number, dy: Number): void` — Moves the point by dx, dy.
  - `normalize(thickness: Number): void` — Scales the segment (0,0)->(x,y) to a set length.
  - `equals(toCompare: Point): Boolean`.
- **Static Methods**:
  - `distance(pt1: Point, pt2: Point): Number`.
  - `interpolate(pt1: Point, pt2: Point, f: Number): Point` — Linear interpolation between two points.
  - `polar(len: Number, angle: Number): Point` — Creates a point from polar coordinates (angle in radians).

### Rectangle

Represents a rectangular area (x, y, width, height).

- **Properties**:
  - `x, y, width, height: Number`.
  - `left, right, top, bottom: Number` — Derived boundary values.
  - `topLeft, bottomRight, size: Point` — Access as Point objects.
- **Methods**:
  - `contains(x: Number, y: Number): Boolean`.
  - `containsPoint(pt: Point): Boolean`.
  - `intersects(toCompare: Rectangle): Boolean`.
  - `intersection(toCompare: Rectangle): Rectangle` — Returns the overlapping area.
  - `union(toCompare: Rectangle): Rectangle` — Returns the smallest rect containing both.
  - `inflate(dx: Number, dy: Number): void` — Expands the rectangle.
  - `isEmpty(): Boolean`.

---

## Transformations

### Matrix

A 3x3 affine transformation matrix for 2D.

- **Components**: `a` (scaleX/cos), `b` (skewY/sin), `c` (skewX/-sin), `d` (scaleY/cos), `tx` (translateX), `ty` (translateY).
- **Methods**:
  - `translate(tx: Number, ty: Number)`: Moves the object.
  - `scale(sx: Number, sy: Number)`: Resizes the object.
  - `rotate(angle: Number)`: Rotates the object (angle in radians).
  - `concat(m: Matrix)`: Combines two matrices.
  - `invert()`: Inverts the transformation.
  - `identity()`: Resets to default values.
  - `createBox(...)`, `createGradientBox(...)`: Convenience setup.

### ColorTransform

Adjusts color values (Red, Green, Blue, Alpha) of a display object.

- **Properties**:
  - `redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier: Number` (0 to 1).
  - `redOffset, greenOffset, blueOffset, alphaOffset: Number` (-255 to 255).
  - `color: uint` — Hex RGB value (sets offsets to 0 and multipliers to 0, except for specific hex bits).

### Transform

Connects a `Matrix` or `ColorTransform` to a `DisplayObject`.

- **Usage**: `mySprite.transform.matrix = myMatrix;`
- **Properties**:
  - `matrix: Matrix` — 2D transformation.
  - `colorTransform: ColorTransform` — Color adjustment.
  - `pixelBounds: Rectangle` (Read-only) — Bounding box on the stage.
  - `concatenatedMatrix: Matrix` — Combined transformation from this object to root.
  - `matrix3D: Matrix3D` — For 3D transformations (requires `z != 0`).

---

## Example: Rotation around a custom point

```actionscript
var m:Matrix = sprite.transform.matrix;
m.translate(-pivotX, -pivotY); // Move point to origin
m.rotate(degrees * Math.PI / 180); // Rotate
m.translate(pivotX, pivotY); // Move back
sprite.transform.matrix = m;
```
