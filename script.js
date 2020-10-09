const clip = document.getElementById('ytplayer');
const container = document.querySelector('.show-controls')
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const speed = document.querySelector('.player-speed');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const searchField = document.querySelector('.search-bar')
const searchBtn = document.querySelector('.search-button')
const counterEntries = document.querySelector('.counter');

var count = 1

function onYouTubeIframeAPIReady() {
  ytplayer = new YT.Player('ytplayer', {
    videoId: 'AfIOBLr1NDU',
    playerVars: {
      modestbranding: 1,
      playlistId: 'AfIOBLr1NDU',
      controls: 0,
      autoplay: 1,
      loop: 1,
      showinfo: 0,
      loop: 1
    },
    events: {
      onReady: initialize,
      onStateChange: onStateChangeAction
    }
  });
}

function initialize(){
  updateTimerDisplay();
  updateProgressBar();
  clearInterval(time_update_interval);
  var time_update_interval = setInterval(function () {
    updateTimerDisplay();
    updateProgressBar(); 
  }, 1000)
}

function onStateChangeAction(){
  repeat()
  iconChange()
}

function repeat() {
  if (ytplayer.getPlayerState() === 0) {
    ytplayer.playVideo();
    counterEntries.textContent = count++;
  }
}

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match&&match[7].length==11){
    var b=match[7];
  return b;
  } 
}

function search() {
  var videoId = youtube_parser(searchField.value)
  ytplayer.loadVideoById(videoId)
}

function updateTimerDisplay(){
  currentTime.innerHTML = `${displayTime(ytplayer.getCurrentTime())} /`
  duration.innerHTML = `${displayTime( ytplayer.getDuration())}`;
}

function iconChange(){
  if (ytplayer.getPlayerState() === 1) {
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
  } else if (ytplayer.getPlayerState() === 2) { 
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
  }
}

function togglePlay() {
  if (ytplayer.getPlayerState() === 2) {
    console.log('acum am dat play')
    ytplayer.playVideo();
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
  } 
  else if (ytplayer.getPlayerState() === 1) { 
    console.log('acum am data pauza')
    ytplayer.pauseVideo();
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
  }
}

function displayTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateProgressBar() {
  progressBar.style.width = `${(ytplayer.getCurrentTime() /ytplayer.getDuration()) * 100}%`;
  currentTime.textContent = `${displayTime(ytplayer.getCurrentTime())} /`;
  duration.textContent = `${displayTime(ytplayer.getDuration())}`;
}

function setProgress(e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  const timePoint = newTime * ytplayer.getDuration()
  ytplayer.seekTo(timePoint, true)
  progressBar.style.width = `${newTime * 1}%`;
}

function toggleMute() {
  volumeIcon.className = '';
  if (!ytplayer.isMuted()) {
    ytplayer.getVolume();
    ytplayer.mute();
    volumeIcon.classList.add('fas', 'fa-volume-mute');
    volumeIcon.setAttribute('title', 'Unmute');
    volumeBar.style.width = 0;
  } else {
    volumeIcon.classList.add('fas', 'fa-volume-up');
    volumeIcon.setAttribute('title', 'Mute');
    ytplayer.unMute()
    volumeBar.style.width = `${ytplayer.getVolume() * 1}%`;
  }
}

function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  if (volume < 0.1) {
    ytplayer.setVolume(0);
  }
  else if (volume > 0.9) {
    ytplayer.setVolume(100);
  }
  else if (volume < 0.9 && volume > 0.1) {
    ytplayer.setVolume(volume * 100)
  }
  volumeBar.style.width = `${volume * 100}%`;
  volumeIcon.className = '';
  if (volume > 0.6) {
    volumeIcon.classList.add('fas', 'fa-volume-up');
  } else if (volume < 0.7 && volume > 0) {
    volumeIcon.classList.add('fas', 'fa-volume-down');
  } else if (volume === 0) {
    volumeIcon.classList.add('fas', 'fa-volume-off');
  }
}

function changeSpeed() {
  clip.playbackRate = speed.value;
  if (clip.playbackRate === 0.5) {
    ytplayer.setPlaybackRate(0.5)
  }
  if (clip.playbackRate === 0.75) {
    ytplayer.setPlaybackRate(0.75)
  }
  if (clip.playbackRate === 1) {
    ytplayer.setPlaybackRate(1)
  }
  if (clip.playbackRate === 1.5) {
    ytplayer.setPlaybackRate(1.5)
  }
  if (clip.playbackRate === 2) {
    ytplayer.setPlaybackRate(2)
  }
  if (clip.playbackRate === 1.25) {
    ytplayer.setPlaybackRate(1.25)
  }
}

playBtn.addEventListener('click', togglePlay);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
searchBtn.addEventListener('click', search)
