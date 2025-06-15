# list files
list_videos () {
    VIDEO_DIR="/home/andrea/"
    ls -p $VIDEO_DIR | egrep -v /$ | jq -R -s -c 'split("\n")[:-1]'
}

# mpv commands

http_reply() {
    echo -e "HTTP/1.1 200 OK\r"
    echo -e "Content-Type: $1\r"
    echo -e "Access-Control-Allow-Origin: *\r"
    echo -e "\r"
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
