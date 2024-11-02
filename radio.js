const songListUrl = '/songs.txt';  // Path to your song list text file
const announcementFile = '/announce/announce.mp3';
let musicFiles = [];   // Array to hold the list of songs from the file
let songCounter = 0;
let audioPlayer = document.getElementById('audioPlayer');

// Function to fetch and parse the songs list
async function fetchSongList() {
    try {
        const response = await fetch(songListUrl);
        const text = await response.text();
        musicFiles = text.trim().split('\n'); // Split each line into an array entry
        if (musicFiles.length > 0) {
            playRandomSong();
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

// Event listener to play the next track when the current one ends
audioPlayer.addEventListener('ended', () => {
    if (songCounter >= 3) {
        playAnnouncement();
    } else {
        playRandomSong();
    }
});

// Fetch the song list and start the radio
fetchSongList();
