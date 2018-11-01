var app = new Vue({
	el: "#app",
	data: {
		audio: "",
		imgLoaded: false,
		currentlyPlaying: false,
		currentlyStopped: false,
		currentTime: 0,
		checkingCurrentPositionInTrack: "",
		trackDuration: 0,
		currentProgressBar: 0,
		isPlaylistActive: false,
		currentSong: 0,
		debug: false,
		musicPlaylist: [
		{
			title: "Edie's Dream",
			artist: "Suuns",
			url: "mp3/ediesdream.mp3",
			image: "mp3/img/suuns.jpg",
			duration: "4.20" },
		{
			title: "Redbone",
			artist: "Childish Gambino",
			url: "mp3/redbone.mp3",
			image: "mp3/img/redbone.jpg",
			duration: "5.27" },

		{
			title: "In Dreams",
			artist: "tomemitsu",
			url: "mp3/indreams.mp3",
			image: "mp3/img/indreams.jpg",
			duration: "4.06" },

		{
			title: "QACHINA",
			artist: "Damien Jurado",
			url: "mp3/QACHINA.mp3",
			image: "mp3/img/qachina.jpg",
			duration: "3.48" },

		{
			title: "SICKO MODE",
			artist: "Travis Scott",
			url: "mp3/sickomode.mp3",
			image: "mp3/img/sickomode.jpg",
			duration: "5.14" }],


		audioFile: "" },

	mounted: function mounted() {
		this.changeSong();
		this.audio.loop = false;
	},
	filters: {
		fancyTimeFormat: function fancyTimeFormat(s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
		} },

	methods: {
		togglePlaylist: function togglePlaylist() {
			this.isPlaylistActive = !this.isPlaylistActive;
		},
		nextSong: function nextSong() {
			if (this.currentSong < this.musicPlaylist.length - 1)
			this.changeSong(this.currentSong + 1);
		},
		prevSong: function prevSong() {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		changeSong: function changeSong(index) {
			var wasPlaying = this.currentlyPlaying;
			this.imageLoaded = false;
			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}
			this.audioFile = this.musicPlaylist[this.currentSong].url;
			this.audio = new Audio(this.audioFile);
			var localThis = this;
			this.audio.addEventListener("loadedmetadata", function () {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener("ended", this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},
		isCurrentSong: function isCurrentSong(index) {
			if (this.currentSong == index) {
				return true;
			}
			return false;
		},
		getCurrentSong: function getCurrentSong(currentSong) {
			return this.musicPlaylist[currentSong].url;
		},
		playAudio: function playAudio() {
			if (
			this.currentlyStopped == true &&
			this.currentSong + 1 == this.musicPlaylist.length)
			{
				this.currentSong = 0;
				this.changeSong();
			}
			if (!this.currentlyPlaying) {
				this.getCurrentTimeEverySecond(true);
				this.currentlyPlaying = true;
				this.audio.play();
			} else {
				this.stopAudio();
			}
			this.currentlyStopped = false;
		},
		stopAudio: function stopAudio() {
			this.audio.pause();
			this.currentlyPlaying = false;
			this.pausedMusic();
		},
		handleEnded: function handleEnded() {
			if (this.currentSong + 1 == this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},
		onImageLoaded: function onImageLoaded() {
			this.imgLoaded = true;
		},
		getCurrentTimeEverySecond: function getCurrentTimeEverySecond(startStop) {
			var localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
			function () {
				localThis.currentTime = localThis.audio.currentTime;
				localThis.currentProgressBar =
				localThis.audio.currentTime / localThis.trackDuration * 100;
				localThis.getCurrentTimeEverySecond(true);
			}.bind(this),
			1000);

		},
		pausedMusic: function pausedMusic() {
			clearTimeout(this.checkingCurrentPositionInTrack);
		} },

	watch: {
		currentTime: function currentTime() {
			this.currentTime = Math.round(this.currentTime);
		} },

	beforeDestroy: function beforeDestroy() {
		this.audio.removeEventListener("ended", this.handleEnded);
		this.audio.removeEventListener("loadedmetadata", this.handleEnded);

		clearTimeout(this.checkingCurrentPositionInTrack);
	} });
