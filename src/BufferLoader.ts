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

  public static load(context: AudioContext, urlList: string[]) {
    return new Promise<AudioBuffer[]>((resolve, reject) => {
      new BufferLoader(context, urlList, resolve).doLoad(reject);
    });
  }

  private doLoad (reject: (reason?: any) => void) {
    for (let i = 0; i < this.urlList.length; i++) {
      const url = this.urlList[i];

      // Load buffer asynchronously
      const request = new XMLHttpRequest();
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
            this.bufferList[i] = buffer;
            if (++this.loadCount == this.urlList.length)
              this.onload(this.bufferList);
          },
          (error) => {
            reject("decodeAudioData error: " + error);
          }
        );
      };

      request.onerror = () => {
        reject("XHR error loading url: " + url);
      };

      request.send();
    }
  };
}
