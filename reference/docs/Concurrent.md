# flash.concurrent Package

Multithreading primitives for concurrent programming in ActionScript 3.0. These classes enable thread synchronization and coordination between workers.

## Mutex

A mutual exclusion (mutex) object provides synchronized access to shared resources in multithreaded applications. Only one thread can acquire a mutex at a time.

**Constructor**: `Mutex()`

**Methods**:
- `lock(): void`: Acquires the mutex. If another thread holds the mutex, the calling thread blocks until it's available.
- `tryLock(): Boolean`: Attempts to acquire the mutex without blocking. Returns `true` if successful, `false` if already locked.
- `unlock(): void`: Releases the mutex, allowing other threads to acquire it.

**Example - Protecting Shared Data**:

```as3
// Shared between workers
var mutex:Mutex = new Mutex();
var sharedCounter:int = 0;

// In worker thread
mutex.lock();
try {
    sharedCounter++; // Safe: only one thread can execute this at a time
} finally {
    mutex.unlock(); // Always unlock in finally block
}
```

**Example - Try-Lock Pattern**:

```as3
if (mutex.tryLock()) {
    try {
        // Critical section
        updateSharedResource();
    } finally {
        mutex.unlock();
    }
} else {
    // Mutex is busy, do something else
    trace("Resource is busy, trying later");
}
```

**Best Practices**:
- Always use try-finally to ensure `unlock()` is called even if an error occurs
- Avoid holding locks for long periods to prevent thread starvation
- Use `tryLock()` to implement non-blocking algorithms
- Be careful to avoid deadlocks when using multiple mutexes

## Condition

A condition variable allows threads to wait for a specific condition to become true. Conditions work with mutexes to enable sophisticated thread coordination.

**Constructor**: `Condition(mutex:Mutex)`

**Properties**:
- `mutex: Mutex` (read-only): The mutex associated with this condition.

**Methods**:
- `wait(): Boolean`: Releases the mutex and waits for the condition to be signaled. Returns `true` when signaled, `false` on error.
- `notify(): void`: Wakes up one thread waiting on this condition.
- `notifyAll(): void`: Wakes up all threads waiting on this condition.

**Example - Producer-Consumer Pattern**:

```as3
var mutex:Mutex = new Mutex();
var condition:Condition = new Condition(mutex);
var queue:Array = [];

// Producer thread
function produce(item:*):void {
    mutex.lock();
    try {
        queue.push(item);
        condition.notify(); // Wake up a waiting consumer
    } finally {
        mutex.unlock();
    }
}

// Consumer thread
function consume():* {
    mutex.lock();
    try {
        while (queue.length == 0) {
            condition.wait(); // Wait for items to be produced
        }
        return queue.shift();
    } finally {
        mutex.unlock();
    }
}
```

**Example - Broadcast Signal**:

```as3
var mutex:Mutex = new Mutex();
var condition:Condition = new Condition(mutex);
var isReady:Boolean = false;

// Multiple worker threads waiting
function workerThread():void {
    mutex.lock();
    try {
        while (!isReady) {
            condition.wait(); // Wait for ready signal
        }
        // Proceed with work
        processData();
    } finally {
        mutex.unlock();
    }
}

// Main thread signaling all workers
function startWorkers():void {
    mutex.lock();
    try {
        isReady = true;
        condition.notifyAll(); // Wake all waiting threads
    } finally {
        mutex.unlock();
    }
}
```

**Best Practices**:
- Always use conditions with a mutex
- Check the condition in a while loop, not an if statement (spurious wakeups can occur)
- Use `notify()` when only one thread needs to wake up
- Use `notifyAll()` when all waiting threads should check the condition
- The mutex must be locked before calling `wait()`, `notify()`, or `notifyAll()`

## Worker Integration

These concurrency primitives are designed to work with the Worker API for true parallelism.

**Example - Cross-Worker Synchronization**:

```as3
// In main thread - create shareable mutex
var mutex:Mutex = new Mutex();
var sharedProperty:String = Worker.current.createProperty("mutex");
sharedProperty.value = mutex;

// Start worker
var worker:Worker = WorkerDomain.current.createWorker(workerSWF);
worker.start();

// In worker thread - access shared mutex
var sharedMutex:Mutex = Worker.current.getSharedProperty("mutex") as Mutex;

sharedMutex.lock();
try {
    // Access shared memory safely
} finally {
    sharedMutex.unlock();
}
```

## Thread Safety Notes

- Mutexes and conditions are thread-safe primitives
- Shared resources protected by mutexes must be accessed only while holding the lock
- ActionScript workers don't share memory by default - use `ByteArray.shareable` for shared data
- Always consider race conditions when designing concurrent systems

## Common Patterns

### Guard Pattern

```as3
function safeOperation():void {
    mutex.lock();
    try {
        // Protected operation
    } finally {
        mutex.unlock();
    }
}
```

### Double-Checked Locking

```as3
var initialized:Boolean = false;

function lazyInit():void {
    if (!initialized) { // First check (no lock)
        mutex.lock();
        try {
            if (!initialized) { // Second check (with lock)
                doExpensiveInitialization();
                initialized = true;
            }
        } finally {
            mutex.unlock();
        }
    }
}
```

### Wait-Notify Pattern

```as3
// Waiter
mutex.lock();
try {
    while (!conditionMet) {
        condition.wait();
    }
    performAction();
} finally {
    mutex.unlock();
}

// Notifier
mutex.lock();
try {
    conditionMet = true;
    condition.notify();
} finally {
    mutex.unlock();
}
```

## Performance Considerations

- Mutex locking has overhead - don't use for very fine-grained locking
- Prefer lock-free algorithms when possible for high-performance scenarios
- Consider using `tryLock()` with backoff strategies to reduce contention
- Profile worker-based concurrent code to identify bottlenecks

## See Also

- `flash.system.Worker` - Worker thread management
- `flash.system.WorkerDomain` - Worker domain container
- `flash.utils.ByteArray.shareable` - Shared memory between workers
