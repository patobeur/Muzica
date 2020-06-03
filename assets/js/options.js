"use strict";
let limiter = [25,50,75,100]
let modalOptions = document.createElement("div")
modalOptions.id = "options_modal"
modalOptions.className = "options_modal-fs"



let modaldialog = document.createElement("div")
modaldialog.id = "options-modal-cadre"
modaldialog.className = "options-modal-cadre"
// modaldialog.setAttribute('role', 'document')
	let modalcontent = document.createElement("div")
	modalcontent.id = 'options-contenu-modal'
	modalcontent.className = "options-modal-contenu"
	modalcontent.textContent = "Some stuff here in the future !"
modaldialog.appendChild(modalcontent)
modalOptions.appendChild(modaldialog)

for (let i = 0; i< limiter; i++){
	let limittechoice = document.createElement("div")
	modaldialog.id = "options-modal-cadre"
	modaldialog.className = "options-modal-cadre"

}




document.body.appendChild(modalOptions)
console.log('ok modal options')