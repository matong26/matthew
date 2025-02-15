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
const canvasWidth = 240; 
const imageHeight = 160; 
const spacing = 10; 
const framePadding = 10; 
const logoSpace = 100; 

// Adjust canvas height dynamically based on the number of images + logo space
finalCanvas.width = canvasWidth;
finalCanvas.height = framePadding + (imageHeight + spacing) * capturedPhotos.length + logoSpace;

// Function to draw the collage with frame color & logo
function drawCollage() {
    const background = new Image();
    background.src = selectedFrameColor; 

    background.onload = () => {
        ctx.drawImage(background, 0, 0, finalCanvas.width, finalCanvas.height); 

        capturedPhotos.forEach((photo, index) => {
            const img = new Image();
            img.src = photo;

            img.onload = () => {
                const x = framePadding; 
                const y = framePadding + index * (imageHeight + spacing); 
                ctx.drawImage(img, x, y, canvasWidth - 2 * framePadding, imageHeight);
            };

            img.onerror = () => {
                console.error(`Failed to load image ${index + 1}`);
            };
        });

        // Draw the logo at the bottom
        const logo = new Image();
        logo.src = "img/logo.png"; 

        logo.onload = () => {
            const logoWidth = 80; 
            const logoHeight = 20;
            const logoX = (canvasWidth - logoWidth) / 2; 
            const logoY = finalCanvas.height - logoSpace + 35;
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
        };

        logo.onerror = () => {
            console.error("Failed to load logo image.");
        };
    };

    background.onerror = () => {
        console.error("Failed to load background image.");
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
