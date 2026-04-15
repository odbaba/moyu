# ActionScript 3.0: `Date` Class

The `Date` class represents date and time information, either in local time or UTC.

## Key Properties

- `fullYear / fullYearUTC`: Four-digit year.
- `month / monthUTC`: Month (0-11).
- `date / dateUTC`: Day of month (1-31).
- `day / dayUTC`: Day of week (0-6, read-only).
- `hours / hoursUTC`: Hour (0-23).
- `minutes / minutesUTC`: Minutes (0-59).
- `seconds / secondsUTC`: Seconds (0-59).
- `milliseconds / millisecondsUTC`: Milliseconds (0-999).
- `time`: Milliseconds since Jan 1, 1970 00:00:00 UTC.
- `timezoneOffset`: Difference in minutes between UTC and local time.

## Key Methods

- `getTime(): Number`: Same as `time` property.
- `parse(dateString:String): Number` (static): Parses a date string and returns milliseconds.
- `UTC(year, month, ...): Number` (static): Returns milliseconds for a UTC date.
- `toString(), toUTCString(), toLocaleString()`
- `toDateString(), toTimeString()`

## Usage

```as3
var now:Date = new Date(); // Current time
var specific:Date = new Date(2023, 0, 1); // Jan 1, 2023
trace(now.fullYear);
```
