let micStream;
let isMuted = false;

async function startMic() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getAudioTracks().forEach(track => track.enabled = true);
        updateMicUI(false); // Mic is ON
    } catch (error) {
        console.error("Error accessing microphone:", error);
        Swal.fire({
            icon: 'error',
            title: 'Microphone Error',
            text: 'Could not access microphone.',
        });
    }
}

function toggleMic() {
    if (!micStream) {
        startMic();
        return;
    }

    isMuted = !isMuted;
    micStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    updateMicUI(isMuted);
}

function updateMicUI(muted) {
    const micOnIcon = document.querySelector('.mic-on');
    const micOffIcon = document.querySelector('.mic-off');

    if (muted) {
        micOnIcon.style.display = 'none';
        micOffIcon.style.display = 'inline';
    } else {
        micOnIcon.style.display = 'inline';
        micOffIcon.style.display = 'none';
    }
}

window.addEventListener('load', startMic);
