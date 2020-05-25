"use strict";

document.querySelector('.marecherche').addEventListener('focus', function(event){
	if (window.innerWidth < 576) document.querySelector(".searchbloc").style.marginTop = '0'
	if (window.innerWidth > 575) document.querySelector(".searchbloc").style.marginTop = null
	}
)
document.querySelector('.marecherche').addEventListener('blur', function(event){
			document.querySelector('.searchbloc').style.marginTop = null;
	}
)
document.querySelector('#maselection').addEventListener('blur', function(event){
			document.querySelector('.searchbloc').style.marginTop = null;
	}
)
document.querySelector('#maselection').addEventListener(
	'focus',
	function(event){
		console.log('focus')
		console.log(window.innerWidth)
		// if ( window.innerWidth < 576){
			document.querySelector('.searchbloc').style.marginTop = '0'
		// }
	}
)
