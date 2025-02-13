const finalCanvas = document.getElementById("finalCanvas");
const ctx = finalCanvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const colorButtons = document.querySelectorAll(".color-btn");

let selectedFrameColor = "#FFB6C1"; // Default frame color (Pink)
let capturedPhotos = JSON.parse(sessionStorage.getItem("capturedPhotos")) || [];

if (capturedPhotos.length === 0) {
    console.error("No photos found in sessionStorage.");
}

// Canvas dimensions
const canvasWidth = 240; // Single column width
const imageHeight = 160; // Height of each photo
const spacing = 10; // Space between images
const framePadding = 10; // Space around the images
const logoSpace = 100; // Extra space at the bottom for the logo

// Adjust canvas height dynamically based on the number of images + logo space
finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

// Function to draw the collage with frame color & logo
function drawCollage() {
    ctx.fillStyle = selectedFrameColor;
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height); // Fill background with frame color

    capturedPhotos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;

        img.onload = () => {
            const x = framePadding; // Left padding
            const y = framePadding + index * (imageHeight + spacing); // Stack vertically with spacing
            ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight); // Draw image
        };

        img.onerror = () => {
            console.error(`Failed to load image ${index + 1}`);
        };
    });

    // Draw the logo at the bottom
    const logo = new Image();
    logo.src = "img/logo.png"; // Replace with your logo URL or file path

    logo.onload = () => {
        const logoWidth = 80; // Adjust based on logo size
        const logoHeight = 20;
        const logoX = (canvasWidth - logoWidth) / 2; // Center horizontally
        const logoY = finalCanvas.height - logoSpace + 35; // Position at the bottom
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    };

    logo.onerror = () => {
        console.error("Failed to load logo image.");
    };
}

// Change frame color when user selects a button
colorButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        selectedFrameColor = event.target.getAttribute("data-color");
        drawCollage();
    });
});

// Download the final image
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = finalCanvas.toDataURL("image/png");
    link.download = "photobooth.png";
    link.click();
});

// Initial drawing
drawCollage();
