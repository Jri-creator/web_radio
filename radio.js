document.addEventListener('DOMContentLoaded', () => {
    const songListUrl = '/web_radio/songs.txt';
    let musicFiles = [];
    let songCounter = 0;
    let isPlaying = false;
    const audioPlayer = new Audio();  // Initialize the audio player here
    const playPauseButton = document.getElementById('playPauseButton');
    const nextButton = document.getElementById('nextButton');

    // Fetch and parse the song list
    async function fetchSongList() {
        try {
            const response = await fetch(songListUrl);
            const text = await response.text();
            musicFiles = text.trim().split('\n').map(file => `/web_radio/music/${file.trim()}`);
            
            if (musicFiles.length > 0) {
                playPauseButton.disabled = false;
                nextButton.disabled = false;
            } else {
                console.error("No songs found in the list.");
            }
        } catch (error) {
            console.error("Failed to load the song list:", error);
        }
    }

    // Function to play a random song
    function playRandomSong() {
        if (musicFiles.length === 0) return;

        const randomIndex = Math.floor(Math.random() * musicFiles.length);
        const selectedSong = musicFiles[randomIndex];
        audioPlayer.src = selectedSong;
        audioPlayer.play().catch(error => console.error("Error playing song:", error));
        songCounter++;

        // Reset play/pause button state
        isPlaying = true;
        updatePlayPauseButton();
    }

    // Function to toggle play/pause
    function togglePlayPause() {
        if (!isPlaying) {
            if (!audioPlayer.src) {
                playRandomSong();
            } else {
                audioPlayer.play();
            }
            isPlaying = true;
        } else {
            audioPlayer.pause();
            isPlaying = false;
        }
        updatePlayPauseButton();
    }

    // Function to update the play/pause button text
    function updatePlayPauseButton() {
        playPauseButton.textContent = isPlaying ? 'Pause' : 'Play';
    }

    // Function to skip to the next random song
    function playNextSong() {
        playRandomSong();
    }

    // Event listeners for custom controls
    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', playNextSong);

    // Auto-play next song when current one ends
    audioPlayer.addEventListener('ended', () => {
        if (songCounter >= 3) {
            playAnnouncement();
        } else {
            playRandomSong();
        }
    });

    // Function to play announcement and reset counter
    function playAnnouncement() {
        audioPlayer.src = '/web_radio/announce/announce.mp3';
        audioPlayer.play().catch(error => console.error("Error playing announcement:", error));
        songCounter = 0;
    }

    // Fetch songs on page load
    fetchSongList();
});
