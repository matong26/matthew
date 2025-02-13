function redirectWithTransition(url) {
    // Create overlay element
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "#000";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.1s ease-in-out";
    overlay.style.zIndex = "9999";
    
    document.body.appendChild(overlay);
    
    // Trigger fade-in effect
    setTimeout(() => {
        overlay.style.opacity = ".5";
    }, 10);
    
    // Redirect after transition
    setTimeout(() => {
        window.location.href = url;
    }, 600);
}