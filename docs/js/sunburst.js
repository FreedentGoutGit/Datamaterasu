// Initialize Sunburst after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const sunburstOptions = {
        selectors: {
            breadcrumbs: '#sunburst-breadcrumbs',
            chart: '#sunburst-chart',
            description: '#sunburst-description',
            legend: '#sunburst-legend'
        },
        width: 1100,
        height: 400,
        
        breadcrumbs: {
            w: 250,
            h: 50,
            s: 3,
            t: 10
        },
        separator: '-'
    };

    var sunburst = new Sunburst(sunburstOptions);
    sunburst.loadCsv("./data/III_b_projected_reductions/final_data_mitigation.csv");
    document.getElementById('togglelegend').addEventListener('click', function() {
        const legend = document.getElementById('sunburst-legend');
        legend.style.visibility = legend.style.visibility === 'hidden' ? '' : 'hidden';
    });
});