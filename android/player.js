/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var player;
var timerId;
var playerVars = {
  controls: 0,
  autoplay: 0,
  playsinline: 1,
  enablejsapi: 1,
  fs: 0,
  //origin: "https://bigzhu.github.io",
  origin: "https://www.youtube.com",
  rel: 0,
  showinfo: 0,
  iv_load_policy: 3,
  modestbranding: 1,
  cc_load_policy: getCCLoadPolicy(),
  cc_lang_pref: "en"
};

function getCCLoadPolicy() {
  var cc_load_policy = getParams(window.location.href)["cc_load_policy"];
  if (cc_load_policy) return parseInt(cc_load_policy);
  return 0;
}

function onYouTubeIframeAPIReady() {
  createPlayerByVars(playerVars);
}

function createPlayerByVars(playerVars) {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    host: "https://www.youtube.com",
    playerVars: playerVars,
    events: {
      onReady: function() {
        Ready.postMessage("Ready");
      },
      onStateChange: function(event) {
        sendPlayerStateChange(event.data);
      },
      onPlaybackQualityChange: function(event) {
        PlaybackQualityChange.postMessage(event.data);
      },
      onPlaybackRateChange: function(event) {
        PlaybackRateChange.postMessage(event.data);
      },
      onError: function(error) {
        Errors.postMessage(error.data);
      }
    }
  });
}

function hideAnnotations() {
  document.body.style.height = "1000%";
  document.body.style.width = "1000%";
  document.body.style.transform = "scale(0.1)";
  document.body.style.transformOrigin = "left top";
  document.documentElement.style.height = "1000%";
  document.documentElement.style.width = "1000%";
  document.documentElement.style.transform = "scale(0.1)";
  document.documentElement.style.transformOrigin = "left top";
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
    duration: player.getDuration(),
    videoUrl: player.getVideoUrl(),
    availableQualityLevels: player.getAvailableQualityLevels(),
    videoEmbedCode: player.getVideoEmbedCode()
  };
  VideoData.postMessage(JSON.stringify(videoData));
}

function startSendCurrentTimeInterval() {
  timerId = setInterval(function() {
    CurrentTime.postMessage(player.getCurrentTime());
    LoadedFraction.postMessage(player.getVideoLoadedFraction());
  }, 100);
}

function play() {
  player.playVideo();
  return "";
}

function pause() {
  player.pauseVideo();
  return "";
}

function loadById(id, startAt) {
  player.loadVideoById(id, startAt);
  return "";
}

function cueById(id, startAt) {
  player.cueVideoById(id, startAt);
  return "";
}

function mute() {
  player.mute();
  return "";
}

function unMute() {
  player.unMute();
  return "";
}

function setVolume(volume) {
  player.setVolume(volume);
  return "";
}

function seekTo(position, seekAhead) {
  player.seekTo(position, seekAhead);
  return "";
}

function setSize(width, height) {
  player.setSize(width, height);
  return "";
}

function setPlaybackRate(rate) {
  player.setPlaybackRate(rate);
  return "";
}
