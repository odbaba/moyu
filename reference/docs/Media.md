# flash.media

Core multimedia support for audio and video playback and capture.

## Audio

### Sound

The primary class for loading and playing audio (MP3).

- **Methods**:
  - `load(stream: URLRequest, context: SoundLoaderContext = null): void`: Loads external MP3.
  - `play(startTime: Number = 0, loops: int = 0, sndTransform: SoundTransform = null): SoundChannel`: Starts playback.
  - `extract(target: ByteArray, length: Number, startPosition: Number = -1): Number`: Extracts raw PCM data.
  - `close(): void`: Stops loading.
- **Events**:
  - `SampleDataEvent.SAMPLE_DATA`: Dispatched when the sound needs data for dynamic generation.
  - `ID3Event.ID3`: Dispatched when ID3 metadata is available.
- **Properties**: `bytesLoaded`, `bytesTotal`, `isBuffering`, `length` (ms), `url`, `id3` (`ID3Info`).

### SoundChannel

Returned by `Sound.play()`. Controls an active sound instance.

- **Methods**: `stop(): void`
- **Properties**:
  - `position: Number`: Current playback position (ms).
  - `soundTransform: SoundTransform`: Volume/pan control for this channel.
  - `leftPeak / rightPeak: Number`: Amplitude (0 to 1).
- **Events**: `Event.SOUND_COMPLETE`: Dispatched when the sound finishes.

### SoundTransform

Controls volume and multi-channel routing.

- **Properties**:
  - `volume: Number`: (0 to 1).
  - `pan: Number`: (-1 left, 1 right).
  - `leftToLeft`, `leftToRight`, `rightToLeft`, `rightToRight`: Fine-grained channel routing.

### SoundMixer

Static class for global audio control.

- **Methods**:
  - `stopAll(): void`: Stops every sound currently playing.
  - `computeSpectrum(outputArray: ByteArray, FFTMode: Boolean = false, stretchFactor: int = 0): void`: Takes a snapshot of current frequencies/waveforms.
- **Properties**:
  - `soundTransform: SoundTransform`: Global volume and pan.
  - `bufferTime: int`: Preload time for streaming sounds.
  - `audioPlaybackMode: String`: "media" or "voice" (optimized for mobile).

---

## Video & Camera

### Video

A display object (`DisplayObject`) that renders video from a `NetStream` or `Camera`.

- **Methods**:
  - `attachNetStream(netStream: NetStream): void`: Connects to a network stream.
  - `attachCamera(camera: Camera): void`: Connects to a local camera.
  - `clear(): void`: Clears the current frame.
- **Properties**:
  - `deblocking: int`: Filter level for compression artifacts.
  - `smoothing: Boolean`: Enables mipmapping/interpolation for better quality.
  - `videoWidth / videoHeight: int`: Intrinsic dimensions of the source.

### Camera

Static access to local camera hardware.

- **Static Methods**:
  - `getCamera(name: String = null): Camera`: Returns the camera instance.
- **Methods**:
  - `setMode(width: int, height: int, fps: Number, favorArea: Boolean = true): void`: Sets capture resolution and rate.
  - `setQuality(bandwidth: int, quality: int): void`: Balances bandwidth vs visual quality.
  - `setKeyFrameInterval(keyframeInterval: int): void`: Keyframe density.
- **Properties**:
  - `activityLevel: Number`: Motion level (0-100).
  - `muted: Boolean`: Whether the user denied access.
  - `currentFPS: Number`: Actual capture rate.
  - `position: String`: "front" or "back" (mobile).

---

## Microphone

Static access to audio input hardware.

- **Static Methods**:
  - `getMicrophone(index: int = -1): Microphone`: Basic microphone.
  - `getEnhancedMicrophone(index: int = -1): Microphone`: Microphone with Acoustic Echo Cancellation (AEC).
- **Methods**:
  - `setSilenceLevel(silenceLevel: Number, timeout: int = -1): void`: Threshold for activity detection.
  - `setUseEchoSuppression(useEchoSuppression: Boolean): void`: (Basic AEC).
  - `setLoopBack(state: Boolean = true): void`: Routes input directly to local output (Danger: Feedback).
- **Properties**:
  - `codec: String`: "Speex" (constant) or "Nellymoser".
  - `encodeQuality: int`: (0-10) for Speex.
  - `gain: Number`: Input multiplier.
  - `rate: int`: Sample rate (kHz).
  - `noiseSuppressionLevel: int`: Speex specific.
