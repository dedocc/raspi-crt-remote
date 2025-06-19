// play
// pause
// cycle play-pause
// mute
// unmute
// cycle mute
// loop inf
// unloop
// cycle loop
// seek

async function wsCall(cmd) {
    await window.wsReady;
    window.ws.send(JSON.stringify(cmd))
}

function mpvPlay() {
    wsCall("play");
}

function mpvPause() {
    wsCall("pause");
}

function mpvTogglePause() {
    wsCall("togglepause");
}

function mpvMute() {
    wsCall("mute");
}

function mpvUnmute() {
    wsCall("unmute");
}

function mpvToggleMute() {
    wsCall("togglemute");
}

function mpvLoopCurrent() {
    wsCall("loopcurrent");
}

function mpvUnloopCurrent() {
    wsCall("unloopcurrent");
}

function mpvToggleLoop() {
    wsCall("toggleloop");
}

function mpvSeek(percent) {
    wsCall({"command":"seek", "value":percent});
}

function mpvSetVolume(percent) {
    wsCall({"command":"setvolume", "value":percent});
    console.log(percent);
}

function mpvOpenVideo(filename) {
    wsCall({"command":"openvideo", "value":filename});
}

function poweroff() {
    wsCall("poweroff");
}

function getVideoList() {
    wsCall("getvideolist");
}
