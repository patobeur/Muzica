let containertableau = document.querySelector('#contents')
let buttontop = document.querySelector('#scroll-to-top')
containertableau.addEventListener('scroll',(e) => {
		if (e.target.scrollTop > 200){
			 buttontop.classList.remove('eteint')
		}
		else {
			buttontop.classList.add('eteint')
		}
	}
)
buttontop.addEventListener('click',(e) => {
	console.log(containertableau.scrollTop)
	for (let i = containertableau.scrollTop; i > 1; i=i-1){
	// for (let i = containertableau.scrollTop; i > 1; i=Math.floor(i/2)){
		// console.log(i)
		setTimeout(containertableau.scrollTo(0,Math.floor(i)), 1*1000);
	}
	
	// containertableau.scrollTo(10,0);
	}
)