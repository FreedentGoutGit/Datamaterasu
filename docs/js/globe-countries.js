const colorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1.5);

const getEmissions = (country, year) => country[year].share_global_co2.toFixed(2);
const getColor = (country, year) => {
	try {
		return colorScale(getEmissions(country, year));
	} catch (error) {
		return "black";
	}
}

document.addEventListener('DOMContentLoaded', () => {
	Promise.all([
		fetch('data/ne_110m_admin_0_countries.geojson').then(res => res.json()),
		fetch('data/owid-co2-data_share-global.json').then(res => res.json())
	])
		.then(([countries, owid_data]) => {
			const currentYear = window.getCurrentYear();
			const minVal = owid_data.yearly_min_max[currentYear].min_share_global_co2.toFixed(2);
			const maxVal = owid_data.yearly_min_max[currentYear].max_share_global_co2.toFixed(2);
			colorScale.domain([minVal, maxVal]);

			const world = Globe()
				.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
				.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
				.lineHoverPrecision(0)
				.polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
				.polygonAltitude(0.05)
				.polygonCapColor(({properties: d}) => getColor(owid_data[d.ISO_A3], currentYear))
				.polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
				.polygonStrokeColor(() => '#111')
				.polygonLabel(({ properties: d }) => {
					const current_country = owid_data[d.ISO_A3];
					const current_year = window.getCurrentYear();
					let emissions;
					try {
						emissions = getEmissions(current_country, current_year);
					} catch(error) {
						emissions = 0;
					}

					return `
						<b>${d.ADMIN} (${d.ISO_A3}):</b> <br />
						Share of Global CO2 Emissions: <i>${current_year}: ${emissions}%</i>
						`
				})
			// .onPolygonHover(hoverD => world
				// 	// .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
				// 	.polygonCapColor(d => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
				// )
				.polygonsTransitionDuration(300)
			(document.getElementById('globeViz1'))

			document.addEventListener('yearChanged', function(event) {
				const currentYear = event.detail.currentYear;
				const minVal = owid_data.yearly_min_max[currentYear].min_share_global_co2.toFixed(2);
				const maxVal = owid_data.yearly_min_max[currentYear].max_share_global_co2.toFixed(2);
				colorScale.domain([minVal, maxVal]);

				world.polygonCapColor(({ properties: d }) => {
					const country = owid_data[d.ISO_A3];
					return getColor(country, currentYear);
				})
			});
		})
		.catch(error => console.error("Error fetching data (countries): ", error));
});
