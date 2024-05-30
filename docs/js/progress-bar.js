document.addEventListener('DOMContentLoaded', function() {
	let currentYear = 1990;
	const startYear = 1990;
	const endYear = 2022;
	let interval;
	const progressBar = document.getElementById('progressBar');
	const yearDisplay = document.getElementById('yearDisplay');
	const playPauseButton = document.getElementById('playPauseButton');
	const playPauseIcon = document.getElementById('playPauseIcon');
	const progressContainer = document.getElementById('progressContainer');
	let isPlaying = false;

	function updateProgressBar() {
		const progress = ((currentYear - startYear) / (endYear - startYear)) * 100;
		progressBar.style.width = progress + '%';
		yearDisplay.textContent = currentYear;
		if (progress === 100) {
			progressBar.style.borderRadius = "15px"; // Round right end if full
		} else {
			progressBar.style.borderRadius = "15px 0 0 15px"; // Round only left end otherwise
		}

		// Dispatch custom event to notify that currentYear has changed
		const event = new CustomEvent('yearChanged', { detail: { currentYear } });
		document.dispatchEvent(event);
	}

	function play() {
		interval = setInterval(() => {
			if (currentYear < endYear) {
				currentYear++;
				updateProgressBar();
			} else {
				clearInterval(interval);
				playPauseIcon.classList.remove('fa-pause');
				playPauseIcon.classList.add('fa-play');
				isPlaying = false;
			}
		}, 125); // Update rate
	}

	function pause() {
		clearInterval(interval);
	}

	function togglePlayPause() {
		if (isPlaying) {
			pause();
			playPauseIcon.classList.remove('fa-pause');
			playPauseIcon.classList.add('fa-play');
		} else {
			if (currentYear >= endYear) {
				currentYear = startYear; // Restart from the beginning
			}
			play();
			playPauseIcon.classList.remove('fa-play');
			playPauseIcon.classList.add('fa-pause');
		}
		isPlaying = !isPlaying;
	}

	function handleProgressBarClick(event) {
		const containerWidth = event.currentTarget.offsetWidth;
		const clickPosition = event.offsetX;
		const newYear = Math.round(startYear + ((clickPosition / containerWidth) * (endYear - startYear)));
		currentYear = newYear;
		updateProgressBar();
	}

	// Initialize
	updateProgressBar();

	// Add event listeners
	playPauseButton.addEventListener('click', togglePlayPause);
	progressContainer.addEventListener('click', handleProgressBarClick);

	// Expose currentYear and functions to the global scope
	window.getCurrentYear = function() {
		return currentYear;
	};

	window.setCurrentYear = function(year) {
		if (year >= startYear && year <= endYear) {
			currentYear = year;
			updateProgressBar();
		}
	};

	window.play = play;
	window.pause = pause;
});
