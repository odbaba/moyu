# ActionScript 3.0: Error Classes

ActionScript 3.0 provides a hierarchy of error classes for exception handling. All error classes extend the base `Error` class.

## Base Error Class

### Error

The `Error` class contains information about an error that occurred in a script. When running compiled code in the debugger version of a Flash runtime, a dialog box displays exceptions of type Error or its subclasses.

**Constructor**: `Error(message:String = "", id:int = 0)`

**Properties**:
- `errorID: int` (read-only): The error number.
- `message: String`: A human-readable description of the error.
- `name: String`: The name of the error (default: "Error").

**Methods**:
- `getStackTrace(): String`: Returns the call stack trace at the time the error was created (debug builds only).
- `toString(): String`: Returns the string representation: `"[name] Error #[errorID]: [message]"`.

**Example**:

```as3
try {
    throw new Error("Something went wrong", 1001);
} catch (e:Error) {
    trace(e.toString()); // Error #1001: Something went wrong
    trace(e.errorID);    // 1001
    trace(e.message);    // Something went wrong
}
```

## Specialized Error Types

### ArgumentError

Thrown when an incorrect argument is passed to a function or method.

**Constructor**: `ArgumentError(message:String = "")`

**Example**:

```as3
function setAge(age:int):void {
    if (age < 0 || age > 150) {
        throw new ArgumentError("Age must be between 0 and 150");
    }
}
```

### RangeError

Thrown when a numeric value is outside the acceptable range.

**Constructor**: `RangeError(message:String = "")`

**Common uses**: Array index out of bounds, invalid parameter values.

### TypeError

Thrown when a value is not of the expected type.

**Constructor**: `TypeError(message:String = "")`

**Example**:

```as3
var obj:Object = null;
try {
    obj.someMethod(); // Throws TypeError: Cannot access a property or method of a null object
} catch (e:TypeError) {
    trace("Type error occurred");
}
```

### ReferenceError

Thrown when attempting to access a non-existent property or variable.

**Constructor**: `ReferenceError(message:String = "")`

### SecurityError

Thrown when a security violation occurs, such as attempting to access a resource without proper permissions.

**Constructor**: `SecurityError(message:String = "")`

**Common scenarios**:
- Cross-domain policy violations
- Sandbox security violations
- File system access restrictions (AIR)

### DefinitionError

Thrown when a definition (class, interface, namespace) is not found or is ambiguous.

**Constructor**: `DefinitionError(message:String = "")`

### EvalError

A legacy error type from ECMAScript. Rarely used in ActionScript 3.0.

**Constructor**: `EvalError(message:String = "")`

### SyntaxError

Thrown when parsing or compiling code encounters a syntax error. Typically seen when using runtime code evaluation.

**Constructor**: `SyntaxError(message:String = "")`

### URIError

Thrown when URI-related functions receive malformed URIs.

**Constructor**: `URIError(message:String = "")`

**Example**:

```as3
try {
    decodeURI("%"); // Invalid URI encoding
} catch (e:URIError) {
    trace("URI error");
}
```

### VerifyError

Thrown by the ActionScript Virtual Machine (AVM2) when bytecode verification fails.

**Constructor**: `VerifyError(message:String = "")`

**Note**: Usually indicates corrupted SWF files or bytecode manipulation errors.

## Error Handling Best Practices

### Try-Catch Blocks

```as3
try {
    // Code that may throw errors
    riskyOperation();
} catch (e:SecurityError) {
    // Handle security-specific errors
    trace("Security error: " + e.message);
} catch (e:Error) {
    // Handle all other errors
    trace("General error: " + e.message);
} finally {
    // Always executed, regardless of errors
    cleanup();
}
```

### Custom Error Classes

```as3
public class ValidationError extends Error {
    public function ValidationError(message:String = "", id:int = 0) {
        super(message, id);
        name = "ValidationError";
    }
}

// Usage
if (!isValid(input)) {
    throw new ValidationError("Invalid input format");
}
```

### Rethrowing Errors

```as3
try {
    processData();
} catch (e:Error) {
    trace("Error logged: " + e.message);
    throw e; // Rethrow to let caller handle it
}
```

## Error Hierarchy

```
Error
├── ArgumentError
├── DefinitionError
├── EvalError
├── RangeError
├── ReferenceError
├── SecurityError
├── SyntaxError
├── TypeError
├── URIError
└── VerifyError
```

All error classes inherit from the base `Error` class and support the same properties and methods.
