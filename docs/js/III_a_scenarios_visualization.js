var intervals = [];
var isAnimating = true;
var currentIndex = 0;
var timeRemaining = [];

var margin = {top: 20, right: 30, bottom: 50, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear()
    .domain([2000, 2050])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10).tickSize(-height))
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#333");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 70])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y).ticks(10).tickSize(-width))
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#333");

function plotData(data, color, duration = 1000, keep = false) {
    data = data.filter(d => d.x && d.CI_left && d.CI_right)
        .map(d => ({x: +d.x, CI_left: +d.CI_left, y: +d.y, CI_right: +d.CI_right}));

    if (!keep) {
        // Remove previous paths except for initial data
        svg.selectAll(".timeseries").transition().duration(duration).attr("opacity", 0).remove();
    }

    // Show confidence interval
    var areaPath = svg.append("path")
        .datum(data)
        .attr("class", "timeseries")
        .attr("fill", color)
        .attr("stroke", "none")
        .attr("opacity", 0)
        .attr("d", d3.area()
            .x(d => x(d.x))
            .y0(d => y(d.CI_right))
            .y1(d => y(d.CI_left))
        )
        .transition()
        .duration(duration)
        .attr("opacity", 0.5);

    // Add the line
    var linePath = svg.append("path")
        .datum(data)
        .attr("class", "timeseries")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("d", d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
        )
        .transition()
        .duration(duration)
        .attr("opacity", 1);
}

function plotDataInit(data, color, duration = 1000) {
    data = data.filter(d => d.y)
        .map(d => ({x: +d.x, y: +d.y, CI_left: +d.CI_left, CI_right: +d.CI_right}));

    // Show confidence interval
    var areaPath = svg.append("path")
        .datum(data)
        .attr("class", "initial-timeseries")
        .attr("fill", color)
        .attr("stroke", "none")
        .attr("opacity", 0)
        .attr("d", d3.area()
            .x(d => x(d.x))
            .y0(d => y(d.CI_right))
            .y1(d => y(d.CI_left))
        )
        .transition()
        .duration(duration)
        .attr("opacity", 0.5);

    // Add the line
    var linePath = svg.append("path")
        .datum(data)
        .attr("class", "initial-timeseries")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("opacity", 0)
        .attr("d", d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
        )
        .transition()
        .duration(duration)
        .attr("opacity", 1);
}

function updateTextBox(index) {
    var texts = [
        "Our CO2 and GhG emissions have kept rising over the years (here in Gigatones/year)",
        "With the currently implemented policies, we are headed for a slow, but steady rise, making the 1.5C target impossible to reach",
        "If we take immediate action, we can still keep heating under 1.5C as in this scenario!",
        "But it has to be drastic, or we could be going for a 2C+ heating",
        "Or a 2 or 1.5 degree overshoot scenario curve where some, but not all, of the damage will be avoided"
    ];
    d3.select("#curve_info").text(texts[index]);
}

function loadAndPlotData(resume = false) {
    if (!resume) {
        currentIndex = 0;
        timeRemaining = [];
        svg.selectAll(".initial-timeseries").remove();
        updateTextBox(currentIndex);  // Update the text box for the initial curve
    }

    var init = "./data/III_a_projected_scenarios/init.csv";
    var datasets = [
        "./data/III_a_projected_scenarios/current.csv",
        "./data/III_a_projected_scenarios/1_5_deg.csv",
        "./data/III_a_projected_scenarios/2_deg.csv",
        "./data/III_a_projected_scenarios/2_or_1_5_overshoot.csv"
    ];
    var colors = ["#082d0f", "#285430", "#5F8D4E", "#A4BE7B"];

    if (!resume) {
        // Plot the initial dataset and keep it displayed
        d3.csv(init).then(data => {
            plotDataInit(data, "#b5a05f", 1000);
        }).catch(error => {
            console.error('Error loading or parsing CSV file:', error);
        });
    }

    // Clear any existing intervals
    intervals.forEach(timeout => clearTimeout(timeout));
    intervals = [];

    // Calculate remaining times if resuming
    var baseDelay = resume ? timeRemaining[currentIndex] : 5000;
    for (let i = currentIndex; i < datasets.length + 1; i++) {
        const dataset = datasets[i];
        const delay = (i === currentIndex && resume) ? baseDelay : (i + 1) * 5000;

        var timeout = setTimeout(() => {
            d3.csv(dataset).then(data => {
                plotData(data, colors[i + 1], 2000);
                currentIndex = i + 1;
                updateTextBox(currentIndex);  // Update the text box for the new curve
                if (currentIndex === datasets.length + 1) {
                    fadeInAllDatasets(datasets, colors);
                }
            }).catch(error => {
                console.error('Error loading or parsing CSV file:', error);
            });
        }, delay); // Delay for each dataset
        intervals.push(timeout);

        // Store time remaining for each timeout
        timeRemaining[i] = delay;
    }
}

function fadeInAllDatasets(datasets, colors) {
    svg.selectAll(".timeseries").remove(); // Remove previous timeseries before adding them back
    datasets.forEach((dataset, index) => {
        d3.csv(dataset).then(data => {
            plotData(data, colors[index + 1], 2000, true);
        }).catch(error => {
            console.error('Error loading or parsing CSV file:', error);
        });
    });
}

function stopAnimation() {
    intervals.forEach(timeout => clearTimeout(timeout));
}

function startStopAnimation() {
    if (isAnimating) {
        stopAnimation();
        d3.select("#startStopButton").text("Start");
    } else {
        loadAndPlotData(true);
        d3.select("#startStopButton").text("Stop");
    }
    isAnimating = !isAnimating;
}

document.getElementById("restartButton").addEventListener("click", () => {
    stopAnimation();
    loadAndPlotData();
    d3.select("#startStopButton").text("Stop");
    isAnimating = true;
});
document.getElementById("startStopButton").addEventListener("click", startStopAnimation);
