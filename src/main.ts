import { BufferLoader } from "./BufferLoader";

const context = new AudioContext();

BufferLoader.load(context, ["bensound-ukulele.mp3"]).then((bufferList) => {
  let startPlaying: () => void;
  startPlaying = () => {
    // Create two sources and play them both together.
    const source1 = context.createBufferSource();
    source1.buffer = bufferList[0];

    source1.connect(context.destination);
    source1.start(0);

    window.removeEventListener("mousedown", startPlaying);
    window.removeEventListener("keydown", startPlaying);
  };
  window.addEventListener("mousedown", startPlaying);
  window.addEventListener("keydown", startPlaying);
});
