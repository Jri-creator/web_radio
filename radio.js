const songListUrl = '/web_radio/songs.txt';
const announcementFile = '/web_radio/announce/announce.mp3';
let musicFiles = [];
let songCounter = 0; 
let audioPlayer = document.getElementById('audioPlayer');
const startButton = document.getElementById('startRadio');

// Fetch and parse the song list
async function fetchSongList() {
    try {
        const response = await fetch(songListUrl);
        const text = await response.text();
        musicFiles = text.trim().split('\n');
        if (musicFiles.length > 0) {
            startButton.disabled = false;  // Enable the start button if songs are available
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
    audioPlayer.src = musicFiles[randomIndex];
    audioPlayer.play();
    songCounter++;
}

// Function to play announcement and reset counter
function playAnnouncement() {
    audioPlayer.src = announcementFile;
    audioPlayer.play();
    songCounter = 0;
}

// Event listener for the start button
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';  // Hide the button after starting
    playRandomSong();
});

// Event listener to play the next track when the current one ends
audioPlayer.addEventListener('ended', () => {
    if (songCounter >= 3) {
        playAnnouncement();
    } else {
        playRandomSong();
    }
});

// Fetch the song list on page load
fetchSongList();
