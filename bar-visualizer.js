(() => {
  "use strict";

  const audioElement = document.querySelector(".audio-player");
  const trackSelect = document.querySelector("#track-select");
  const barsContainer = document.querySelector(".spectrum__bars");
  const playButton = document.querySelector('[data-action="play"]');
  const pauseButton = document.querySelector('[data-action="pause"]');

  const BAR_COUNT = 55;
  const MAX_BAR_HEIGHT = 100;
  const FREQUENCY_SCALE = 180;

  let audioContext = null;
  let analyserNode = null;
  let frequencyData = null;
  let animationFrameId = null;

  function createSpectrumBars() {
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < BAR_COUNT; index += 1) {
      const track = document.createElement("div");
      track.className = "spectrum__bar-track";

      const bar = document.createElement("div");
      bar.className = "spectrum__bar";
      bar.style.height = "4px";

      track.append(bar);
      fragment.append(track);
    }

    barsContainer.append(fragment);
  }

  function initializeAudioAnalysis() {
    if (audioContext) return;

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      throw new Error("This browser does not support the Web Audio API.");
    }

    audioContext = new AudioContextConstructor();
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.78;

    const audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
  }

  function renderSpectrum() {
    if (!analyserNode || !frequencyData) return;

    analyserNode.getByteFrequencyData(frequencyData);
    const bars = barsContainer.children;

    for (let index = 0; index < BAR_COUNT; index += 1) {
      const frequencyValue = frequencyData[index] || 0;
      const barHeight = Math.max(2, (frequencyValue / FREQUENCY_SCALE) * MAX_BAR_HEIGHT);
      bars[index].firstElementChild.style.height = `${Math.min(MAX_BAR_HEIGHT, barHeight)}%`;
    }

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
      updatePlaybackControls();

      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(renderSpectrum);
      }
    } catch (error) {
      console.error("Unable to play audio:", error);
      updatePlaybackControls();
    }
  }

  function pauseAudio() {
    audioElement.pause();
    updatePlaybackControls();
  }

  function changeTrack() {
    audioElement.pause();
    audioElement.src = trackSelect.value;
    audioElement.load();
    updatePlaybackControls();
    playAudio();
  }

  playButton.addEventListener("click", playAudio);
  pauseButton.addEventListener("click", pauseAudio);
  trackSelect.addEventListener("change", changeTrack);

  audioElement.addEventListener("play", updatePlaybackControls);
  audioElement.addEventListener("pause", updatePlaybackControls);
  audioElement.addEventListener("ended", updatePlaybackControls);
  audioElement.addEventListener("error", () => {
    console.error("Unable to load the selected audio track:", audioElement.currentSrc);
  });

  createSpectrumBars();
  updatePlaybackControls();
})();