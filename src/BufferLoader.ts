export class BufferLoader {
  context: AudioContext;
  urlList: string[];
  onload: (bufferList: AudioBuffer[]) => void;
  bufferList: AudioBuffer[];
  loadCount: number;

  constructor(context: AudioContext, urlList: string[], callback: (buffer: AudioBuffer[]) => void) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }

  loadBuffer(url: string, index: number) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function () {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function (buffer) {
          if (!buffer) {
            alert("error decoding file data: " + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function (error) {
          console.error("decodeAudioData error", error);
        }
      );
    };

    request.onerror = function () {
      alert("BufferLoader: XHR error");
    };

    request.send();
  }

  public load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
  };
}