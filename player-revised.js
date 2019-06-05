var player;
var timerId;
function onYouTubeIframeAPIReady(){
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'controls': 0,
            'autoplay': 0,
	        'enablejsapi': 1,
	        'fs': 0,
            'origin': 'https://sarbagyadhaubanjar.github.io',
	        'rel': 0,
	        'showinfo': 0,
	        'iv_load_policy': 3,
	        'modestbranding': 1,
	        'cc_load_policy': 0
          },
        events: {
            onReady: function (event) { Ready.postMessage("Ready") },
            onStateChange: function (event) { sendPlayerStateChange(event.data) },
            onPlaybackQualityChange: function (event) { PlaybackQualityChange.postMessage(event.data) },
            onPlaybackRateChange: function (event) { PlaybackRateChange.postMessage(event.data) },
            onError: function (error) { Errors.postMessage(error.data) }
        },
    });
}

function hideAnnotations() {
    document.body.style.height = '1000%';
    document.body.style.width = '1000%';
    document.body.style.transform = 'scale(0.1)';
    document.body.style.transformOrigin = 'left top';
}

function sendPlayerStateChange(playerState) {
    clearTimeout(timerId);
    StateChange.postMessage(playerState);
    if (playerState == 1) {
        startSendCurrentTimeInterval();
        sendVideoData(player);
    }
}

function sendVideoData(player) {
    var videoData = {
        'duration': player.getDuration(),
        'videoUrl': player.getVideoUrl(),
        'availableQualityLevels': player.getAvailableQualityLevels(),
        'videoEmbedCode': player.getVideoEmbedCode(),
    };
    VideoData.postMessage(JSON.stringify(videoData));
}

function startSendCurrentTimeInterval() {
    timerId = setInterval(function () {
        CurrentTime.postMessage(player.getCurrentTime());
        LoadedFraction.postMessage(player.getVideoLoadedFraction());
    }, 100);
}

function play() {
    player.playVideo();
    return '';
}

function pause() {
    player.pauseVideo();
    return '';
}

function loadById(id, startAt) {
    player.loadVideoById(id, startAt);
    return '';
}

function cueById(id, startAt) {
    player.cueVideoById(id, startAt);
    return '';
}

function mute() {
    player.mute();
    return '';
}

function unMute() {
    player.unmute();
    return '';
}

function setVolume(volume) {
    player.setVolume(volume);
    return '';
}

function seekTo(position, seekAhead) {
    player.seekTo(position, seekAhead);
    return '';
}
