//create a JSOn
let dataImpactText = [
	{
		"alt": "Temperature Rise",
		"title": "Temperature Rise",
		"text": "CO2 and other GHGs trap heat in the Earth's atmosphere, leading to global warming. This results in temperature rises, causing shifts in weather patterns, extreme weather events, and changing seasons."
	},
	{
		"alt": "Sea Level Rise",
		"title": "Sea Level Rise",
		"text": "As global temperatures increase, ice sheets and glaciers melt, contributing to rising sea levels. This can lead to coastal erosion, increased flooding, and loss of habitat for marine life."
	},
	{
		"alt" : "Ecosystem Disruption",
		"title": "Ecosystem Disruption",
		"text": "Climate change affects ecosystems and biodiversity. Shifts in temperature and weather patterns disrupt habitats, leading to species migration, extinction, or invasive species."
	},
	{
		"alt": "Air Quality",
		"title": "Air Quality",
		"text": "Increased CO2 levels can be associated with poor air quality, leading to respiratory issues, cardiovascular diseases, and other health risks. Other GHGs like methane and nitrous oxide contribute to air pollution."
	},
	{
		"alt": "Heat-Related Illnesses",
		"title": "Heat-Related Illnesses",
		"text": "Rising temperatures can cause heatwaves, leading to dehydration, heatstroke, and exacerbated medical conditions."
	},
	{
		"alt": "Vector-Borne Diseases",
		"title": "Vector-Borne Diseases",
		"text": "Changes in climate can expand the range of disease-carrying insects like mosquitoes, potentially increasing the spread of diseases like malaria and dengue fever."
	},
	{
		"alt": "Agricultural Disruption",
		"title": "Agricultural Disruption",
		"text": "Climate change can lead to unpredictable weather patterns, affecting crop yields and food security. Droughts, floods, and temperature fluctuations impact agriculture."
	},
	{
		"alt": "Infrastructure Damage",
		"title": "Infrastructure Damage",
		"text": "Sea level rise and extreme weather can damage infrastructure, requiring costly repairs and adaptations."
	},
	{
		"alt": "Increased Energy Demand",
		"title": "Increased Energy Demand",
		"text": "As temperatures rise, there's increased demand for air conditioning and cooling, leading to higher energy consumption and costs."
	},
	{
		"alt": "Migration and Displacement",
		"title": "Migration and Displacement",
		"text": "Climate change can lead to forced migration due to sea level rise, extreme weather, or loss of livelihoods, causing social disruption and geopolitical tensions."
	},
	{
		"alt": "Water Security",
		"title": "Water Security",
		"text": "Altered weather patterns can lead to water scarcity, impacting access to clean water and sanitation."
	}
];

const sizeBeforeOpen = 30;

let currentDiv = null;
let locked = false;



//get all the elements with class name "Infos" and if beeing overed, print
//the text content of the elemen

let sideLeftStats = null
let sideRightStats = null


function reloadImpact()
{
	console.log("reloadImpact");

	const el = document.querySelector("#Q1");
	el.addEventListener("click", function() {
		activate(el);
		//put all the opacity of all the children to 1
	});

	const el2 = document.querySelector("#Q2");
	el2.addEventListener("click", function() {
		activate(el2);
	});

	const el3 = document.querySelector("#Q3");
	el3.addEventListener("click", function() {
		activate(el3);
	});

	sideLeftStats = document.getElementsByClassName("sideLeftStats");
	sideRightStats = document.getElementsByClassName("sideRightStats");

	//wait until the doc is ready
	const infos = document.getElementsByClassName("Infos");

	console.log(infos.length)


	for(let i = 0; i < infos.length; i++)
	{

		infos[i].addEventListener("mouseover", function(event){
			if(!locked)
			{
				//drestroy all the previous div class name "InfosExtra"
				const divs = document.getElementsByClassName("InfosExtra");
				for(let j = 0; j < divs.length; j++)
				{
					//remove the div
					divs[j].remove();
					openStats("0%");
					//delay of 0.5s
				}
				if(event.target.width >= sizeBeforeOpen)
				{
					const alt = infos[i].getAttribute("alt");
					currentDiv = createInfoExtra(alt);

					//increase the width from 0 to 30% in animation
					openStats("100%");
				}
			}
		});

		infos[i].addEventListener("mouseleave", function(event){
			if(!locked)
			{
				//check if the mouse is over the div
				tagOverName = window.event.target.className;
				console.log(tagOverName);
				//remove the div
				currentDiv.remove();
				openStats("0%");
			}
		});


		infos[i].addEventListener("click", function(event){
			openStats("100%");
			if(locked)
			{
				//remove the div
				currentDiv.remove();
				openStats("0%");
			}
			locked = !locked;
		});
	}
}






/*
window.setInterval(function(){
	try{
		console.log("refresh");
//check the class name of the div that the mouse is over
		targetName = window.event.target.className;
		console.log(targetName);
		if(event.target.className == "Infos")
		{
			console.log("INFOS");
//move the div to the mouse position
			currentDiv.style.left = event.pageX + 'px';
			currentDiv.style.top = event.pageY + 'px';
		}
		if(targetName == "InfosExtra")
		{
			console.log("over the div");
		}
		else
		{
			console.log("not over the div");
		}
	}catch(e)
	{
	}
}, 100);

*/


function createInfoExtra(alt)
{
	const obj = dataImpactText.find(obj => obj.alt == alt);
	const h1 = document.createElement("h1");
	h1.textContent = obj.title;

	const p = document.createElement("p");
	p.textContent = obj.text;

	const div = document.createElement("div");
	div.className = "InfosExtra";
	div.appendChild(h1);
	div.appendChild(p);

	//set the position of the div to the mouse position
	div.style.left = event.pageX +5 + 'px';
	div.style.top = event.pageY +5 + 'px';

	document.body.appendChild(div);

	//make an animation to open the div
	div.style.transition = "all 0.5s";



	div.style.display = "block";

	div.addEventListener("mouseleave", function(){
		if(!locked)
		{
			currentDiv = null;
			div.remove();
			openStats("0%");
		}
	});

	div.addEventListener("click", function(){
		locked = !locked;
	});

	return div;
}

function openStats(objectif)
{
	sideLeftStats[0].style.width = objectif;
	sideLeftStats[0].style.transition = "all 0.5s";

	sideRightStats[0].style.width = objectif;
	sideRightStats[0].style.transition = "all 0.5s";
}

function activate(el)
{
	if(!locked)
	{
		var isActivated = el.style.width == "200%";
		if(isActivated)
		{
			el.style.width = "100%";
			el.style.height = "100%";
			el.style.transform = "translate(0%, 0%)";
		}
		else{
			el.style.width = "200%";
			el.style.height = "200%";
			//transition the element
			el.style.transition = "all 2s";
			//translate the element by its width and height
			el.style.transform = "translate(-25%, -25%)";
		}

		const children = el.children;
		for(let i = 0; i < children.length; i++)
		{
			children[i].style.opacity = isActivated ? 0.5 : 1;
		}
	}
}
