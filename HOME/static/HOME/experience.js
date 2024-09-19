    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', function(event) {
            // Check if the clicked element is a link, if so, do nothing
            if (event.target.tagName === 'A') return;

            const iframeSrc = this.getAttribute('data-iframe');
            const iframe = document.createElement('iframe');
            iframe.src = iframeSrc;
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.style.height = "150px";  // Adjust iframe height as needed
            iframe.style.borderRadius = "8px";

            const img = this.querySelector('img');
            if (img) {
                this.replaceChild(iframe, img);  // Replace image with iframe
            }
        });
    });