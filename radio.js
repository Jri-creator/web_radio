document.addEventListener('DOMContentLoaded', () => {
    const songListUrl = '/web_radio/songs.txt';
    let musicFiles = [];
    let songCounter = 0;
    let isPlaying = false;

    // Initialize audio player and control buttons
    const audioPlayer = new Audio();
    const playPauseButton = document.getElementById('playPauseButton');
    const nextButton = document.getElementById('nextButton');

    console.log("DOM fully loaded and parsed.");
    console.log("audioPlayer initialized:", audioPlayer);

    // Check if elements are initialized
    if (!playPauseButton || !nextButton) {
        console.error("Play or Next button not found.");
        return;
    }

    playPauseButton.disabled = true;
    nextButton.disabled = true;

    // Fetch and parse the song list
    async function fetchSongList() {
        try {
            const response = await fetch(songListUrl);
            const text = await response.text();
            musicFiles = text.trim().split('\n').map(file => `/web_radio/music/${file.trim()}`);
            
            console.log("Fetched music files:", musicFiles);

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

        console.log("Playing song:", selectedSong);

        audioPlayer.play().catch(error => console.error("Error playing song:", error));
        songCounter++;

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
        console.log("Playing announcement");
        audioPlayer.play().catch(error => console.error("Error playing announcement:", error));
        songCounter = 0;
    }

    // Fetch songs on page load
    fetchSongList();
});
