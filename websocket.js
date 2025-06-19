const { WebSocketServer } = require('ws');
const net = require('net');
const fs = require('fs');
const { exec } = require("child_process");


const videosPath = '/home/andrea/Video';
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

    ws.on('message', msg => {
        const parsed = JSON.parse(msg.toString());
        //console.log(parsed);
        if (typeof parsed === 'string') {
            switch (parsed) {
                case "play":
                    mpv.write(JSON.stringify({ "command": ["set_property", "pause", false] }) + "\n");
                    break;
                case "pause":
                    mpv.write(JSON.stringify({ "command": ["set_property", "pause", true] }) + "\n");
                    break;
                case "togglepause":
                    mpv.write(JSON.stringify({ "command": ["cycle", "pause"] }) + "\n");
                    break;
                case "mute":
                    mpv.write(JSON.stringify({ "command": ["set_property", "mute", true] }) + "\n");
                    break;
                case "unmute":
                    mpv.write(JSON.stringify({ "command": ["set_property", "mute", false] }) + "\n");
                    break;
                case "togglemute":
                    mpv.write(JSON.stringify({ "command": ["cycle", "mute"] }) + "\n");
                    break;
                case "loopcurrent":
                    mpv.write(JSON.stringify({ "command": ["set_property", "loop", "inf"] }) + "\n");
                    break;
                case "unloopcurrent":
                    mpv.write(JSON.stringify({ "command": ["set_property", "loop", "no"] }) + "\n");
                    break;
                case "toggleloop":
                    mpv.write(JSON.stringify({ "command": ["cycle-values", "loop", "inf", "no"] }) + "\n");
                    break;
                case "getvideolist":
                    const dirents = fs.readdirSync(videosPath, {withFileTypes: true});
                    const filenames = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
                    ws.send(JSON.stringify({ "event" :"videolist", "list":filenames}));
                    break;
                case "poweroff":
                    console.log("The system would have correctly powered off");
                    exec("beep");
                    break;
            }
        } else {
            switch (parsed.command) {
                case "seek":
                    mpv.write(JSON.stringify({"command": ["set_property", "percent-pos", parsed.value]})+"\n");
                    break;
                case "setvolume":
                    mpv.write(JSON.stringify({"command": ["set_property", "volume", parsed.value]})+"\n");
                    break;
                case "openvideo":
                    mpv.write(JSON.stringify({"command": ["loadfile", `${videosPath}/${parsed.value}`]})+"\n");
            }
        }
    });

    ws.on('close', () => {
        mpv.end();
    });
});
