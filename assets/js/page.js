document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("whiteboard");
    const context = canvas.getContext("2d");

    const pages = [];
    let currentPages = 0;

    // Initialize the canvas
    function initializeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Save current canvas state to the pages array
    function savePage() {
        const dataURL = canvas.toDataURL(); // Save canvas as image
        pages[currentPages] = dataURL;
    }

    // Load page's canvas state
    function loadPage(pageIndex) {
        const image = new Image();
        if (pages[pageIndex]) {
            image.src = pages[pageIndex];
            image.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
            };
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Update page number display
    function updatePageNumber() {
        const pageIndicator = document.querySelector(".page-propagation .pages");
        pageIndicator.textContent = currentPages + 1;
    }

    // Initialize first page
    initializeCanvas();
    pages.push(null); // Add the first blank page
    updatePageNumber();

    // Add a new page
    document.getElementById("add-page").addEventListener("click", () => {
        savePage();
        currentPages = pages.length;
        pages.push(null);
        loadPage(currentPages);
        updatePageNumber();
    });

    // Navigate to Previous Page
    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPages > 0) {
            savePage();
            currentPages--;
            loadPage(currentPages);
            updatePageNumber();
        }
    });

    // Navigate to Next Page
    document.getElementById("next-page").addEventListener("click", () => {
        if (currentPages < pages.length - 1) {
            savePage();
            currentPages++;
            loadPage(currentPages);
            updatePageNumber();
        }
    });
});
