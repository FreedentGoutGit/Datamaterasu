// III_b_solutions_visualization.js
document.addEventListener("DOMContentLoaded", function() {
    var sunburst = new Sunburst({
        colors: {
            "home": "#5687d1",
            "product": "#7b615c",
            "search": "#de783b",
            "account": "#6ab975",
            "other": "#a173d1",
            "end": "#bbbbbb"
        }
    });
    sunburst.loadCsv("visit-sequences.csv");

    d3.select("#togglelegend").on("click", function() {
        var legend = d3.select('#sunburst-legend');
        if (legend.style("visibility") == "hidden") {
            legend.style("visibility", "");
        } else {
            legend.style("visibility", "hidden");
        }
    });
});
