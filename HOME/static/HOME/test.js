// Get all detailed sections and content sections
const detailedSections = document.querySelectorAll('.detailed-section');
const contentSections = document.querySelectorAll('.content-section');

// Add scroll event listener to the right panel
const rightPanel = document.querySelector('.right-panel');
const leftPanel = document.querySelector('.left-panel');

// Add scroll checkpoints at the start of each detailed section
let checkpoints = [];

detailedSections.forEach(section => {
    let sectionId = section.getAttribute('data-section');
    let contentSection = document.getElementById(sectionId);
    
    checkpoints.push({
        id: sectionId,
        top: section.offsetTop,
        contentSection: contentSection
    });
});

let isUserScrollingLeft = false;

// Scroll event for right panel
rightPanel.addEventListener('scroll', () => {
    if (isUserScrollingLeft) return;

    let scrollTop = rightPanel.scrollTop;

    // Loop through checkpoints to find the current one
    checkpoints.forEach((checkpoint, index) => {
        if (scrollTop >= checkpoint.top - 50 && scrollTop < (checkpoint.top + detailedSections[index].offsetHeight)) {
            // Scroll the left panel to match the right panel
            let targetTop = checkpoint.contentSection.offsetTop;

            // Set a flag to avoid circular triggering of scrolls
            isUserScrollingLeft = true;
            leftPanel.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
            isUserScrollingLeft = false;
        }
    });
});
