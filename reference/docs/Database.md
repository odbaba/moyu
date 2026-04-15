# flash.data

**[AIR Only]** Local SQL database support using SQLite. Provides embedded relational database storage for AIR applications.

**Note**: Also includes `EncryptedLocalStore` for secure key-value storage (unrelated to SQL databases).

---

## SQLConnection

Manages creation, connection, and configuration of local SQLite database files. Extends `EventDispatcher`.

### Static Properties
- `isSupported:Boolean`: (Read-only) Returns `true` if SQL database support is available. Always `true` on AIR desktop and mobile.

### Constructor
- `new SQLConnection()`: Creates a SQLConnection instance.

### Opening Databases

#### open(reference:File, openMode:String = "create", autoCompact:Boolean = false, pageSize:int = 1024, encryptionKey:ByteArray = null):void
Opens a database **synchronously**. Blocks until operation completes.

- `reference`: File object for the database path.
- `openMode`: See `SQLMode` constants (`CREATE`, `READ`, `UPDATE`).
- `autoCompact`: If `true`, automatically compacts database when closed.
- `pageSize`: Database page size in bytes (1024, 2048, 4096, 8192, 16384, 32768). Larger pages improve performance for large BLOBs.
- `encryptionKey`: 16-byte key for AES-CCM encryption. `null` for unencrypted.

**Example**:
```actionscript
var dbFile:File = File.applicationStorageDirectory.resolvePath("mydb.db");
var conn:SQLConnection = new SQLConnection();
conn.open(dbFile);
```

#### openAsync(reference:File, openMode:String = "create", responder:Responder = null, autoCompact:Boolean = false, pageSize:int = 1024, encryptionKey:ByteArray = null):void
Opens a database **asynchronously**. Does not block.

**Events**: `SQLEvent.OPEN`, `SQLErrorEvent.ERROR`

**Example**:
```actionscript
var dbFile:File = File.applicationStorageDirectory.resolvePath("mydb.db");
var conn:SQLConnection = new SQLConnection();
conn.addEventListener(SQLEvent.OPEN, onOpen);
conn.addEventListener(SQLErrorEvent.ERROR, onError);
conn.openAsync(dbFile);

function onOpen(event:SQLEvent):void {
    trace("Database opened");
}

function onError(event:SQLErrorEvent):void {
    trace("Error: " + event.error.message);
}
```

#### close(responder:Responder = null):void
Closes the database connection. If `responder` is provided, operation is asynchronous.

**Events** (async): `SQLEvent.CLOSE`, `SQLErrorEvent.ERROR`

### Properties
- `connected:Boolean`: (Read-only) `true` if database is currently open.
- `inTransaction:Boolean`: (Read-only) `true` if a transaction is currently active.
- `lastInsertRowID:Number`: (Read-only) Row ID of the most recent INSERT operation.
- `totalChanges:int`: (Read-only) Total number of rows modified since the connection was opened.
- `columnNameStyle:String`: Controls how column names are returned in result sets. See `SQLColumnNameStyle`.
- `cacheSize:uint`: Number of pages to keep in memory. Default is 2000. Larger cache improves performance but uses more RAM.
- `pageSize:uint`: (Read-only) Page size for this database (set during `open()`).

### Transaction Methods

#### begin(option:String = null, responder:Responder = null):void
Begins a transaction. Operations are atomic until `commit()` or `rollback()`.

- `option`: Transaction lock type. See `SQLTransactionLockType`.

**Events** (async): `SQLEvent.BEGIN`, `SQLErrorEvent.ERROR`

#### commit(responder:Responder = null):void
Commits the current transaction, saving all changes.

**Events** (async): `SQLEvent.COMMIT`, `SQLErrorEvent.ERROR`

#### rollback(responder:Responder = null):void
Rolls back the current transaction, discarding all changes.

**Events** (async): `SQLEvent.ROLLBACK`, `SQLErrorEvent.ERROR`

### Savepoint Methods

Savepoints allow nested transaction-like behavior within a transaction.

#### setSavepoint(name:String = null, responder:Responder = null):void
Creates a savepoint. If `name` is `null`, auto-generates a name.

#### releaseSavepoint(name:String = null, responder:Responder = null):void
Releases (commits) a savepoint.

#### rollbackToSavepoint(name:String = null, responder:Responder = null):void
Rolls back to a savepoint, undoing operations since that savepoint.

**Example**:
```actionscript
conn.begin();
// ... perform operations ...
conn.setSavepoint("sp1");
// ... more operations ...
// Undo operations since savepoint, but keep earlier changes
conn.rollbackToSavepoint("sp1");
conn.commit();
```

### Schema Methods

#### loadSchema(type:Class = null, name:String = null, database:String = "main", includeColumnSchema:Boolean = true, responder:Responder = null):void
Loads database schema (tables, columns, indexes, triggers).

- `type`: Filter by schema type (`SQLTableSchema`, `SQLViewSchema`, `SQLIndexSchema`, `SQLTriggerSchema`). `null` loads all.
- `name`: Filter by object name. `null` loads all.
- `database`: Database name (`"main"` for primary, or attached database name).
- `includeColumnSchema`: If `true`, includes column details for tables/views.

**Events** (async): `SQLEvent.SCHEMA`, `SQLErrorEvent.ERROR`

**Returns**: Schema via `getSchemaResult()`.

#### getSchemaResult():SQLSchemaResult
Returns the result from the most recent `loadSchema()` call.

**Example**:
```actionscript
conn.loadSchema(SQLTableSchema);
conn.addEventListener(SQLEvent.SCHEMA, onSchema);

function onSchema(event:SQLEvent):void {
    var result:SQLSchemaResult = conn.getSchemaResult();
    for each (var table:SQLTableSchema in result.tables) {
        trace("Table: " + table.name);
        for each (var col:SQLColumnSchema in table.columns) {
            trace("  Column: " + col.name + " (" + col.dataType + ")");
        }
    }
}
```

### Other Methods

#### attach(name:String, reference:File = null, encryptionKey:ByteArray = null, responder:Responder = null):void
Attaches another database to this connection, accessible via `name` prefix in queries.

#### detach(name:String, responder:Responder = null):void
Detaches a previously attached database.

#### compact(responder:Responder = null):void
Manually compacts the database (removes empty pages, defragments).

#### analyze(responder:Responder = null):void
Analyzes the database to optimize query performance. Updates SQLite's internal statistics.

#### deanalyze(responder:Responder = null):void
Removes analysis data, reverting to default query optimization.

#### reencrypt(newEncryptionKey:ByteArray, responder:Responder = null):void
Changes the encryption key for the database. Pass `null` to remove encryption.

#### cancel(responder:Responder = null):void
Cancels the currently executing asynchronous operation.

---

## SQLStatement

Executes SQL statements against a `SQLConnection`. Extends `EventDispatcher`.

### Constructor
- `new SQLStatement()`: Creates a SQLStatement instance.

### Properties
- `sqlConnection:SQLConnection`: The connection to execute this statement on. Must be set before `execute()`.
- `text:String`: The SQL statement text (e.g., `"SELECT * FROM users WHERE age > :age"`).
- `parameters:Object`: Parameters for prepared statements (key-value pairs or indexed array).
- `itemClass:Class`: Custom class for result rows. If set, rows are instantiated as this class.
- `executing:Boolean`: (Read-only) `true` if statement is currently executing.

### Executing Statements

#### execute(prefetch:int = -1, responder:Responder = null):void
Executes the SQL statement.

- `prefetch`: Number of result rows to fetch immediately. `-1` fetches all. Async mode only.

**Synchronous**: Blocks until complete. Returns immediately.  
**Asynchronous**: Dispatches events.

**Events** (async): `SQLEvent.RESULT`, `SQLErrorEvent.ERROR`

**Example (Synchronous)**:
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "SELECT * FROM users";
stmt.execute();

var result:SQLResult = stmt.getResult();
trace("Rows: " + result.data.length);
```

**Example (Asynchronous)**:
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "SELECT * FROM users";
stmt.addEventListener(SQLEvent.RESULT, onResult);
stmt.execute();

function onResult(event:SQLEvent):void {
    var result:SQLResult = stmt.getResult();
    trace("Rows: " + result.data.length);
}
```

#### next(prefetch:int = -1, responder:Responder = null):void
Fetches the next batch of result rows. Use when `prefetch` was set in `execute()`.

**Events** (async): `SQLEvent.RESULT`, `SQLErrorEvent.ERROR`

#### getResult():SQLResult
Returns the result from the most recent `execute()` or `next()` call.

### Parameter Binding

Use named (`:name`) or indexed (`?`) parameters to avoid SQL injection:

**Named Parameters**:
```actionscript
stmt.text = "INSERT INTO users (name, age) VALUES (:name, :age)";
stmt.parameters[":name"] = "Alice";
stmt.parameters[":age"] = 30;
stmt.execute();
```

**Indexed Parameters**:
```actionscript
stmt.text = "INSERT INTO users (name, age) VALUES (?, ?)";
stmt.parameters[0] = "Bob";
stmt.parameters[1] = 25;
stmt.execute();
```

### Other Methods

#### clearParameters():void
Clears all parameter values.

#### cancel():void
Cancels the currently executing statement (async mode only).

---

## SQLResult

Contains the results of a SQL statement execution.

### Properties
- `data:Array`: Array of result rows (each row is an Object with column-name keys). `null` if no rows returned.
- `rowsAffected:Number`: Number of rows affected by INSERT, UPDATE, or DELETE. `0` for SELECT.
- `complete:Boolean`: `true` if all result rows have been fetched.
- `lastInsertRowID:Number`: Row ID of the most recent INSERT (if statement inserted a row).

### Example
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "SELECT id, name, age FROM users";
stmt.execute();

var result:SQLResult = stmt.getResult();
for each (var row:Object in result.data) {
    trace(row.id + ": " + row.name + " (age " + row.age + ")");
}
```

---

## SQLMode

Constants for database opening modes.

### Constants
- `CREATE:String = "create"`: Opens existing database or creates a new one. Default.
- `READ:String = "read"`: Opens in read-only mode. Fails if database doesn't exist.
- `UPDATE:String = "update"`: Opens for reading and writing. Fails if database doesn't exist.

---

## SQLColumnNameStyle

Constants for controlling column name format in result sets.

### Constants
- `DEFAULT:String = "default"`: Uses original column names (e.g., `user.name` becomes `name`).
- `FULL:String = "full"`: Includes table prefix (e.g., `user.name`).

Set via `SQLConnection.columnNameStyle`.

---

## SQLTransactionLockType

Constants for transaction locking behavior.

### Constants
- `DEFERRED:String = "deferred"`: (Default) Lock acquired on first read/write.
- `IMMEDIATE:String = "immediate"`: Acquires write lock immediately.
- `EXCLUSIVE:String = "exclusive"`: Acquires exclusive lock immediately (blocks all other connections).

Use with `SQLConnection.begin(option)`.

---

## SQLSchemaResult

Contains schema information returned by `SQLConnection.loadSchema()`.

### Properties
- `tables:Array`: Array of `SQLTableSchema` objects.
- `views:Array`: Array of `SQLViewSchema` objects.
- `indexes:Array`: Array of `SQLIndexSchema` objects.
- `triggers:Array`: Array of `SQLTriggerSchema` objects.

---

## SQLTableSchema

Describes a database table.

### Properties
- `name:String`: Table name.
- `columns:Array`: Array of `SQLColumnSchema` objects.
- `sql:String`: The CREATE TABLE statement used to create the table.

---

## SQLColumnSchema

Describes a table column.

### Properties
- `name:String`: Column name.
- `dataType:String`: SQLite type (`"INTEGER"`, `"TEXT"`, `"REAL"`, `"BLOB"`, `"NUMERIC"`).
- `primaryKey:Boolean`: `true` if this column is part of the primary key.
- `autoIncrement:Boolean`: `true` if this is an INTEGER PRIMARY KEY AUTOINCREMENT column.
- `allowNull:Boolean`: `true` if NULL values are allowed.
- `defaultCollationType:String`: Collation for text sorting (e.g., `"BINARY"`, `"NOCASE"`).
- `defaultValue:String`: Default value SQL expression.

---

## SQLIndexSchema

Describes a database index.

### Properties
- `name:String`: Index name.
- `table:String`: Table the index is on.
- `sql:String`: The CREATE INDEX statement.

---

## SQLViewSchema

Describes a database view.

### Properties
- `name:String`: View name.
- `sql:String`: The CREATE VIEW statement.

---

## SQLTriggerSchema

Describes a database trigger.

### Properties
- `name:String`: Trigger name.
- `table:String`: Table the trigger is on.
- `sql:String`: The CREATE TRIGGER statement.

---

## SQLCollationType

Constants for text collation (sorting) behavior.

### Constants
- `BINARY:String = "BINARY"`: Case-sensitive byte comparison.
- `NOCASE:String = "NOCASE"`: Case-insensitive comparison (ASCII only).
- `RTRIM:String = "RTRIM"`: Like BINARY, but ignores trailing spaces.

Use in CREATE TABLE or ORDER BY clauses:
```sql
CREATE TABLE users (name TEXT COLLATE NOCASE);
SELECT * FROM users ORDER BY name COLLATE NOCASE;
```

---

## EncryptedLocalStore

**[AIR Only]** Secure key-value storage using AES encryption. Data is stored locally and tied to the AIR application and user account.

**Note**: This is **not** part of SQL databases. It's a separate secure storage API.

### Static Methods

#### setItem(name:String, data:ByteArray, stronglyBound:Boolean = false):void
Stores encrypted data under the given key.

- `name`: Key identifier (e.g., "auth_token").
- `data`: Data to store (as ByteArray).
- `stronglyBound`: If `true`, data is bound to the publisher ID (more secure, but can't be migrated).

#### getItem(name:String):ByteArray
Retrieves encrypted data for the given key. Returns `null` if key doesn't exist.

#### removeItem(name:String):void
Deletes the encrypted data for the given key.

#### reset():void
Deletes all data in the encrypted local store.

### Example
```actionscript
import flash.data.EncryptedLocalStore;
import flash.utils.ByteArray;

// Store
var token:String = "secret_auth_token_12345";
var data:ByteArray = new ByteArray();
data.writeUTFBytes(token);
EncryptedLocalStore.setItem("auth_token", data);

// Retrieve
var storedData:ByteArray = EncryptedLocalStore.getItem("auth_token");
if (storedData) {
    storedData.position = 0;
    var storedToken:String = storedData.readUTFBytes(storedData.length);
    trace("Token: " + storedToken);
}

// Delete
EncryptedLocalStore.removeItem("auth_token");
```

### Security Notes
- Data is encrypted with AES and stored locally.
- Keys are derived from the AIR application ID and user account.
- Data is **not** accessible by other AIR applications or users.
- **Loss of data**: If the AIR application is uninstalled or the OS is reinstalled, encrypted data may be lost.
- Use `stronglyBound = true` for sensitive data (e.g., passwords), but note that this prevents data migration between app versions if publisher ID changes.

---

## Common Patterns

### Create Table
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "CREATE TABLE IF NOT EXISTS users (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "name TEXT NOT NULL, " +
            "email TEXT UNIQUE, " +
            "age INTEGER)";
stmt.execute();
```

### Insert Data
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "INSERT INTO users (name, email, age) VALUES (:name, :email, :age)";
stmt.parameters[":name"] = "Alice";
stmt.parameters[":email"] = "alice@example.com";
stmt.parameters[":age"] = 30;
stmt.execute();

var result:SQLResult = stmt.getResult();
trace("Inserted row ID: " + result.lastInsertRowID);
```

### Query Data
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "SELECT * FROM users WHERE age >= :minAge ORDER BY name";
stmt.parameters[":minAge"] = 18;
stmt.execute();

var result:SQLResult = stmt.getResult();
for each (var row:Object in result.data) {
    trace(row.name + " (" + row.age + ")");
}
```

### Update Data
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "UPDATE users SET age = :newAge WHERE id = :userId";
stmt.parameters[":newAge"] = 31;
stmt.parameters[":userId"] = 1;
stmt.execute();

var result:SQLResult = stmt.getResult();
trace("Rows updated: " + result.rowsAffected);
```

### Delete Data
```actionscript
var stmt:SQLStatement = new SQLStatement();
stmt.sqlConnection = conn;
stmt.text = "DELETE FROM users WHERE age < :minAge";
stmt.parameters[":minAge"] = 18;
stmt.execute();

var result:SQLResult = stmt.getResult();
trace("Rows deleted: " + result.rowsAffected);
```

### Transactions
```actionscript
conn.begin();
try {
    var stmt1:SQLStatement = new SQLStatement();
    stmt1.sqlConnection = conn;
    stmt1.text = "INSERT INTO users (name, age) VALUES ('Bob', 25)";
    stmt1.execute();
    
    var stmt2:SQLStatement = new SQLStatement();
    stmt2.sqlConnection = conn;
    stmt2.text = "UPDATE stats SET user_count = user_count + 1";
    stmt2.execute();
    
    conn.commit();
    trace("Transaction committed");
} catch (error:SQLError) {
    conn.rollback();
    trace("Transaction rolled back: " + error.message);
}
```

### Encrypted Database
```actionscript
var key:ByteArray = new ByteArray();
// Generate or retrieve a 16-byte encryption key
for (var i:int = 0; i < 16; i++) {
    key.writeByte(Math.random() * 256);
}

var dbFile:File = File.applicationStorageDirectory.resolvePath("secure.db");
var conn:SQLConnection = new SQLConnection();
conn.open(dbFile, SQLMode.CREATE, false, 1024, key);
```

---

## Best Practices

### 1. Always Use Prepared Statements
Prevent SQL injection by using parameter binding:
```actionscript
// ✅ Good - Safe from SQL injection
stmt.text = "SELECT * FROM users WHERE name = :name";
stmt.parameters[":name"] = userInput;

// ❌ Bad - Vulnerable to SQL injection
stmt.text = "SELECT * FROM users WHERE name = '" + userInput + "'";
```

### 2. Use Transactions for Multiple Operations
Group related operations in a transaction for atomicity and performance:
```actionscript
conn.begin();
// ... multiple INSERTs, UPDATEs, DELETEs ...
conn.commit();
```

### 3. Close Connections When Done
Always close database connections to release file handles:
```actionscript
conn.close();
```

### 4. Use Async Mode for UI Applications
Synchronous operations block the UI. Use async mode for better user experience:
```actionscript
conn.openAsync(dbFile);
stmt.addEventListener(SQLEvent.RESULT, onResult);
stmt.execute();
```

### 5. Handle Errors Gracefully
```actionscript
try {
    stmt.execute();
} catch (error:SQLError) {
    trace("SQL Error: " + error.message);
    trace("Details: " + error.details);
}
```

### 6. Optimize with Indexes
Create indexes on frequently queried columns:
```actionscript
stmt.text = "CREATE INDEX idx_users_email ON users(email)";
stmt.execute();
```

### 7. Use VACUUM to Reclaim Space
After deleting large amounts of data:
```actionscript
stmt.text = "VACUUM";
stmt.execute();
```

---

## Platform Support

- **AIR Desktop**: Full support (Windows, macOS, Linux).
- **AIR Mobile**: Full support (iOS, Android).
- **AIR for TV**: Full support.
- **Flash Player**: Not supported (AIR-only feature).

---

## SQLite Version

AIR uses SQLite 3.x. The exact version varies by AIR SDK version. Check SQLite documentation for supported SQL syntax and features.

---

## Performance Tips

1. **Batch operations in transactions**: Single transaction is much faster than multiple individual operations.
2. **Use indexes**: Speed up queries on columns used in WHERE, JOIN, and ORDER BY clauses.
3. **Tune cache size**: Increase `cacheSize` for better performance with large databases.
4. **Optimize page size**: Larger `pageSize` improves performance for BLOBs and large text fields.
5. **Run ANALYZE periodically**: Helps SQLite optimize query execution plans.
6. **Avoid SELECT ***: Only query columns you need to reduce data transfer overhead.
