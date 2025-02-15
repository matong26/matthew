const video = document.getElementById("video");
const countdownEl = document.getElementById("countdown");
const counterEl = document.getElementById("counter");
const shutterOverlay = document.createElement("div");
shutterOverlay.style.position = "absolute";
shutterOverlay.style.top = "0";
shutterOverlay.style.left = "0";
shutterOverlay.style.width = "100%";
shutterOverlay.style.height = "100%";
shutterOverlay.style.background = "white";
shutterOverlay.style.opacity = "0";
shutterOverlay.style.transition = "opacity 0.2s ease-out";
document.body.appendChild(shutterOverlay);

const shutterSound = new Audio("shutter.mp3");
const countdownSound = new Audio("countdown.mp3");

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
    countdownSound.play();
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;
        countdownSound.play();

        if (timeLeft === 1) {
            triggerShutterAnimation();
        }

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

    // Flip canvas horizontally
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    capturedPhotos.push(canvas.toDataURL("image/png"));
    capturedCount++;
    counterEl.textContent = `${capturedCount}/4`;

    // Continue to next photo
    setTimeout(capturePhotoWithCountdown, 1000);
}

// Shutter animation
function triggerShutterAnimation() {
    shutterOverlay.style.opacity = "1";
    shutterSound.play();
    setTimeout(() => {
        shutterOverlay.style.opacity = "0";
    }, 100);
}

// Redirect to download page with captured images
function redirectToDownload() {
    sessionStorage.setItem("capturedPhotos", JSON.stringify(capturedPhotos));
    window.location.href = "download.html";
}
