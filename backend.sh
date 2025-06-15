# list files
list_videos () {
    VIDEO_DIR="/home/andrea/"
    ls -p $VIDEO_DIR | grep -E -v /$ | jq -R -s -c 'split("\n")[:-1]'
}

# mpv commands

http_reply() {
    printf "HTTP/1.1 200 OK\r\n"
    printf "Content-Type: $1\r\n"
    printf "Access-Control-Allow-Origin: *\r\n"
    printf "\r\n"
}

main() {
    read request
    #if [[ "$request" == *"list-videos"* ]]; then
    #    http_reply application/json
    #    list_videos
    #fi
    case "$request" in
        *list-videos*) http_reply application/json; list_videos;;
        *play*) http_reply text/plain; echo play;;
    esac
}

main
