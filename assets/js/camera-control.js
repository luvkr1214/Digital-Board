const cameraControl = document.getElementById('camera-control');
const container = cameraControl.parentElement;

let isDragging = false;
let offsetX = 0, offsetY = 0;
let stream = null;

// Handle dragging
cameraControl.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - cameraControl.offsetLeft;
    offsetY = e.clientY - cameraControl.offsetTop;
    cameraControl.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    cameraControl.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const containerRect = container.getBoundingClientRect();
    const controlRect = cameraControl.getBoundingClientRect();

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    x = Math.max(0, Math.min(x, containerRect.width - controlRect.width));
    y = Math.max(0, Math.min(y, containerRect.height - controlRect.height));

    cameraControl.style.left = `${x}px`;
    cameraControl.style.top = `${y}px`;
});

// Handle webcam start/stop
document.addEventListener('DOMContentLoaded', () => {
    const cameraToggle = document.getElementById('camera-toggle');
    const cameraOnIcon = document.querySelector('.camera-on');
    const cameraOffIcon = document.querySelector('.camera-off');
    const webcamDiv = document.getElementById('camera-control');

    cameraToggle.addEventListener('click', async () => {
        if (stream) {
            stopWebcam();
            cameraOnIcon.style.display = 'none';
            cameraOffIcon.style.display = 'flex';
            webcamDiv.style.display = 'none';
        } else {
            await startWebcam();
            cameraOnIcon.style.display = 'flex';
            cameraOffIcon.style.display = 'none';
            webcamDiv.style.display = 'flex';
        }
    });
});

// Start webcam stream
async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('webcam-video');
        videoElement.srcObject = stream;
        videoElement.play();
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

// Stop webcam stream
function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}
