(() => {
  "use strict";

  const canvas = document.querySelector("#audio-visualizer");
  const canvasContext = canvas.getContext("2d");
  const audioElement = document.querySelector("#audio-player");
  const trackSelect = document.querySelector("#audio-track");
  const playButton = document.querySelector('[data-action="play"]');
  const pauseButton = document.querySelector('[data-action="pause"]');
  const statusMessage = document.querySelector(".visualizer__status");

  const FFT_SIZE = 512;
  const BASE_RADIUS = 0.28;
  const BAR_WIDTH = 3;
  const BAR_GAP = 3;
  const BAR_COLOR = "#00c3ff";

  let audioContext = null;
  let analyserNode = null;
  let frequencyData = null;
  let animationFrameId = null;

  function initializeAudioAnalysis() {
    if (audioContext) return;

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      throw new Error("This browser does not support the Web Audio API.");
    }

    audioContext = new AudioContextConstructor();
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = FFT_SIZE;
    analyserNode.smoothingTimeConstant = 0.72;

    const audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
  }

  function resizeCanvas() {
    const displaySize = Math.min(canvas.clientWidth, window.innerHeight * 0.65, 720);
    if (!displaySize) return;

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.round(displaySize * pixelRatio);
    canvas.height = Math.round(displaySize * pixelRatio);
    canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drawIdleState();
  }

  function drawIdleState() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;

    canvasContext.clearRect(0, 0, width, height);
    canvasContext.beginPath();
    canvasContext.arc(width / 2, height / 2, Math.min(width, height) * BASE_RADIUS, 0, Math.PI * 2);
    canvasContext.strokeStyle = "#1e293b";
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
  }

  function renderSpectrum() {
    if (!analyserNode || !frequencyData) return;

    analyserNode.getByteFrequencyData(frequencyData);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * BASE_RADIUS;
    const barCount = Math.min(frequencyData.length, Math.floor((Math.PI * 2 * radius) / (BAR_WIDTH + BAR_GAP)));

    canvasContext.clearRect(0, 0, width, height);
    canvasContext.save();
    canvasContext.translate(centerX, centerY);
    canvasContext.fillStyle = BAR_COLOR;
    canvasContext.shadowColor = BAR_COLOR;
    canvasContext.shadowBlur = 8;

    for (let index = 0; index < barCount; index += 1) {
      const angle = (index / barCount) * Math.PI * 2;
      const amplitude = frequencyData[index] / 255;
      const barHeight = 4 + amplitude * Math.min(width, height) * 0.18;

      canvasContext.save();
      canvasContext.rotate(angle);
      canvasContext.fillRect(-BAR_WIDTH / 2, -radius - barHeight, BAR_WIDTH, barHeight);
      canvasContext.restore();
    }

    canvasContext.restore();

    if (!audioElement.paused && !audioElement.ended) {
      animationFrameId = requestAnimationFrame(renderSpectrum);
    } else {
      animationFrameId = null;
    }
  }

  function updatePlaybackControls() {
    const isPlaying = !audioElement.paused && !audioElement.ended;
    playButton.disabled = isPlaying;
    pauseButton.disabled = !isPlaying;
  }

  async function playAudio() {
    try {
      initializeAudioAnalysis();

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      await audioElement.play();
      statusMessage.textContent = "Playing audio.";
      updatePlaybackControls();

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(renderSpectrum);
      }
    } catch (error) {
      console.error("Unable to play audio:", error);
      statusMessage.textContent = "Unable to play this track. Check that the audio file exists and is a supported format.";
      updatePlaybackControls();
    }
  }

  function pauseAudio() {
    audioElement.pause();
    statusMessage.textContent = "Playback paused.";
    updatePlaybackControls();
  }

  function changeTrack() {
    audioElement.pause();
    audioElement.src = trackSelect.value;
    audioElement.load();
    statusMessage.textContent = "Track selected. Press Play to start.";
    drawIdleState();
    updatePlaybackControls();
  }

  playButton.addEventListener("click", playAudio);
  pauseButton.addEventListener("click", pauseAudio);
  trackSelect.addEventListener("change", changeTrack);

  audioElement.addEventListener("play", updatePlaybackControls);
  audioElement.addEventListener("pause", updatePlaybackControls);
  audioElement.addEventListener("ended", () => {
    statusMessage.textContent = "Playback ended.";
    updatePlaybackControls();
    drawIdleState();
  });
  audioElement.addEventListener("error", () => {
    statusMessage.textContent = "The selected audio file could not be loaded. Verify the file path and format.";
    console.error("Audio loading failed:", audioElement.currentSrc, audioElement.error);
    updatePlaybackControls();
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  updatePlaybackControls();
})();