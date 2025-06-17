# list files
list_videos () {
    VIDEO_DIR="/home/andrea/"
    ls -p $VIDEO_DIR | grep -E -v /$ | jq -R -s -c 'split("\n")[:-1]'
}

mpv_call() {
    #Wrapper
    #MPV_SOCKET="/tmp/mpv.socket"
    MPV_SOCKET="/tmp/test"
    echo "$*"  | socat -u - $MPV_SOCKET
}
mpv_play_pause() {
    mpv_call cycle pause
}
mpv_mute() {
    mpv_call cycle mute
}
mpv_vol_add() {
    mpv_call add volume $1
}
mpv_seek_percent() {
    mpv_call set percent-pos $1
}
mpv_get_info() {
    mpv_call '{"command": ["get_property", "filename"]},
              {"command": ["get_property", "duration"]},
              {"command": ["get_property", "time-pos"]},
              {"command": ["get_property", "core-idle"]},
              {"command": ["get_property", "volume"]},
             
             ' | jq -s '{filename: .[0].data,
                         duration: .[1].data,
                         position: .[2].data,
                         isPlaying: .[3].data,
                         volume: .[4].data'
}


http_reply() {
    printf "HTTP/1.1 200 OK\r\n"
    printf "Content-Type: $1\r\n"
    printf "Access-Control-Allow-Origin: *\r\n"
    printf "\r\n"
}

main() {
    read request
    case "$request" in
        *list-videos*) http_reply application/json; list_videos;;
        *get-video-props*) http_reply application/json; mpv_get_info;;
        *play*) http_reply; mpv_play_pause;;
        *poweroff*) poweroff;;
    esac
}

main
