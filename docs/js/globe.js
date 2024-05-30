// const countryColorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1.5);
const countryColorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
const cityColorScale = d3.scaleSequential(d3.interpolateYlOrRd);
cityColorScale.domain([-0.2, 1]);

const getEmissions = (country, year) => country[year].share_global_co2.toFixed(2);
const getColor = (country, year) => {
	try {
		return countryColorScale(getEmissions(country, year));
	} catch (error) {
		return "gray";
	}
}
const getFootprint = (city) => city["footprint (Mt CO2)"];

const vw_to_px = (vw) => document.documentElement.clientWidth / 100 * vw;
const vh_to_px = (vh) => document.documentElement.clientHeight / 100 * vh;

document.addEventListener('DOMContentLoaded', () => {
	Promise.all([
		fetch('data/ne_110m_admin_0_countries.geojson').then(res => res.json()),
		fetch('data/owid-co2-data_share-global.json').then(res => res.json()),
		fetch("data/GGMCF_top500cities.json").then(res => res.json())
	])
		.then(([countries, owid_data, ggmcf_data]) => {
			const currentYear = window.getCurrentYear();
			const minVal = owid_data.yearly_min_max[currentYear].min_share_global_co2.toFixed(2);
			const maxVal = owid_data.yearly_min_max[currentYear].max_share_global_co2.toFixed(2);
			countryColorScale.domain([minVal, maxVal]);

			const maxCityFootprint = Math.max(...ggmcf_data.map(getFootprint))
			const maxHeight = 0.5;

			const world = Globe()
				.globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
				.backgroundColor("#E5D9B6")
				.width(0.7 * vw_to_px(50))
				.height(0.6 * vh_to_px(100))
				.lineHoverPrecision(0)
				.showAtmosphere(false)

			// set polygon layer settings for countries
			world
				.polygonAltitude(0.05)
				.polygonCapColor(({properties: d}) => getColor(owid_data[d.ISO_A3], currentYear))
				.polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
				.polygonStrokeColor(() => '#111')
				.polygonLabel(({ properties: d }) => {
					const current_country = owid_data[d.ISO_A3];
					const current_year = window.getCurrentYear();
					let emissions;
					try {
						emissions = `${getEmissions(current_country, current_year)}%`;
					} catch(error) {
						emissions = "N/A";
					}

					return `
						<b>${d.ADMIN} (${d.ISO_A3}):</b> <br />
						Share of Global CO2 Emissions: <i>${emissions}</i>
						`
				})
				.polygonsTransitionDuration(300)

			// set points layer settings for cities
			world
				.pointLabel(element => element.city + ', ' + element.country)
				.pointAltitude(city => getFootprint(city) / maxCityFootprint * maxHeight)
			.pointColor(city => cityColorScale(getFootprint(city) / maxCityFootprint))

			// initialize with country layer
			world
				.polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
			(document.getElementById('globeViz'))

			// initialize view to Lausanne, Switzerland
			world.pointOfView({'lat': 46.5218269, 'lng': 6.6327025, 'altitude': 1.5});

			document.addEventListener('yearChanged', function(event) {
				const currentYear = event.detail.currentYear;
				const minVal = owid_data.yearly_min_max[currentYear].min_share_global_co2.toFixed(2);
				const maxVal = owid_data.yearly_min_max[currentYear].max_share_global_co2.toFixed(2);
				countryColorScale.domain([minVal, maxVal]);

				world.polygonCapColor(({ properties: d }) => {
					const country = owid_data[d.ISO_A3];
					return getColor(country, currentYear);
				})
			});


			const progressBar = document.getElementById("progressBarContainer");
			const visualizerContent = document.getElementById("visualizerContent");

			// initialize with country info
			visualizerContent.innerHTML = countryInfo;

			document.getElementById("filterCity").onclick = function() {
				// remove country layer data, add city layer data
				world
					.polygonsData([])
					.pointsData(ggmcf_data)

				progressBar.style.display = "none";
				visualizerContent.innerHTML = cityInfo;
			};

			document.getElementById("filterCountry").onclick = function() {
				// remove city layer data, add country layer data
				world
					.polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
					.pointsData([])

				progressBar.style.display = "flex";
				visualizerContent.innerHTML = countryInfo;
			};
		})
		.catch(error => console.error("Error fetching data (countries): ", error));
});

const countryInfo = `
<h1>Country Share of Global Emissions (1900-2022)</h1>
<div class="description">
<h2>Description</h2>
<p>This visualization presents the share of global carbon emissions for each country from 1900 to 2022. Countries are color-coded based on their share of emissions, with darker and more intense colors indicating higher shares. Pressing the play button beneath the visualization, or clicking on the progress bar, allows one to step through the years and observe how each country's emissions change over time.</p>

<h2>Key Insights</h2>
<ul>
<li><strong>Dominance of the USA and China:</strong> The data shows that the USA and China have consistently dominated global carbon emissions. The USA had a major share throughout much of the 20th century, while China's share surged dramatically in the late 20th and early 21st centuries, reflecting its rapid industrialization and economic growth.</li>
<li><strong>Significant Contributions from Russia and India:</strong> Russia and India also have notable shares of global emissions. Russia's high emissions are linked to its extensive industrial base and energy production, while India's increasing share reflects its growing population and industrial sector.</li>
<li><strong>Historical and Present Contributions:</strong> The visualization highlights how different countries' contributions to global emissions have changed over time. Historical data shows the industrial revolution's impact in Western countries, while current data highlights the shift towards higher emissions in emerging economies.</li>
</ul>

<h2>Conclusion</h2>
<p>This visualization underscores the varying contributions of different countries to global carbon emissions over the past century and more. By providing a dynamic view of emissions data over time, it helps illustrate the shifting landscape of global emissions and the importance of both historical and current contributions in addressing climate change. Policymakers can use this information to understand trends and develop strategies for reducing emissions on a global scale.</p>
</div>
`

const cityInfo = `
<h1>Top Cities by Carbon Footprint</h1>
<div>
<h2>Description</h2>
<p>This 3D globe visualization highlights some of the top 500 cities in the world by their carbon footprint. Each point on the globe represents a city, with the size and color of the points indicating the magnitude of the carbon footprint. Larger and more intense points signify higher carbon emissions.</p>

<h2>Key Insights</h2>
<ul>
<li><strong>High Concentration in Developed Countries:</strong> Many of the cities with the highest carbon footprints are located in developed countries, particularly in North America, Europe, and East Asia. This likely reflects the high industrial activity and energy consumption in these regions.</li>
<li><strong>Rapid Urbanization Impact:</strong> Emerging economies with rapid urbanization, such as China and India, also feature prominently. The data highlights the environmental impact of rapid industrial growth and urban development in these regions.</li>
<li><strong>Population vs. Emissions:</strong> While some cities have high emissions due to their large populations, others with smaller populations but intensive industrial activities also show significant carbon footprints. This underscores the need to consider both population size and industrial activity when addressing urban carbon emissions.</li>
</ul>
<h2>Conclusion</h2>
<p>This visualization underscores the critical role cities play in global carbon emissions. By identifying the cities with the highest carbon footprints, policymakers and environmentalists target their efforts more effectively.</p>
</div>
`
