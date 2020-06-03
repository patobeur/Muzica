"use strict";
// menu footer
let nbItemsInFooter = 3
let origineClasseName = 'footerlink boutton'
let enabledClasseName = 'up'
let textesItems = ['options','github','muzicbrainz','infos','fontawesome','awesome']
let actionItems = ['modal','link','link','link','link','link']
let awesomItems = ['fas fa-sliders-h','fas fa-file-code','fas fa-database','fab fa-font-awesome-flag','fas fa-pencil-ruler']
let urlItems = ['#','https://github.com/patobeur/Muzica','https://musicbrainz.org/','https://getbootstrap.com','https://fontawesome.com/icons?m=free']
let titleItems = ['Somme Options to do...','Code source from Patobeur on Github','Musbicbrainz Music Database','Bootstrap','free fontawesome icons']
let cibleId = "wrapper"
let footer = document.querySelector('#'+cibleId)

if (footer) {
	let footeritems = document.createElement('div')
	footeritems.id = 'pagefooter'
	
	for (let i = 0;i<nbItemsInFooter;i++){
	
		let bouttonitem = document.createElement("div")
			bouttonitem.id = textesItems[i] + '_link'
			bouttonitem.className = 'footerlink boutton'
			bouttonitem.setAttribute('href', '#')
			bouttonitem.setAttribute('type', 'button')
			bouttonitem.setAttribute('title', titleItems[i])
		let awesomeicone = document.createElement("i")
			awesomeicone.className = awesomItems[i]
	
		bouttonitem.prepend(capital(textesItems[i]))
		bouttonitem.prepend(awesomeicone)
	
			// let item = textesItems[i] + '_link'
			bouttonitem.addEventListener(
				'click',
				(event)=>{
					let allup = document.getElementsByClassName(origineClasseName+  ' '+ enabledClasseName)
					for (let j = 0;j<allup.length;j++){
						allup[j].classList.remove(enabledClasseName)
					}
					actionItems[i] === "link" ? window.open(urlItems[i]) : event.target.classList.add(enabledClasseName) 
				}
			)
	
			footeritems.appendChild(bouttonitem)
			footer.appendChild(footeritems)
	}
}
function capital(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}