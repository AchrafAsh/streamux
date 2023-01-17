## Happy path

1. Visit `https://streamux.achrafash.com/` on smartphone
2. It should ask permission to access my camera
3. Visiting `/{stream}` should show me the camera stream in fullscreen (fit)
4. Register the URL as a browser source in my streaming platform (OBS or Twitch Studio)
5. Just leave the page from my phone to stop the streaming

## Stack

- Server: Deno + Express + Socketio
- Front: SolidJS