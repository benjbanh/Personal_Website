const liveBoxes = document.querySelectorAll(".live-box");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close");
const iframeContainer = document.getElementById("iframe-container");
const popupTitle = document.querySelector(".popup-text h2");
const popupDescription = document.querySelector(".popup-text p");

// Function to load iframe or image when popup is opened
function loadContent(url) {
    iframeContainer.innerHTML = ""; // Clear any previous content

    // Check if the URL is for an image (common image extensions)
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    console.log("test")

    if (isImage) {
        const img = document.createElement("img");
        img.src = url;
        img.style.width = "100%"; // Make the image scale with the container width
        img.style.height = "auto"; // Keep the aspect ratio
        img.style.objectFit = "contain"; // Ensure the image fits within the container
        iframeContainer.appendChild(img);
        console.log("Image")
    } else {
        // Assume it's a video (iframe) if it's not an image
        const iframe = document.createElement("iframe");
        iframe.src = url + "?autoplay=1"; // Auto-start the video
        iframe.width = "100%";
        iframe.height = "100%"; 
        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.style.border = "none"; // Remove iframe border

        iframeContainer.appendChild(iframe);
        console.log("video")
    }
}

// Show popup when any live-box is clicked
liveBoxes.forEach(box => {
    box.addEventListener("click", () => {
        const videoURL = box.getAttribute("data-url");
        const title = box.getAttribute("data-title");
        const description = box.getAttribute("data-description");

        loadContent(videoURL); // Load the corresponding iframe or image
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
