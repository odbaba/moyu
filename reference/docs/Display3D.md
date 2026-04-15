# flash.display3D Package - Stage3D GPU Rendering

Hardware-accelerated 3D graphics using the GPU. Stage3D provides low-level access to GPU rendering capabilities for high-performance 3D content.

## Context3D

Main interface to the GPU for 3D rendering operations.

**Properties**:
- `driverInfo: String` (read-only): GPU driver information.
- `enableErrorChecking: Boolean`: Enable detailed error checking (slower).
- `profile: String` (read-only): Current rendering profile.
- `backBufferWidth: int` (read-only): Back buffer width.
- `backBufferHeight: int` (read-only): Back buffer height.

**Key Methods**:

### Setup & Configuration
- `configureBackBuffer(width:int, height:int, antiAlias:int, enableDepthAndStencil:Boolean = true): void`: Configures the render target.
- `clear(red:Number = 0, green:Number = 0, blue:Number = 0, alpha:Number = 1, depth:Number = 1, stencil:uint = 0, mask:uint = 0xFFFFFFFF): void`: Clears buffers.
- `present(): void`: Presents the back buffer to screen.

### Resource Creation
- `createVertexBuffer(numVertices:int, data32PerVertex:int, bufferUsage:String = "staticDraw"): VertexBuffer3D`: Creates a vertex buffer.
- `createIndexBuffer(numIndices:int, bufferUsage:String = "staticDraw"): IndexBuffer3D`: Creates an index buffer.
- `createProgram(): Program3D`: Creates a shader program.
- `createTexture(width:int, height:int, format:String, optimizeForRenderToTexture:Boolean): Texture`: Creates a texture.
- `createCubeTexture(size:int, format:String, optimizeForRenderToTexture:Boolean): CubeTexture`: Creates a cube map.

### Rendering State
- `setVertexBufferAt(index:int, buffer:VertexBuffer3D, bufferOffset:int = 0, format:String = "float4"): void`: Binds vertex data.
- `setProgramConstantsFromMatrix(programType:String, firstRegister:int, matrix:Matrix3D, transposedMatrix:Boolean = false): void`: Sets shader constants.
- `setProgramConstantsFromVector(programType:String, firstRegister:int, data:Vector.<Number>, numRegisters:int = -1): void`: Sets shader constants from vector.
- `setProgram(program:Program3D): void`: Activates a shader program.
- `setTextureAt(sampler:int, texture:TextureBase): void`: Binds a texture.
- `setBlendFactors(sourceFactor:String, destinationFactor:String): void`: Sets blend mode.
- `setDepthTest(depthMask:Boolean, passCompareMode:String): void`: Configures depth testing.
- `setCulling(triangleFaceToCull:String): void`: Sets face culling mode.

### Drawing
- `drawTriangles(indexBuffer:IndexBuffer3D, firstIndex:int = 0, numTriangles:int = -1): void`: Renders triangles.

**Example - Basic Rendering Setup**:

```as3
// Get Context3D from Stage3D
stage.stage3Ds[0].addEventListener(Event.CONTEXT3D_CREATE, onContext3DCreate);
stage.stage3Ds[0].requestContext3D();

function onContext3DCreate(event:Event):void {
    var context:Context3D = stage.stage3Ds[0].context3D;
    
    // Configure back buffer
    context.configureBackBuffer(800, 600, 0, true);
    
    // Clear to blue
    context.clear(0, 0, 1, 1);
    context.present();
}
```

## VertexBuffer3D

GPU buffer holding vertex data (positions, colors, UVs, normals).

**Methods**:
- `uploadFromVector(data:Vector.<Number>, startVertex:int, numVertices:int): void`: Uploads vertex data.
- `uploadFromByteArray(data:ByteArray, byteArrayOffset:int, startVertex:int, numVertices:int): void`: Uploads from ByteArray.
- `dispose(): void`: Releases GPU memory.

**Example**:

```as3
// Create triangle vertex data (x, y, z for each vertex)
var vertices:Vector.<Number> = Vector.<Number>([
    -0.5, -0.5, 0,  // vertex 0
     0.5, -0.5, 0,  // vertex 1
     0.0,  0.5, 0   // vertex 2
]);

var vertexBuffer:VertexBuffer3D = context.createVertexBuffer(3, 3); // 3 vertices, 3 floats each
vertexBuffer.uploadFromVector(vertices, 0, 3);

// Bind to vertex shader input
context.setVertexBufferAt(0, vertexBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
```

## IndexBuffer3D

GPU buffer holding triangle indices for indexed rendering.

**Methods**:
- `uploadFromVector(data:Vector.<uint>, startOffset:int, count:int): void`: Uploads index data.
- `uploadFromByteArray(data:ByteArray, byteArrayOffset:int, startOffset:int, count:int): void`: Uploads from ByteArray.
- `dispose(): void`: Releases GPU memory.

**Example**:

```as3
// Define triangles using vertex indices
var indices:Vector.<uint> = Vector.<uint>([
    0, 1, 2  // Triangle using vertices 0, 1, 2
]);

var indexBuffer:IndexBuffer3D = context.createIndexBuffer(3); // 3 indices
indexBuffer.uploadFromVector(indices, 0, 3);

// Draw triangles
context.drawTriangles(indexBuffer, 0, 1); // 1 triangle
```

## Program3D

Compiled shader program (vertex + fragment shaders).

**Methods**:
- `upload(vertexProgram:ByteArray, fragmentProgram:ByteArray): void`: Uploads compiled AGAL bytecode.
- `dispose(): void`: Releases GPU resources.

**Example - AGAL Shader**:

```as3
// Simple pass-through vertex shader and red fragment shader (AGAL assembly)
var vertexAssembly:AGALMiniAssembler = new AGALMiniAssembler();
vertexAssembly.assemble("vertex",
    "m44 op, va0, vc0\n" +  // output = vertex * matrix
    "mov v0, va1"            // pass color to fragment
);

var fragmentAssembly:AGALMiniAssembler = new AGALMiniAssembler();
fragmentAssembly.assemble("fragment",
    "mov oc, v0"  // output color = interpolated color
);

var program:Program3D = context.createProgram();
program.upload(vertexAssembly.agalcode, fragmentAssembly.agalcode);

context.setProgram(program);
```

## Context3D Constants

### Context3DProfile
- `BASELINE`: Minimum feature set.
- `BASELINE_CONSTRAINED`: Limited for older mobile devices.
- `BASELINE_EXTENDED`: Extended baseline.
- `STANDARD`: Standard desktop features.
- `STANDARD_CONSTRAINED`: Standard with constraints.
- `STANDARD_EXTENDED`: Full desktop features.

### Context3DBlendFactor
- `ZERO`, `ONE`
- `SOURCE_ALPHA`, `ONE_MINUS_SOURCE_ALPHA`
- `DESTINATION_ALPHA`, `ONE_MINUS_DESTINATION_ALPHA`
- `SOURCE_COLOR`, `DESTINATION_COLOR`

### Context3DCompareMode
- `NEVER`, `ALWAYS`
- `LESS`, `LESS_EQUAL`
- `EQUAL`, `NOT_EQUAL`
- `GREATER`, `GREATER_EQUAL`

### Context3DTriangleFace
- `NONE`: No culling.
- `FRONT`: Cull front faces.
- `BACK`: Cull back faces.
- `FRONT_AND_BACK`: Cull all faces.

### Context3DTextureFormat
- `BGRA`: 8-bit BGRA (most common).
- `COMPRESSED`: DXT1/PVRTC/ETC1 compression.
- `COMPRESSED_ALPHA`: DXT5/PVRTC with alpha.
- `BGR_PACKED`, `BGRA_PACKED`: 16-bit packed formats.

### Context3DVertexBufferFormat
- `BYTES_4`: 4 bytes.
- `FLOAT_1`, `FLOAT_2`, `FLOAT_3`, `FLOAT_4`: 1-4 floats.

### Context3DProgramType
- `VERTEX`: Vertex shader.
- `FRAGMENT`: Fragment (pixel) shader.

## Complete Rendering Example

```as3
var context:Context3D;
var vertexBuffer:VertexBuffer3D;
var indexBuffer:IndexBuffer3D;
var shaderProgram:Program3D;

// Initialize
function init():void {
    stage.stage3Ds[0].addEventListener(Event.CONTEXT3D_CREATE, onContextCreated);
    stage.stage3Ds[0].requestContext3D();
}

function onContextCreated(e:Event):void {
    context = stage.stage3Ds[0].context3D;
    context.configureBackBuffer(stage.stageWidth, stage.stageHeight, 2, true);
    context.enableErrorChecking = true; // Debug mode
    
    setupGeometry();
    setupShaders();
    
    addEventListener(Event.ENTER_FRAME, onRender);
}

function setupGeometry():void {
    // Triangle vertices: x, y, z, r, g, b, a
    var vertices:Vector.<Number> = Vector.<Number>([
        -0.5, -0.5, 0,  1, 0, 0, 1,  // red
         0.5, -0.5, 0,  0, 1, 0, 1,  // green
         0.0,  0.5, 0,  0, 0, 1, 1   // blue
    ]);
    
    vertexBuffer = context.createVertexBuffer(3, 7);
    vertexBuffer.uploadFromVector(vertices, 0, 3);
    
    var indices:Vector.<uint> = Vector.<uint>([0, 1, 2]);
    indexBuffer = context.createIndexBuffer(3);
    indexBuffer.uploadFromVector(indices, 0, 3);
}

function setupShaders():void {
    // Compile shaders
    var vertexShader:AGALMiniAssembler = new AGALMiniAssembler();
    vertexShader.assemble("vertex",
        "m44 op, va0, vc0\n" +  // transform position
        "mov v0, va1"            // pass color
    );
    
    var fragmentShader:AGALMiniAssembler = new AGALMiniAssembler();
    fragmentShader.assemble("fragment", "mov oc, v0");
    
    shaderProgram = context.createProgram();
    shaderProgram.upload(vertexShader.agalcode, fragmentShader.agalcode);
}

function onRender(e:Event):void {
    // Clear
    context.clear(0.2, 0.2, 0.2);
    
    // Set shader
    context.setProgram(shaderProgram);
    
    // Set projection matrix (identity for this example)
    var matrix:Matrix3D = new Matrix3D();
    context.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 0, matrix, true);
    
    // Bind vertex data
    context.setVertexBufferAt(0, vertexBuffer, 0, Context3DVertexBufferFormat.FLOAT_3); // position
    context.setVertexBufferAt(1, vertexBuffer, 3, Context3DVertexBufferFormat.FLOAT_4); // color
    
    // Draw
    context.drawTriangles(indexBuffer, 0, 1);
    
    // Present
    context.present();
}
```

## Best Practices

- Always call `dispose()` on buffers and textures when done
- Use `Context3DBufferUsage.DYNAMIC_DRAW` for frequently updated buffers
- Enable error checking during development, disable for production
- Batch draw calls to minimize state changes
- Use texture atlases to reduce texture binding
- Profile with Context3D telemetry tools
- Handle `Context3DEvent.CONTEXT3D_CREATE` for context loss recovery

## Performance Tips

- Minimize `setProgramConstantsFromMatrix/Vector` calls
- Reuse Program3D instances
- Use index buffers for shared vertices
- Pack vertex data tightly (interleaved format)
- Use mipmaps for textures viewed at different distances
- Prefer `STATIC_DRAW` for unchanging geometry
- Batch similar objects together

## See Also

- `flash.geom.Matrix3D` - 3D transformation matrices
- `flash.display3D.textures` - Texture classes
- `com.adobe.utils.AGALMiniAssembler` - Shader compiler (separate library)
- Stage3D documentation for AGAL shader language reference
