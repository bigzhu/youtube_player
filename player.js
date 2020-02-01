var player;
var timerId;
var playerVars = {
  controls: 0,
  autoplay: 0,
  playsinline: 1,
  enablejsapi: 1,
  fs: 0,
  origin: "https://bigzhu.github.io",
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
/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function(url) {
  var params = {};
  var parser = document.createElement("a");
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
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
