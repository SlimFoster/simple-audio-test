import { BufferLoader } from "./BufferLoader";

const context = new AudioContext();

new BufferLoader(context, ["bensound-ukulele.mp3"], finishedLoading).load();

function finishedLoading(bufferList: AudioBuffer[]) {
  window.addEventListener("mousedown", function () {
    // Create two sources and play them both together.
    const source1 = context.createBufferSource();
    source1.buffer = bufferList[0];

    source1.connect(context.destination);
    source1.start(0);
  });
}
