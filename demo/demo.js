import { MediaSessionManager } from "../index.ts";

document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.querySelector("video");

  const metadata = {
    title: "Demo Video",
    siteName: "Eyevinn Demo Site",
    artwork: [
      {
        src: "https://via.placeholder.com/512?text=Eyevinn",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
  new MediaSessionManager(videoElement, metadata);
});
