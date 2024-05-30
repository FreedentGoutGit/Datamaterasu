const countryColorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1.5);
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

			document.getElementById("filterCity").onclick = function() {
				// remove country layer data, add city layer data
				world
					.polygonsData([])
					.pointsData(ggmcf_data)

				progressBar.style.display = "none";
			};

			document.getElementById("filterCountry").onclick = function() {
				// remove city layer data, add country layer data
				world
					.polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
					.pointsData([])

				progressBar.style.display = "flex";
			};
		})
		.catch(error => console.error("Error fetching data (countries): ", error));
});
