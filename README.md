# AudioSpectrumJS

AudioSpectrumJS is a small browser-based audio visualization project. It includes two visualizers built with **HTML, CSS, JavaScript, the Canvas API, and the Web Audio API**—no framework, package manager, or build step required.

## Visualizers

### Bar Spectrum

A horizontal spectrum analyzer with animated frequency bars, playback controls, and a track selector.

### Circular Spectrum

A radial frequency analyzer that draws audio-reactive bars around a circle. It uses the browser's audio element and Web Audio API analyser node for playback and analysis.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/sachin-acharya-projects/AudioSpectrumJS.git
   cd AudioSpectrumJS
   ```

2. Start a local static server from the repository root:

   ```bash
   python -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) and choose a visualizer.

A local server is recommended so audio assets load consistently. The project has no dependencies to install.

## Project Structure

```text
AudioSpectrumJS/
├── index.html                 # Visualizer selection page
├── home.css                   # Selection page styles
├── bar-visualizer.html        # Bar analyzer page
├── bar-visualizer.css         # Bar analyzer styles
├── bar-visualizer.js          # Bar analyzer playback and rendering
├── circular-visualizer.html   # Circular analyzer page
├── circular-visualizer.css    # Circular analyzer styles
├── circular-visualizer.js     # Circular analyzer playback and rendering
└── audio/                     # Sample audio tracks
```

## How It Works

Both visualizers connect an HTML audio element to an `AnalyserNode` using the Web Audio API. Frequency data is sampled repeatedly and rendered using CSS bars or the Canvas 2D API.

Playback starts in response to a user action to comply with browser autoplay restrictions. The circular visualizer uses the media element directly rather than fetching and decoding a separate audio buffer.

## Troubleshooting

- **Audio does not play:** verify the selected file exists in `audio/` and start the project using a local HTTP server.
- **No animation:** use a modern browser with Web Audio API support and press Play.
- **Audio decode errors:** the visualizers do not call `decodeAudioData()`; the browser loads supported audio formats through the audio element. A media error usually means the file path, file contents, or format needs checking.

## Audio assets

The sample tracks are included as local demo assets and may have separate copyright or licensing restrictions. Verify that you have permission to redistribute them before publishing or reusing them.

## License

The source code does not currently specify a license. Audio tracks may be subject to separate copyright and licensing terms.