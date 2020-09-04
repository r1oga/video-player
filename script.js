const [
  video,
  progressRange,
  progressBar,
  volumeRange,
  volumeBar,
  currentTime,
  duration,
  fullscreenBtn,
  playerSpeed,
  player
] = [
  'video',
  '.progress-range',
  '.progress-bar',
  '.volume-range',
  '.volume-bar',
  '.time-elapsed',
  '.time-duration',
  '.fullscreen',
  '.player-speed',
  '.player'
].map(query => document.querySelector(query))
const [playBtn, volumeIcon] = ['play-btn', 'volume-icon'].map(id =>
  document.getElementById(id)
)

// Play & Pause ----------------------------------- //
const showPlayIcon = () => {
  playBtn.classList.replace('fa-pause', 'fa-play')
  playBtn.setAttribute('title', 'Play')
}

const togglePlay = () => {
  if (video.paused) {
    video.play()
    playBtn.classList.replace('fa-play', 'fa-pause')
    playBtn.setAttribute('title', 'Pause')
  } else {
    video.pause()
    showPlayIcon()
  }
}

video.addEventListener('ended', showPlayIcon)
playBtn.addEventListener('click', togglePlay)
video.addEventListener('click', togglePlay)

// Progress Bar ---------------------------------- //
const formatTime = t => {
  const minutes = Math.floor(t / 60)
  let seconds = Math.floor(t % 60)
  seconds = seconds < 10 ? `0${seconds}` : seconds
  return `${minutes}:${seconds}`
}

const updateProgress = () => {
  progressBar.style.width = `${(100 * video.currentTime) / video.duration}%`
  currentTime.textContent = formatTime(video.currentTime)
}

const setProgress = event => {
  const ratio = event.offsetX / progressRange.offsetWidth
  progressBar.style.width = `${100 * ratio}%`
  video.currentTime = ratio * video.duration
}

video.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(video.duration)
})
video.addEventListener('timeupdate', updateProgress)
video.addEventListener('canplay', updateProgress)
progressRange.addEventListener('click', setProgress)

// Volume Controls --------------------------- //
let vol = 1
const changeVolume = volume => {
  vol = video.volume
  if (volume < 0.1) {
    volume = 0
  }
  if (volume > 0.9) {
    volume = 1
  }

  volumeBar.style.width = `${100 * volume}%`
  video.volume = volume
  volumeIcon.className = ''
  if (volume >= 0.6) {
    volumeIcon.classList.add('fas', 'fa-volume-up')
  } else if (volume < 0.6 && volume > 0) {
    volumeIcon.classList.add('fas', 'fa-volume-down')
  } else if (volume === 0) {
    volumeIcon.classList.add('fas', 'fa-volume-mute')
  }
}

const toggleVolume = () =>
  video.volume !== 0 ? changeVolume(0) : changeVolume(vol)

volumeRange.addEventListener('click', event =>
  changeVolume(event.offsetX / volumeRange.offsetWidth)
)
volumeIcon.addEventListener('click', toggleVolume)

// Change Playback Speed -------------------- //
const changePlayerSpeed = ({ target: { value } }) => {
  video.playbackRate = value
}
playerSpeed.addEventListener('change', changePlayerSpeed)
// Fullscreen ------------------------------- //
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen()
  }
}

let fullscreen = false
const toggleFullscreen = () => {
  if (fullscreen) {
    closeFullscreen()
    fullscreenBtn.children[0].classList.replace('fa-compress', 'fa-expand')
    fullscreen = false
  } else {
    openFullscreen(player)
    fullscreenBtn.children[0].classList.replace('fa-expand', 'fa-compress')
    fullscreen = true
  }
}

fullscreenBtn.addEventListener('click', toggleFullscreen)
