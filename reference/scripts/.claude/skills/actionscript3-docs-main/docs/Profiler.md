# flash.profiler

**[AIR 3.4+]** Performance profiling and telemetry integration for ActionScript applications.

---

## Telemetry

Static class for integrating with Adobe Scout and other profiling tools. Allows applications to send custom metrics and respond to profiler commands.

### Static Properties
- `connected:Boolean`: (Read-only) Returns `true` if the application is currently connected to a profiler (e.g., Adobe Scout).
- `spanMarker:Number`: (Read-only) Returns a high-resolution timestamp marker for measuring code execution time. Used with `sendSpanMetric()`.

### Static Methods

#### sendMetric(name:String, value:*):void
Sends a custom metric to the connected profiler.
- `name`: Identifier for the metric (e.g., "enemies_spawned", "level_loaded").
- `value`: The metric value. Can be a `Number`, `String`, or `Boolean`.

**Example**:
```actionscript
Telemetry.sendMetric("fps", stage.frameRate);
Telemetry.sendMetric("level", currentLevel.name);
```

#### sendSpanMetric(name:String, startSpanMarker:Number, value:* = null):void
Sends a time span metric to the profiler, measuring elapsed time between `startSpanMarker` and now.
- `name`: Identifier for the span (e.g., "physics_update", "render_pass").
- `startSpanMarker`: The start marker obtained from `Telemetry.spanMarker`.
- `value`: Optional additional data associated with this span.

**Example**:
```actionscript
var startTime:Number = Telemetry.spanMarker;
// ... perform expensive operation ...
performPhysicsUpdate();
Telemetry.sendSpanMetric("physics_update", startTime);
```

#### registerCommandHandler(commandName:String, handler:Function):Boolean
Registers a callback function to handle commands sent from the profiler.
- `commandName`: The name of the command (e.g., "dumpState", "clearCache").
- `handler`: A function with signature `function(command:String, ...args):*`.

Returns `true` if registration succeeded.

**Example**:
```actionscript
Telemetry.registerCommandHandler("dumpState", function(cmd:String, ...args):void {
    trace("Dumping application state...");
    trace("Entities: " + entityManager.count);
    trace("Memory: " + System.totalMemory);
});
```

#### unregisterCommandHandler(commandName:String):Boolean
Unregisters a previously registered command handler.

Returns `true` if unregistration succeeded.

---

## Use Cases

### Basic Custom Metrics
```actionscript
import flash.profiler.Telemetry;

// Send a simple counter
Telemetry.sendMetric("enemies_killed", enemyKillCount);

// Send a string identifier
Telemetry.sendMetric("current_scene", sceneName);
```

### Measuring Code Performance
```actionscript
var startMarker:Number = Telemetry.spanMarker;

// Critical code section
for (var i:int = 0; i < entities.length; i++) {
    entities[i].update(deltaTime);
}

Telemetry.sendSpanMetric("entity_update", startMarker);
```

### Profiling Multiple Operations
```actionscript
function renderFrame():void {
    var frameStart:Number = Telemetry.spanMarker;
    
    var physicsStart:Number = Telemetry.spanMarker;
    updatePhysics();
    Telemetry.sendSpanMetric("physics", physicsStart);
    
    var renderStart:Number = Telemetry.spanMarker;
    drawScene();
    Telemetry.sendSpanMetric("rendering", renderStart);
    
    Telemetry.sendSpanMetric("full_frame", frameStart);
}
```

### Responding to Profiler Commands
```actionscript
// Allow profiler to trigger garbage collection
Telemetry.registerCommandHandler("gc", function(cmd:String):void {
    System.gc();
    trace("Garbage collection triggered by profiler");
});

// Allow profiler to query stats
Telemetry.registerCommandHandler("getStats", function(cmd:String):Object {
    return {
        fps: stage.frameRate,
        memory: System.totalMemory,
        entities: entityCount
    };
});
```

---

## Adobe Scout Integration

Adobe Scout is the primary profiler that uses the Telemetry API. When Scout is connected:

1. **Automatic Profiling**: Scout captures frame rate, memory usage, rendering performance, and ActionScript execution time.
2. **Custom Metrics**: Use `sendMetric()` to add game-specific data to Scout's timeline.
3. **Custom Spans**: Use `sendSpanMetric()` to measure specific code sections (e.g., AI updates, pathfinding, asset loading).
4. **Command Handlers**: Register handlers to allow Scout to trigger actions in your app (e.g., dump debug info, toggle features).

### Enabling Telemetry

To use Telemetry with Scout, compile your SWF/AIR app with the `-advanced-telemetry` compiler flag:

```
mxmlc -advanced-telemetry MyApp.as
```

Or in `airsdk` / `build.xml`:
```xml
<additional-compiler-options>-advanced-telemetry</additional-compiler-options>
```

**Note**: Advanced telemetry has a small performance overhead. Only enable it for debug/profiling builds, not production releases.

---

## Best Practices

### 1. Use Meaningful Names
Choose clear, hierarchical names for metrics and spans:
```actionscript
// ✅ Good
Telemetry.sendSpanMetric("gameplay.ai.pathfinding", startMarker);
Telemetry.sendMetric("ui.inventory.items_displayed", itemCount);

// ❌ Bad
Telemetry.sendSpanMetric("span1", startMarker);
Telemetry.sendMetric("x", value);
```

### 2. Minimize Overhead
Telemetry calls are lightweight, but excessive metrics can impact performance. Profile critical sections only:
```actionscript
// ✅ Good - Profile major systems
Telemetry.sendSpanMetric("physics_update", startMarker);

// ❌ Bad - Don't profile every tiny function
for each (var entity:Entity in entities) {
    var entityStart:Number = Telemetry.spanMarker; // Too granular!
    entity.update();
    Telemetry.sendSpanMetric("entity_" + entity.id, entityStart);
}
```

### 3. Check Connection Status
Avoid sending metrics when not connected to a profiler (minimal overhead, but cleaner code):
```actionscript
if (Telemetry.connected) {
    Telemetry.sendMetric("debug_value", value);
}
```

### 4. Group Related Metrics
Organize metrics with a naming convention:
```actionscript
Telemetry.sendMetric("enemies.total", totalEnemies);
Telemetry.sendMetric("enemies.active", activeEnemies);
Telemetry.sendMetric("enemies.spawned_this_frame", spawnedThisFrame);
```

---

## Alternatives

If Adobe Scout is not available or you need more control, consider:

1. **Manual Profiling**: Use `getTimer()` or `new Date().time` to measure execution time and log results.
2. **Third-Party Profilers**: Tools like YourKit or JProfiler (for Java-based runtimes).
3. **Custom Telemetry**: Send metrics to your own server using `URLLoader` or sockets.

---

## Platform Support

- **AIR Desktop**: Full support.
- **AIR Mobile**: Full support.
- **Flash Player**: Not supported (Telemetry is AIR-only).

---

## Performance Impact

- **Without `-advanced-telemetry` flag**: Telemetry calls are no-ops. Minimal to zero overhead.
- **With `-advanced-telemetry` flag**: Small overhead (~1-3% in typical applications). Overhead increases with the number of metrics sent per frame.

**Recommendation**: Only enable `-advanced-telemetry` in debug/profiling builds. Strip it from production releases.
