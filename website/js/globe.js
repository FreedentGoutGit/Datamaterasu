const scale_factor = 0.01;
document.addEventListener('DOMContentLoaded', () => {
	fetch("data/GGMCF_top500cities.json")
		.then(response => response.json())
		.then(data => {
			const points = [];
			data.forEach(element => {
				points.push({
					lat: element.lat,
					lng: element.lng,
					size: 1
				});
			});

			Globe()
				.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
				.pointsData(data)
				.pointLabel(element => element.city + ', ' + element.country)
				.pointAltitude(element => element['footprint (Mt CO2)'] * scale_factor)
				.pointColor(element => {
					const size = element['footprint (Mt CO2)'] * scale_factor;
					if (size >= 1) return 'red';
					if (size >= 0.5) return 'blue';
					return 'green';
					// element['footprint (Mt CO2)'] * scale_factor > 1 ? 'red' : 'blue')
				})
			(document.getElementById('globeViz'))
		})
		.catch(error => console.error('Error fetching data:', error));
});
