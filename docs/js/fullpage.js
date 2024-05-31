document.addEventListener('DOMContentLoaded', function() {
    new fullpage('#fullpage', {
        autoScrolling: true,
        navigation: true,
        navigationTooltips: ['Introduction', 'Impact', 'Mitigation', 'Visualization'],
        showActiveTooltip: true,
        slidesNavigation: true,
        lazyLoad: true,
        credits: {enabled: false},
        showActiveTooltip: true,
        scrollingSpeed: 1000,
        controlArrows: false,
        normalScrollElements: "#globeViz",
        afterLoad: function(origin, destination, direction) {
            if (destination.index === 2 && destination.item.querySelector('#slide2')) {
                loadAndPlotData(); // Start the animation when entering the chart section
                const fadingTextContainer = document.getElementById('fading-text-container');
                fadingTextContainer.classList.add('fade-in');
            }
        }
    });
});
