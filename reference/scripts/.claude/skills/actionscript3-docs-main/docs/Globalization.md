# flash.globalization Package

Internationalization (i18n) and localization (l10n) support for ActionScript 3.0. Provides locale-aware formatting, parsing, sorting, and string manipulation.

## LocaleID

Represents a locale identifier (language, region, script, variant).

**Constructor**: `LocaleID(name:String = "i-default")`

**Properties**:
- `name: String`: Full locale name (e.g., "en-US", "zh-Hans-CN").
- `language: String` (read-only): ISO 639 language code (e.g., "en").
- `region: String` (read-only): ISO 3166 region code (e.g., "US").
- `script: String` (read-only): ISO 15924 script code (e.g., "Latn").
- `variant: String` (read-only): Locale variant.

**Static Methods**:
- `determinePreferredLocales(want:Vector.<String>, have:Vector.<String>, keyword:String = "userinterface"): Vector.<String>`: Determines best matching locales.

**Example**:

```as3
var locale:LocaleID = new LocaleID("en-US");
trace(locale.language); // "en"
trace(locale.region);   // "US"

var chineseLocale:LocaleID = new LocaleID("zh-Hans-CN");
trace(chineseLocale.script); // "Hans" (Simplified)
```

## DateTimeFormatter

Formats and parses dates and times according to locale conventions.

**Constructor**: `DateTimeFormatter(requestedLocaleIDName:String, dateStyle:String = "long", timeStyle:String = "long")`

**Properties**:
- `actualLocaleIDName: String` (read-only): Actual locale being used.
- `dateStyle: String`: Date format style (DateTimeStyle constants).
- `timeStyle: String`: Time format style (DateTimeStyle constants).
- `dateTimePattern: String`: Custom date/time pattern.

**Methods**:
- `format(dateTime:Date): String`: Formats a Date object.
- `formatUTC(dateTime:Date): String`: Formats a Date as UTC.
- `parse(dateTimeString:String): DateTimeParseResult`: Parses a date/time string.

**DateTimeStyle Constants**:
- `NONE`: No date/time component.
- `SHORT`: Shortest style (e.g., "1/1/24").
- `MEDIUM`: Medium style (e.g., "Jan 1, 2024").
- `LONG`: Long style (e.g., "January 1, 2024").
- `FULL`: Full style with day of week (e.g., "Monday, January 1, 2024").

**Example**:

```as3
// US English formatting
var formatter:DateTimeFormatter = new DateTimeFormatter("en-US");
formatter.dateStyle = DateTimeStyle.LONG;
formatter.timeStyle = DateTimeStyle.SHORT;
var dateStr:String = formatter.format(new Date()); 
// Output: "January 6, 2026, 5:58 PM"

// French formatting
var frFormatter:DateTimeFormatter = new DateTimeFormatter("fr-FR");
frFormatter.dateStyle = DateTimeStyle.LONG;
var frDateStr:String = frFormatter.format(new Date());
// Output: "6 janvier 2026"

// Custom pattern
formatter.dateTimePattern = "yyyy-MM-dd HH:mm:ss";
trace(formatter.format(new Date())); // "2026-01-06 17:58:59"
```

## NumberFormatter

Formats and parses numbers according to locale conventions.

**Constructor**: `NumberFormatter(requestedLocaleIDName:String)`

**Properties**:
- `actualLocaleIDName: String` (read-only): Actual locale being used.
- `decimalSeparator: String`: Character for decimal point (e.g., "." or ",").
- `groupingSeparator: String`: Character for grouping (e.g., "," or " ").
- `fractionalDigits: int`: Number of decimal places.
- `leadingZero: Boolean`: Whether to show leading zero for values < 1.
- `negativeNumberFormat: uint`: Format for negative numbers.
- `negativeSymbol: String`: Symbol for negative numbers (e.g., "-").
- `trailingZeros: Boolean`: Whether to show trailing zeros.
- `useGrouping: Boolean`: Whether to use thousands separator.

**Methods**:
- `formatInt(value:int): String`: Formats an integer.
- `formatNumber(value:Number): String`: Formats a number.
- `formatUint(value:uint): String`: Formats an unsigned integer.
- `parse(inputString:String): NumberParseResult`: Parses a number string.

**Example**:

```as3
// US formatting
var usFormatter:NumberFormatter = new NumberFormatter("en-US");
trace(usFormatter.formatNumber(1234567.89)); // "1,234,567.89"

// German formatting
var deFormatter:NumberFormatter = new NumberFormatter("de-DE");
trace(deFormatter.formatNumber(1234567.89)); // "1.234.567,89"

// Custom formatting
usFormatter.fractionalDigits = 2;
usFormatter.trailingZeros = true;
trace(usFormatter.formatNumber(42)); // "42.00"

// Parsing
var result:NumberParseResult = usFormatter.parse("1,234.56");
trace(result.value); // 1234.56
```

## CurrencyFormatter

Formats and parses currency values.

**Constructor**: `CurrencyFormatter(requestedLocaleIDName:String)`

**Properties**:
- `actualLocaleIDName: String` (read-only): Actual locale being used.
- `currencyISOCode: String`: ISO 4217 currency code (e.g., "USD", "EUR").
- `currencySymbol: String`: Currency symbol (e.g., "$", "€").
- `decimalSeparator: String`: Decimal point character.
- `fractionalDigits: int`: Decimal places for currency.
- `groupingSeparator: String`: Thousands separator.
- `negativeSymbol: String`: Negative number symbol.
- `positivePattern: String`: Format pattern for positive amounts.
- `negativePattern: String`: Format pattern for negative amounts.

**Methods**:
- `format(value:Number, withCurrencySymbol:Boolean = false): String`: Formats a currency value.
- `parse(inputString:String, parseContext:CurrencyParseContext): CurrencyParseResult`: Parses currency string.

**Example**:

```as3
// US Dollar formatting
var formatter:CurrencyFormatter = new CurrencyFormatter("en-US");
formatter.setCurrency("USD", "$");
trace(formatter.format(1234.56, true)); // "$1,234.56"

// Euro formatting
var euroFormatter:CurrencyFormatter = new CurrencyFormatter("de-DE");
euroFormatter.setCurrency("EUR", "€");
trace(euroFormatter.format(1234.56, true)); // "1.234,56 €"

// Negative amounts
trace(formatter.format(-50.00, true)); // "($50.00)" or "-$50.00" depending on pattern
```

## Collator

Compares and sorts strings according to locale-specific rules.

**Constructor**: `Collator(requestedLocaleIDName:String, collatorMode:String = "sorting")`

**Properties**:
- `actualLocaleIDName: String` (read-only): Actual locale being used.
- `ignoreCase: Boolean`: Whether comparison is case-insensitive.
- `ignoreDiacritics: Boolean`: Whether to ignore accents.
- `ignoreKanaType: Boolean`: Whether to ignore hiragana vs katakana differences.
- `ignoreSymbols: Boolean`: Whether to ignore symbols.
- `numericComparison: Boolean`: Whether to use numeric comparison for digits.

**Methods**:
- `compare(string1:String, string2:String): int`: Compares two strings. Returns -1, 0, or 1.
- `equals(string1:String, string2:String): Boolean`: Tests string equality.

**CollatorMode Constants**:
- `SORTING`: For sorting lists.
- `MATCHING`: For searching/matching.

**Example**:

```as3
// Basic comparison
var collator:Collator = new Collator("en-US");
trace(collator.compare("apple", "banana")); // -1 (apple < banana)

// Case-insensitive sorting
collator.ignoreCase = true;
var words:Array = ["Zebra", "apple", "BANANA"];
words.sort(function(a:String, b:String):int {
    return collator.compare(a, b);
});
trace(words); // ["apple", "BANANA", "Zebra"]

// Ignore diacritics
collator.ignoreDiacritics = true;
trace(collator.equals("café", "cafe")); // true

// Numeric comparison
collator.numericComparison = true;
var files:Array = ["file1.txt", "file10.txt", "file2.txt"];
files.sort(function(a:String, b:String):int {
    return collator.compare(a, b);
});
trace(files); // ["file1.txt", "file2.txt", "file10.txt"]
```

## StringTools

Utility methods for locale-aware string manipulation.

**Constructor**: `StringTools(requestedLocaleIDName:String)`

**Methods**:
- `toLowerCase(s:String): String`: Converts to lowercase using locale rules.
- `toUpperCase(s:String): String`: Converts to uppercase using locale rules.

**Example**:

```as3
var tools:StringTools = new StringTools("tr-TR"); // Turkish
trace(tools.toLowerCase("I")); // "ı" (dotless i in Turkish)
trace(tools.toUpperCase("i")); // "İ" (dotted I in Turkish)

var enTools:StringTools = new StringTools("en-US");
trace(enTools.toLowerCase("I")); // "i"
trace(enTools.toUpperCase("i")); // "I"
```

## LastOperationStatus

Status codes for globalization operations.

**Constants**:
- `NO_ERROR`: Operation successful.
- `ILLEGAL_ARGUMENT_ERROR`: Invalid argument.
- `PATTERN_SYNTAX_ERROR`: Invalid format pattern.
- `UNSUPPORTED_ERROR`: Feature not supported.
- `PARSE_ERROR`: Parsing failed.
- `BUFFER_OVERFLOW_ERROR`: Output buffer too small.
- `MEMORY_ALLOCATION_ERROR`: Out of memory.
- `PLATFORM_API_FAILED`: OS API call failed.
- `TRUNCATED_CHAR_FOUND`: String truncated.
- `UNEXPECTED_TOKEN`: Unexpected token in parsing.

**Example**:

```as3
var formatter:DateTimeFormatter = new DateTimeFormatter("en-US");
formatter.dateTimePattern = "invalid{pattern}";
trace(formatter.lastOperationStatus); // PATTERN_SYNTAX_ERROR
```

## National Digits and Date/Time Names

**NationalDigitsType**: Constants for digit representations.
- `EUROPEAN`: 0-9 (default).
- `ARABIC_INDIC`: Arabic-Indic digits.
- `EXTENDED_ARABIC_INDIC`: Extended Arabic-Indic.
- Many more regional digit systems...

**DateTimeNameStyle**: Constants for month/day name styles.
- `FULL`: Full name (e.g., "January").
- `LONG_ABBREVIATION`: Long abbreviation.
- `SHORT_ABBREVIATION`: Short abbreviation (e.g., "Jan").
- `NARROW`: Single letter (e.g., "J").

**DateTimeNameContext**: Constants for name context.
- `FORMAT`: For display in formatted date.
- `STANDALONE`: For standalone display (e.g., calendar headers).

## Best Practices

- Always check `actualLocaleIDName` to verify which locale was loaded
- Cache formatter instances for better performance
- Use `LastOperationStatus` to handle errors gracefully
- For sorting, use `Collator` instead of string comparison operators
- Set `numericComparison = true` when sorting filenames with numbers
- Consider fallback locales when primary locale is unavailable
- Use ISO currency codes ("USD", "EUR") instead of symbols for data storage

## Performance Tips

- Reuse formatter instances instead of creating new ones repeatedly
- Set properties before formatting to avoid multiple reconfigurations
- Use appropriate date/time styles instead of complex custom patterns when possible
- Cache `Collator` instances for repeated sorting operations

## See Also

- `flash.globalization.LocaleID` - Locale identification
- `Date` - Core date/time class
- `Number` - Core numeric type
