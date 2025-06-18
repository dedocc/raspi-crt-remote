import { WebSocketServer } from 'ws';
import net from 'net';

const mpvSocketPath = '/tmp/test';
const wss = new WebSocketServer({port: 8082});
console.log("started");

wss.on('connection', ws => {
    console.log("connected");
    const mpv = net.createConnection(mpvSocketPath);
    // file name, duration, position, volume, ismute, isloop
    const props = ["filename", "duration", "percent-pos", "time-pos", "pause",
                   "volume", "mute", "remaining-file-loops"];
    props.forEach((prop, i) => {
         mpv.write(JSON.stringify({ "command": ["observe_property", i+1, prop] }) + "\n");
     });

    mpv.on('data', chunk => {
        ws.send(chunk.toString());
    });

    ws.on('close', () => {
        mpv.end();
    });
});
