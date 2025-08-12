let screenStream;
let isScreenSharing = false;
let videoElement;

document.getElementById("screen-share").addEventListener("click", async () => {
    const whiteboard = document.getElementById('whiteboard');

    if (isScreenSharing) {
        stopScreenShare();
    } else {
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

            videoElement = document.createElement('video');
            videoElement.srcObject = screenStream;
            videoElement.autoplay = true;
            videoElement.muted = true; // optional: avoid feedback

            videoElement.onloadedmetadata = () => {
                whiteboard.width = videoElement.videoWidth;
                whiteboard.height = videoElement.videoHeight;
                drawVideoToCanvas();
            };

            isScreenSharing = true;
        }
        catch (error) {
            console.log("Error starting screen sharing:", error);
        }
    }
});

function drawVideoToCanvas() {
    const whiteboard = document.getElementById('whiteboard');
    const context = whiteboard.getContext('2d');

    function render() {
        if (!isScreenSharing || videoElement.paused || videoElement.ended) return;
        context.drawImage(videoElement, 0, 0, whiteboard.width, whiteboard.height);
        requestAnimationFrame(render);
    }

    render();
}

function stopScreenShare() {
    if (screenStream) {
        const tracks = screenStream.getTracks();
        tracks.forEach(track => track.stop());
        screenStream = null;
    }

    isScreenSharing = false;

    // Optional: Clear canvas if desired
    const whiteboard = document.getElementById('whiteboard');
    const context = whiteboard.getContext('2d');
    context.clearRect(0, 0, whiteboard.width, whiteboard.height);

    // Optional: Reset canvas size or overlay state
    whiteboard.style.zIndex = '5';

    // Show webcam again if needed
    document.getElementById('webcam').style.display = 'block';
}
