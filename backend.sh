# list files
list_videos () {
    VIDEO_DIR="/home/andrea/Video"
    ls -p $VIDEO_DIR | grep -E -v /$ | jq -R -s -c 'split("\n")[:-1]'
}

mpv_call() {
    #Wrapper
    #MPV_SOCKET="/tmp/mpv.socket"
    MPV_SOCKET="/tmp/test"
    echo "$*"  | socat - $MPV_SOCKET
}
mpv_play_pause() {
    mpv_call cycle pause
}
mpv_mute() {
    mpv_call cycle mute
}

mpv_loop() {
    mpv_call cycle-values loop-file "inf" "no"
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
              {"command": ["get_property", "percent-pos"]},
              {"command": ["get_property", "remaining-file-loops"]}
             ' | jq -s '{filename: .[0].data,
                         duration: .[1].data,
                         position: .[2].data,
                         isPlaying: .[3].data,
                         volume: .[4].data,
                         percent: .[5].data,
                         loops: .[6].data}'
}


get_reply() {
    printf "HTTP/1.1 200 OK\r\n"
    printf "Content-Type: $1\r\n"
    printf "Access-Control-Allow-Origin: *\r\n"
    printf "\r\n"
}

parse_post() {
    content_length=0
    while read header && [ "$header" != $'\r' ]; do
    header=$(echo "$header" | tr -d '\r')        
        case "$header" in
            Content-Length:*) content_length=$(echo "$header" | cut -d' ' -f2);;
        esac
    done
    body=""
    if [ "$content_length" -gt 0 ]; then
        read -r -N "$content_length" body
    fi
    echo $body
    echo $body >&2
}

post_reply() {
    printf "HTTP/1.1 200 OK\r\n"
    printf "Access-Control-Allow-Origin: *\r\n"
    printf "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
    printf "Access-Control-Allow-Headers: Content-Type\r\n"
    printf "Content-Length: 0\r\n"
    printf "\r\n"
}

options_reply() {
  # This is for the preflight
  printf "HTTP/1.1 204 No Content\r\n"
  printf "Access-Control-Allow-Origin: *\r\n"
  printf "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
  printf "Access-Control-Allow-Headers: Content-Type\r\n"
  printf "Content-Length: 0\r\n"
  printf "\r\n"
}

main() {
    read request
    echo $request >&2
    case "$request" in
        *OPTIONS*) options_reply;;
        *list-videos*) get_reply application/json; list_videos;;
        *get-video-props*) get_reply application/json; mpv_get_info;;
        *play*) get_reply; mpv_play_pause;;
        *mute*) get_reply; mpv_mute;;
        *loop*) get_reply; mpv_loop;;
        *mpv-seek*) post_reply; mpv_call $(parse_post) ;;
        #*poweroff*) poweroff;;
    esac
}

main
