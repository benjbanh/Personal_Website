// Get elements
const liveBoxes = document.querySelectorAll(".live-box");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close");
const iframeContainer = document.getElementById("iframe-container");
const popupTitle = document.querySelector(".popup-text h2");
const popupDescription = document.querySelector(".popup-text p");

// Function to load iframe when popup is opened
function loadIframe(videoURL) {
    const iframe = document.createElement("iframe");
    iframe.src = videoURL + "?autoplay=1"; // Auto-start the video
    iframe.width = "100%";
    iframe.height = "315";
    iframe.frameBorder = "0";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // Append iframe to the container
    iframeContainer.innerHTML = ""; // Clear any previous iframe
    iframeContainer.appendChild(iframe);
}

// Show popup when any live-box is clicked
liveBoxes.forEach(box => {
    box.addEventListener("click", () => {
        const videoURL = box.getAttribute("data-url");
        const title = box.getAttribute("data-title");
        const description = box.getAttribute("data-description");

        loadIframe(videoURL); // Load the corresponding iframe
        popupTitle.textContent = title; // Set the title
        popupDescription.textContent = description; // Set the description
        popup.style.display = "block"; // Show the popup
    });
});

// Close popup when the close button is clicked
closeBtn.addEventListener("click", closePopup);

// Close popup when clicking outside the popup content
window.addEventListener("click", (event) => {
    if (event.target === popup) {
        closePopup();
    }
});

// Function to close the popup
function closePopup() {
    popup.style.display = "none";
    iframeContainer.innerHTML = ""; // Remove the iframe when popup is closed to stop the video
}
