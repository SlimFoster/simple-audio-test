export class BufferLoader {
  private context: AudioContext;
  private urlList: string[];
  private resolve: (bufferList: AudioBuffer[]) => void;
  private reject: (reason?: any) => void;
  private bufferList: AudioBuffer[];
  private loadCount: number;

  constructor(
    context: AudioContext,
    urlList: string[],
    resolve: (buffer: AudioBuffer[]) => void,
    reject: (reason?: any) => void
  ) {
    this.context = context;
    this.urlList = urlList;
    this.resolve = resolve;
    this.reject = reject;
    this.bufferList = new Array();
    this.loadCount = 0;

    this.doLoad();
  }

  public static load(context: AudioContext, urlList: string[]) {
    return new Promise<AudioBuffer[]>((resolve, reject) => {
      new BufferLoader(context, urlList, resolve, reject);
    });
  }

  private doLoad() {
    for (let i = 0; i < this.urlList.length; i++) {
      this.loadBuffer(this.urlList[i], i);
    }
  }

  private loadBuffer(url: string, index: number) {
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
            this.reject("error decoding file data: " + url);
            return;
          }
          this.bufferList[index] = buffer;
          if (++this.loadCount == this.urlList.length)
            this.resolve(this.bufferList);
        },
        (error) => {
          this.reject("decodeAudioData error: " + error);
        }
      );
    };

    request.onerror = () => {
      this.reject("BufferLoader: XHR error loading " + url);
    };

    request.send();
  }
}
