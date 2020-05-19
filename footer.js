"use strict";
// menu footer
let footerItems = ['info','muzicbrainz','github','fontawesome','awesome']
for (let i = 0;i<footerItems.length;i++){
	// document.querySelector('#'+footerItems).addEventListener(}
		let item = footerItems[i] + '_link'
		document.querySelector('#'+item).addEventListener(
			'click',
			function(event){
				let later = document.querySelector('#'+event.target.id)
				// console.log(event.target)
				let lesActifs = document.querySelector('.active')
				if (lesActifs) {
					lesActifs.classList.remove("active")
				}
				event.target.classList.add("active")
			}
		)
}
