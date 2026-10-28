# Waveform

Waveform is a lightweight, browser-based audio visualization project featuring two real-time spectrum visualizers. Built with **HTML, CSS, JavaScript, the Canvas API, and the Web Audio API**, it runs without a framework, package manager, or build step.

## Visualizers

### Bar Spectrum
A horizontal spectrum analyzer with animated frequency bars, playback controls, and a track selector.

### Circular Spectrum
A radial frequency analyzer that draws audio-reactive bars around a circle.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/sachin-acharya-projects/waveform.git
   cd waveform
   ```

2. Start a local static server from the repository root:

   ```bash
   python -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) and choose a visualizer.

A local server is recommended so audio assets load consistently. No dependencies need to be installed.

## Project Structure

```text
waveform/
├── index.html                 # Waveform landing page
├── home.css                   # Landing page styles
├── bar-visualizer.html        # Bar spectrum page
├── bar-visualizer.css         # Bar spectrum styles
├── bar-visualizer.js          # Bar playback and rendering
├── circular-visualizer.html   # Circular spectrum page
├── circular-visualizer.css    # Circular spectrum styles
├── circular-visualizer.js     # Circular playback and rendering
└── audio/                     # Sample audio tracks
```

## How It Works

Both visualizers connect an HTML audio element to an `AnalyserNode` using the Web Audio API. They sample frequency data during playback and render it as animated CSS bars or with the Canvas 2D API.

Playback starts in response to a user action to comply with browser autoplay restrictions. The circular visualizer uses the media element directly rather than fetching and decoding a separate audio buffer.

## Troubleshooting

- **Audio does not play:** verify the selected file exists in `audio/` and start the project using a local HTTP server.
- **No animation:** use a modern browser with Web Audio API support and press Play.
- **Audio decode errors:** Waveform does not call `decodeAudioData()`; the browser loads supported formats through the audio element. A media error usually indicates a path, file-content, or format issue.

## Audio Assets

Sample tracks are included as local demo assets and may have separate copyright or licensing restrictions. Verify that you have permission to redistribute them before publishing or reusing them.

## License

The source code does not currently specify a license. Audio tracks may be subject to separate copyright and licensing terms.
