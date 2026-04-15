# ActionScript 3.0: `Math` Class

The `Math` class is a final class containing static methods and constants for mathematical functions. It cannot be instantiated.

## Constants

- `E`, `LN10`, `LN2`, `LOG10E`, `LOG2E`, `PI`, `SQRT1_2`, `SQRT2`.

## Rounding Methods

- `abs(val:Number): Number`: Absolute value.
- `ceil(val:Number): Number`: Round up to nearest integer.
- `floor(val:Number): Number`: Round down to nearest integer.
- `round(val:Number): Number`: Round to nearest integer.

## Trig & Calculus (Radians)

- `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`.
- `exp(val:Number)`, `log(val:Number)`, `pow(base:Number, pow:Number)`, `sqrt(val:Number)`.

## Other

- `max(...args): Number`: Returns the largest value.
- `min(...args): Number`: Returns the smallest value.
- `random(): Number`: Returns a pseudo-random number $n$ where $0 \le n < 1$.

## Conversion Formulas

- **Degrees to Radians**: `rad = deg * Math.PI / 180`
- **Radians to Degrees**: `deg = rad * 180 / Math.PI`
