Media Session Manager
===

A small package to apply data as well as initiate handlers for the [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession) implemented by most browsers on both desktop and mobile to visualize content playing.

![media session manager visualisation](https://web-dev.imgix.net/image/admin/qwTz64KKq4rq7WeA3rlT.jpg?auto=format&w=1600)

## Simple Usage

```js
import { MediaSessionManager } from "@eyevinn/media-session-manager";

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
```

## About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in the sense that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This gives us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
