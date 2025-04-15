// Global variables
let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const dots = document.getElementsByClassName("dot");
const preloader = document.querySelector('.preloader');

// Wait for page to fully load before showing content
window.addEventListener('load', function() {
    // Hide preloader with a smooth fade
    setTimeout(function() {
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 800);
    }, 1000);
    
    // Initialize slideshow
    showSlide(slideIndex);
    
    // Add swipe detection for mobile
    let startX;
    let endX;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (startX - endX > 50) {
            // Swiped left - go next
            changeSlide(1);
        } else if (endX - startX > 50) {
            // Swiped right - go previous
            changeSlide(-1);
        }
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === "ArrowRight") {
            changeSlide(1);
        } else if (e.key === "ArrowLeft") {
            changeSlide(-1);
        }
    });
    
    // Auto-adjust dots container based on slide count
    updateDots();
});

// Update dots to match slide count
function updateDots() {
    const dotsContainer = document.querySelector('.dots-container');
    const slideCount = slides.length;
    
    // Clear existing dots if needed
    dotsContainer.innerHTML = '';
    
    // Create the right number of dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = function() { jumpToSlide(i); };
        dotsContainer.appendChild(dot);
    }
}

// Change slide function with Ghibli-inspired transitions
function changeSlide(n) {
    // Add a gentle transition
    slides[slideIndex].style.animation = n > 0 ? 'fadeOutLeft 0.7s' : 'fadeOutRight 0.7s';
    
    setTimeout(function() {
        showSlide(slideIndex += n);
    }, 500);
}

// Jump to specific slide
function jumpToSlide(n) {
    // Only animate if we're moving to a different slide
    if (n !== slideIndex) {
        slides[slideIndex].style.animation = n > slideIndex ? 'fadeOutLeft 0.7s' : 'fadeOutRight 0.7s';
        
        setTimeout(function() {
            showSlide(slideIndex = n);
        }, 500);
    }
}

// Show current slide
function showSlide(n) {
    // Reset if we reach the end or beginning
    if (n >= slides.length) {
        slideIndex = 0;
    }
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        slides[i].style.animation = '';
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    // Show the current slide with nice fade-in animation
    slides[slideIndex].classList.add("active");
    slides[slideIndex].style.animation = 'fadeIn 1s';
    
    // Activate corresponding dot
    if (dots.length > 0) {
        dots[slideIndex].classList.add("active");
    }
}

// Add keyframe animations for slide transitions
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes fadeOutLeft {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(-50px);
    }
}

@keyframes fadeOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(50px);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`);
// Background Music Controls
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    const volumeSlider = document.getElementById('volume-slider');
    
    // Set initial volume
    audio.volume = volumeSlider.value / 100;
    
    // Music play/pause function
    musicToggle.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().then(() => {
                musicIcon.classList.remove('play-icon');
                musicIcon.classList.add('pause-icon');
            }).catch(e => {
                // Autoplay was prevented by browser
                console.log("Autoplay prevented:", e);
            });
        } else {
            audio.pause();
            musicIcon.classList.remove('pause-icon');
            musicIcon.classList.add('play-icon');
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value / 100;
    });
    
    // Try to play the music when the user interacts with the slideshow
    document.querySelector('.slideshow-container').addEventListener('click', function() {
        if (audio.paused) {
            audio.play().then(() => {
                musicIcon.classList.remove('play-icon');
                musicIcon.classList.add('pause-icon');
            }).catch(e => {
                // Autoplay was prevented
            });
        }
    });
    
    // Save music preference in local storage
    function saveMusicState() {
        localStorage.setItem('musicPlaying', !audio.paused);
        localStorage.setItem('musicVolume', audio.volume);
    }
    
    // Restore music preference
    function restoreMusicState() {
        const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        const savedVolume = localStorage.getItem('musicVolume');
        
        if (savedVolume !== null) {
            audio.volume = parseFloat(savedVolume);
            volumeSlider.value = audio.volume * 100;
        }
        
        if (wasPlaying) {
            // We can't autoplay immediately, but we can prepare the UI
            musicIcon.classList.remove('play-icon');
            musicIcon.classList.add('pause-icon');
        }
    }
    
    // Save state when closing or changing page
    window.addEventListener('beforeunload', saveMusicState);
    
    // Try to restore state
    restoreMusicState();
});

// Caesar cipher hint toggle only
document.addEventListener('DOMContentLoaded', function() {
    // Set up hint toggle
    const hintToggle = document.querySelector('.hint-toggle');
    const hintContent = document.querySelector('.hint-content');
    
    if (hintToggle && hintContent) {
        hintToggle.addEventListener('click', function() {
            if (hintContent.style.display === 'block') {
                hintContent.style.display = 'none';
            } else {
                hintContent.style.display = 'block';
            }
        });
    }
    
    // Update dots container for all slides
    updateDots();
});