export class BufferLoader {
  private context: AudioContext;
  private urlList: string[];
  private onload: (bufferList: AudioBuffer[]) => void;
  private bufferList: AudioBuffer[];
  private loadCount: number;

  constructor(
    context: AudioContext,
    urlList: string[],
    callback: (buffer: AudioBuffer[]) => void
  ) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }

  private loadBuffer(url: string, index: number) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      // Asynchronously decode the audio file data in request.response
      this.context.decodeAudioData(
        request.response,
        (buffer) => {
          if (!buffer) {
            alert("error decoding file data: " + url);
            return;
          }
          this.bufferList[index] = buffer;
          if (++this.loadCount == this.urlList.length)
            this.onload(this.bufferList);
        },
        (error) => {
          console.error("decodeAudioData error", error);
        }
      );
    };

    request.onerror = () => {
      alert("BufferLoader: XHR error");
    };

    request.send();
  }

  public load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
  };
}
