// Disable printing on Ctrl+P shortcut for the entire document
window.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
    }
});

// Load the PDF file
const pdfUrl = 'http://localhost:8080/pdftojpeg/MP-Board-10th-Model-Paper-of-English.pdf';

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// Render PDF as JPG images
pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
    const numPages = pdf.numPages;
    const container = document.getElementById('pdf-container');

    // Loop through each page and render it as JPG
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        pdf.getPage(pageNumber).then(function (page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            // Prepare canvas element for rendering
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render the PDF page into the canvas
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext).promise.then(function () {
                // Convert canvas to JPG image
                const image = new Image();
                image.src = canvas.toDataURL('image/jpeg');

                // Prevent image from being downloadable
                image.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                });
                image.addEventListener('dragstart', function (event) {
                    event.preventDefault();
                });

                // Display the JPG image on the screen
                container.appendChild(image);
            });
        });
    }
});
