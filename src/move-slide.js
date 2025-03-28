const slides = document.querySelectorAll(".slides");
const dots = document.querySelectorAll(".nav-dot");
const leftButton = document.getElementById("previous--image");
const rightButton = document.getElementById("next--image");


let currentDot = 0; // Set the initial dot index
let AutoSlidingSlides; // Variable to store the interval ID

function moveToSlide(index) {
    let offset = (index === 0) ? 0 : -50;
    slides.forEach(slide => slide.style.transform = `translateX(${offset}%)`); // Move the slide

    // Update the dot styles
    dots.forEach((dot, dotIndex) => {
        dot.style.backgroundColor = dotIndex === index 
            ? "rgba(255, 255, 255, 1)" 
            : "rgba(255, 255, 255, 0.5)";
    });

    currentDot = index; // Update the current active dot
}

function startInterval() {
    AutoSlidingSlides = setInterval(() => {
        currentDot = (currentDot + 1) % 2; // Move to the next slide, looping back to the first
        moveToSlide(currentDot); // Move to the new slide
    }, 10000); // 10000ms = 10 seconds between slides
}

// Add click event listeners to dots
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        clearInterval(AutoSlidingSlides); // Clear the existing interval
        moveToSlide(index); // Move to the clicked slide
        startInterval(); // Restart the interval from the clicked dot
    });
});

leftButton.addEventListener("click", () => {
    clearInterval(AutoSlidingSlides); // Clear the existing interval
    currentDot = 0; // Move to the slide 0
    moveToSlide(currentDot); 
    startInterval(); // Restart the interval from the previous dot
});

rightButton.addEventListener("click", () => {
    clearInterval(AutoSlidingSlides); // Clear the existing interval
    currentDot = 1; // Move to the slide 1
    moveToSlide(currentDot); 
    startInterval(); // Restart the interval from the previous dot
});

// Initialize the first slide as active and start the interval
moveToSlide(currentDot);
startInterval();
