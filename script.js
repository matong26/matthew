const video = document.getElementById("video");
const countdownEl = document.getElementById("countdown");
const counterEl = document.getElementById("counter");
const capturedPhotos = [];
let capturedCount = 0;

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        startCaptureProcess();
    })
    .catch(err => console.error("Camera access denied", err));

// Start auto capture process
function startCaptureProcess() {
    capturePhotoWithCountdown();
}

// Countdown and capture photo
function capturePhotoWithCountdown() {
    if (capturedCount >= 4) {
        redirectToDownload();
        return;
    }

    let timeLeft = 5;
    countdownEl.textContent = timeLeft;
    counterEl.textContent = `${capturedCount}/4`;
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;

        if (timeLeft <= 1) {
            clearInterval(countdownInterval);
            capturePhoto();
        }
    }, 1000);
}

// Capture photo
function capturePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedPhotos.push(canvas.toDataURL("image/png"));
    capturedCount++;
    counterEl.textContent = `${capturedCount}/4`;

    // Continue to next photo
    setTimeout(capturePhotoWithCountdown, 1000);
}

// Redirect to download page with captured images
function redirectToDownload() {
    sessionStorage.setItem("capturedPhotos", JSON.stringify(capturedPhotos));
    window.location.href = "download.html";
}
