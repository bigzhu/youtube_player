var player;
var timerId;
function initYoutubePlayer(params) {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: params,
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
    document.body.style.transform = scale(0.1);
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

function unmute() {
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
