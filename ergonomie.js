"use strict";

let footerItems = ['info','muzicbrainz','github','fontawesome','awesome']
for (let i = 0;i<footerItems.length;i++){
	// document.querySelector('#'+footerItems).addEventListener(}
		let item = footerItems[i] + '_link'
		document.querySelector('#'+item).addEventListener(
			'click',
			function(event){
				let later = document.querySelector('#'+event.target.id)
				// console.log(event.target)
				let lesactives = document.querySelector('.active')
				if (lesactives) {
					lesactives.classList.remove("active")
				}
				event.target.classList.add("active")
			}
		)

}
