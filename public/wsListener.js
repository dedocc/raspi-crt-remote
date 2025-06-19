window.ws = new WebSocket(`ws://${location.hostname}:8082`);

window.wsReady = new Promise(resolve => {
  window.ws.addEventListener('open', resolve, { once: true });
});


window.mpvProps = {};
window.mpvPropsReady = new Promise((resolve) => {
  // Internal flag so you resolve only once
  let resolved = false;

  window.ws.onmessage = (event) => {
    event.data.split('\n').forEach((line) => {
      if (line !== '') {
        const msg = JSON.parse(line);
        if (msg.event === "property-change") {
            window.mpvProps[msg.name] = msg.data;
          // Resolve the Promise the first time filename arrives
            if (msg.name === "filename" && !resolved) {
              resolved = true;
              resolve(window.mpvProps);
            }
            document.dispatchEvent(new CustomEvent("mpv-update", { detail: msg }));
        } else if (msg.event === "videolist") {
            document.dispatchEvent(new CustomEvent("videolist", { detail: msg.list }));
        }
      }
    });
  };
});
