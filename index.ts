enum ActionHandlers {
  PLAY = "play",
  PAUSE = "pause",
  PREVIOUS_TRACK = "previoustrack",
  NEXT_TRACK = "nexttrack",
  SEEK_BACKWARD = "seekbackward",
  SEEK_FORWARD = "seekforward",
  SEEKTO = "seekto",
  STOP = "stop",
}

enum PlaybackStates {
  PLAYING = "playing",
  PAUSED = "paused",
}

export interface Artwork {
  src: string;
  sizes: string;
  type: "image/jpeg" | "image/png";
}

export interface MediaSessionMetadata {
  title: string;
  siteName: string;
  pageName?: string;
  artwork: Artwork[];
}

export class MediaSessionManager {
  private videoElement: HTMLVideoElement;
  private metadata: MediaSessionMetadata;

  private isLive = false;

  constructor(
    videoElement: HTMLVideoElement,
    metadata: MediaSessionMetadata,
    isLive?: boolean
  ) {
    if (!(videoElement instanceof HTMLVideoElement)) {
      throw new Error(
        "[MediaSessionManager] videoElement must be an HTMLVideoElement"
      );
    }
    if (
      !metadata ||
      !metadata.title ||
      !metadata.siteName ||
      !metadata.artwork
    ) {
      throw new Error("[MediaSessionManager] metadata must be provided");
    }

    this.videoElement = videoElement;
    this.metadata = metadata;
    this.isLive = isLive;
    this.setup();
  }

  private setup(): void {
    if ("mediaSession" in navigator) {
      this.setMetadata();
      this.setupEventListeners();
      this.setupStateReporter();
    }
  }

  private setMetadata(): void {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: this.metadata.title,
      artist: this.metadata.siteName,
      album: this.metadata.pageName || this.metadata.siteName,
      artwork: this.metadata.artwork,
    });
  }

  private setupEventListeners(): void {
    // Wrap all setActionHandler in try/catch, see: https://github.com/w3c/mediasession/issues/228?ts=2
    try {
      navigator.mediaSession.setActionHandler(ActionHandlers.PLAY, async () => {
        await this.videoElement.play();
        navigator.mediaSession.playbackState = PlaybackStates.PLAYING;
      });
    } catch (e) {
      // no-op
    }
    try {
      navigator.mediaSession.setActionHandler(ActionHandlers.PAUSE, () => {
        this.videoElement.pause();
        navigator.mediaSession.playbackState = PlaybackStates.PAUSED;
      });
    } catch (e) {
      // no-op
    }

    try {
      navigator.mediaSession.setActionHandler(
        ActionHandlers.SEEK_BACKWARD,
        () => {
          this.videoElement.currentTime -= 15;
        }
      );
    } catch (e) {
      // no-op
    }
    try {
      navigator.mediaSession.setActionHandler(
        ActionHandlers.SEEK_FORWARD,
        () => {
          this.videoElement.currentTime += 15;
        }
      );
    } catch (e) {
      // no-op
    }

    try {
      navigator.mediaSession.setActionHandler(
        ActionHandlers.SEEKTO,
        (details: MediaSessionActionDetails) => {
          this.videoElement.currentTime = details.seekTime;
        }
      );
    } catch (e) {
      // no-op
    }
  }

  private setupStateReporter(): void {
    if (navigator.mediaSession && navigator.mediaSession.setPositionState) {
      this.videoElement.addEventListener("timeupdate", () => {
        if (
          !this.isLive &&
          this.videoElement.duration > 0 &&
          this.videoElement.currentTime &&
          this.videoElement.currentTime <= this.videoElement.duration
        ) {
          navigator.mediaSession.setPositionState({
            duration: this.videoElement.duration,
            position: this.videoElement.currentTime,
          });
        }
      });
    }
  }
}
