"use strict";
// menu footer
let footerItems = ['options','info','muzicbrainz','github','fontawesome','awesome']
let actionItems = ['modal','link','link','link','link','link']
for (let i = 0;i<footerItems.length;i++){
		let item = footerItems[i] + '_link'
		document.querySelector('#'+item).addEventListener(
			'click',
			function(event){
				let forlater = document.querySelector('#'+event.target.id)
				let lesActifs = document.querySelector('.active')
				if (lesActifs) {
					lesActifs.classList.remove("active")
				}
				event.target.classList.add("active")
			}
		)
}
