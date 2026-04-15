# ActionScript 3.0: `XML` and `XMLList` (E4X)

ActionScript 3.0 implements ECMAScript for XML (E4X), providing a native way to handle XML.

## `XML` Class

Represents a single XML element, attribute, comment, processing instruction, or text node.

- **Access**: Use dot (`.`) for children and `@` for attributes.
- **Methods**:
  - `appendChild(child), prependChild(child)`
  - `attribute(name), attributes()`
  - `child(name), children()`
  - `descendants(name)` (can use `..` operator).
  - `toXMLString()`: Returns the XML as a string.

## `XMLList` Class

An ordered collection of XML objects. Many `XML` operations return an `XMLList`.

- If an `XMLList` has one item, it can often be treated as an `XML` object.

## Namespace & QName

- **`Namespace`**: Represents an XML namespace (prefix and URI).
- **`QName`**: Represents a qualified name (namespace and local name).

## Examples

```as3
var data:XML = 
    <root>
        <item id="1">Hello</item>
        <item id="2">World</item>
    </root>;

trace(data.item[0]);       // <item id="1">Hello</item>
trace(data.item.@id);      // 1
trace(data..item.length()); // 2 (descendants)
```

## Static Settings

`XML.ignoreWhitespace`, `XML.ignoreComments`, `XML.prettyPrinting`, `XML.prettyIndent`.
