"use strict";


class Muzica {
	constructor (muzica)
	{
		this.Version = 7
		console.groupCollapsed('muzica'+ 'V' + this.Version + '.js')
		console.log('constructor()')
		// console.trace()
		//
		this.Debug = true 								// affiche en console si true
		this.NbSubmitDie = 5							// nb max de submit si recherche vide avant de bloquer
		this.NbSubmitMax = 3							// nb max de submit si recherche vide
		this.NbSubmit = 0									// nb couranbt de recherche vide
		// info nav
		this.LimitPerPage = 200						// nb couranbt de recherche videoffset
		this.ActualOffset = 1									// nb couranbt de recherche videoffset
		this.NbReponses = 0
		this.NbPages = 0
		//
		this.InputSearch = 'marecherche' 	// contenu du value dans le input recherche
		this.InputSubmit = 'rechercher' 	// contenu du value dans le submit 
		this.InputSelect = 'maselection'	// contenu du value dans le option select
		// this.IconeVoirAlbum = 'far fa-eye'
		// this.IconeVoirAlbum = 'fas fa-plus-square'
		this.IconeVoirAlbum = 'fas fa-plus-circle'
		//
		this.ReponseReq = ''									
		this.MaSelection = 'default'
		this.MaRecherche = ''
		this.TypeActuel = ''
		this.ReqActuel = ''
		this.FullColonnes = []
		this.ReponseHtml = ''
		this.UrlDemandee = ''
		this.NbReponses = 0
		this.nodata = 'no data'
		
		this.vinyl_Buton = true// n'apparait pas lors de la recherche si true 
		this.vinyl_enabled = true 
		this.vinyl_searching = false // true si recherche en cours
		
		this.UrlDemandeeAlbum = ''
		this.IdDemandeeAlbum = ''
		//
		this.UrlDatas = {
			"methode"		: 'GET',
			"url"				: 'https://musicbrainz.org/ws/2/',
			"inc"				: '/?fmt=json'+'&query='
		}
		//
		this.Famillia = 
		{
			'default': {
				"name": 					"default",
				"texteselect": 		"EveryThing",//Artist,Title,Album (artist,release,recording)",
				"type": 					"recording",
				"SearchCategorie":"recordings",
				"intitules": 			["#","artist","title","album","actions"],
				"SearchTag": 			["artist","release","recording"]
			}
			,'artist': {
				"name": 					"artist",
				"texteselect": 		"Artiste",// (artist)",
				"type": 					"recording",
				"SearchCategorie":"recordings",
				"intitules": 			["#","artist","title","album","actions"],
				"SearchTag": 			["artist","release","recording"]
			}
			,'recording': {
				"name": 					"recording",
				"texteselect": 		"Title",// (recording)",
				"type": 					"recording",
				"SearchCategorie":"recordings",
				"intitules": 			["#","artist","title","album","actions"],
				"SearchTag": 			["artist","release","recording"]
			}
			,'release': {
				"name": 					"release",
				"texteselect":	 	"Album",// (release)",
				"type": 					"recording",
				"SearchCategorie":"recordings",
				"intitules": 			["#","artist","title","album","actions"],
				"SearchTag": 			["artist","release","recording"]
			}
		}
		
		// http://musicbrainz.org/ws/2/recording/?fmt=json&query=artist:"Daft punk" OR release:"Daft punk" OR recording:"Daft punk"&limit=25
		// http://musicbrainz.org/ws/2/recording/?fmt=json&query=artist:"Daft punk"&limit=25
		// https://musicbrainz.org/ws/2/recording/?fmt=json&query=artist:"Daft%20punk"&limit=50
		// http://musicbrainz.org/ws/2/recording/?fmt=json&query=recording:"Daft punk"&limit=25
		// http://musicbrainz.org/ws/2/recording/?fmt=json&query=release:"Daft punk"&limit=25
		// https://musicbrainz.org/ws/2/recording/?fmt=json&query=artist:"Daft%20punk" OR release:"Daft%20punk" OR recording:"Daft%20punk"&limit=50


		//,'event':{"texte":"Événement","type":"event","SearchCategorie":"events","champs":[],"and":[]}
		//,'release_group':{"texte":"Groupedeparution","type":"release_group","SearchCategorie":"release_groups","champs":[],"and":[]}
		//,'work':{"texte":"Œuvre","type":"work","SearchCategorie":"works","champs":[],"and":[]}
		//,'instrument':{"texte":"Instrument","type":"instrument","SearchCategorie":"instruments","champs":[],"and":[]}
		//,'label':{"texte":"Label","type":"label","SearchCategorie":"label","champs":[],"and":[]}
		//,'place':{"texte":"Lieu","type":"place","SearchCategorie":"places","champs":[],"and":[]}
		//,'area':{"texte":"Everything","type":"area","SearchCategorie":"areas","champs":[],"and":[]}
		//,'annotation':{"texte":"Annotation","type":"annotation","SearchCategorie":"annotations","champs":[],"and":[]}
		//,'tag':{"texte":"Tag","type":"tag","SearchCategorie":"tags","champs":[],"and":[]}
		//,'cdstub':{"texte":"ÉbauchedeCD","type":"cdstub","SearchCategorie":"cdstubs","champs":[],"and":[]}
		//,'editor':{"texte":"Éditeur","type":"editor","SearchCategorie":"editors","champs":[],"and":[]}
		//,'doc':{"texte":"Documentation","type":"doc","SearchCategorie":"docs","champs":[],"and":[]}
		//
		this.lesanciennesrecherches = []
		console.groupEnd()
	}

	ConsolEtMio()
	{
		// switch(type)
		// {
		// 	case 'gs':
				
		// }
	}

	AjouterAuxAnciennesRecherches(datas){
		this.lesanciennesrecherches.push(
			{
				"date": this.Get_Date(),
				"recherche": datas[0],
				"maselection": datas[1],
				"nbreponse": datas[2]
			}
		)
	}
	
	Listener(){
		console.groupCollapsed('Mise en place des "EventListener"')
		console.trace()
		let ThisClone = this
		document.getElementById('rechercher').addEventListener(
			'submit',
			function(event)
			{
				event.preventDefault()
				
				console.clear()
				console.log('rechercher cliqué -> remise a zero')
				ThisClone.StartFromScratch() // remise a zero
				if (ThisClone.IsActif()){
					// getting search words in input
					let marecherche = document.querySelector('#'+ThisClone.InputSearch).value;
					if (marecherche && marecherche != '')
					{
						console.log('Recherche lancée')
						ThisClone.Set_This('Set_CleanNewSearch','ActualOffset',1) 											// stockage
						ThisClone.Set_This('Listener:','MaRecherche',ThisClone.Set_CleanString(marecherche)) 							// stockage
						ThisClone.GetRecordings()
					}
					else
					{
						console.log('Recherche Vide')
					}
				}
			}
		)
		// champs recherche
		document.querySelector('#'+ThisClone.InputSelect).addEventListener(
			'change',
			function(event){

				console.clear()
				var index = event.target.selectedIndex;
				// Rapporter cette donnée au <p>
				// pElem.innerHTML = 'selectedIndex: ' + index;
	
				let ladiv = document.querySelector('#'+ThisClone.InputSelect)
				var MaSelection = ThisClone.Set_CleanString(event.target.value)
				if (MaSelection && MaSelection != '')
				{
					ThisClone.Set_This('Listener','MaSelection',MaSelection) 								// stockage
					ThisClone.Set_This('Set_CleanNewSearch','ActualOffset',1) 											// stockage
					ThisClone.Set_CleanNewSearch()
					// event.target.listinde [index].setAttribute('toto',titi)
					event.target[index].setAttribute('selected', true)
					console.log(event.target[index])
				}
			}
		)
		// champs recherche
		// document.querySelector('#'+ThisClone.InputSelect).addEventListener(
		// 	'change',
		// 	function(event){
		// 		let ladiv = document.querySelector('#'+ThisClone.InputSelect)
		// 		var MaSelection = ThisClone.Set_CleanString(ladiv.value)
		// 		if (MaSelection && MaSelection != '')
		// 		{
		// 			console.clear()
		// 			console.log('MaSelection.selectedIndex')
		// 			console.log(MaSelection.selectedIndex)
		// 			console.log('MaSelection.selectedIndex')
		// 			ThisClone.Set_This('Listener','MaSelection',MaSelection) 								// stockage
		// 			ThisClone.Set_This('Set_CleanNewSearch','ActualOffset',1) 											// stockage
		// 			ThisClone.Set_CleanNewSearch()
		// 		}
		// 	}
		// )
		// document.querySelector('#'+this.InputSearch).addEventListener(
		// 	'keyup',
		// 	function(event){
		// 		var marecherche = ThisClone.Set_CleanString(document.querySelector('#'+ThisClone.InputSearch).value)
		// 		if (marecherche && marecherche != '')
		// 		{
		// 			console.clear()
		// 			ThisClone.Set_CleanNewSearch()
		// 			ThisClone.Set_This('Listener','marecherche',marecherche) 								// stockage
		// 			console.log('Recherche lancée')
		// 			ThisClone.GetRecordings()
		// 		}
		// 	}
		// )


		document.querySelector('#vinyl-bouton').addEventListener(
			'click',
			function(event){
					ThisClone.MyOldVinylButon()
			}
		)
		

		console.groupEnd()
	}

	// Setters
	Set_Pagination(){
		let bloc = ''
		if (this.NbReponses < 1)
		{
			if (document.querySelector('#pagination'))
			{
				let aEffacer = document.querySelector('#pagination')
				aEffacer.parentNode.removeChild(aEffacer)
			}
		}
		else if (this.NbReponses > this.LimitPerPage)
		{
			// console.log(this.NbReponses + 'sdf ' + this.LimitPerPage + ' = ' + this.NbPages )
			// this.LimitPerPage = 100						// nb couranbt de recherche videoffset
			// this.ActualOffset = 0									// nb couranbt de recherche videoffset
			// this.NbReponses = 0
			// this.NbPages = 0

			// pagination group
			var pagination = document.createElement("nav")
			pagination.id = 'pagination'
			pagination.className = 'pagination justify-content-center'
			pagination.setAttribute('aria-label', 'Page navigation example')
				// pagination button group
				var pag_buttons = document.createElement("ul")
				pag_buttons.className = 'pagination justify-content-end pagination-sm'
			
					// previous
					var pag_previous = document.createElement("li")
					pag_previous.className = 'page-item' + (this.ActualOffset < this.LimitPerPage ? ' disabled' : '')
						var pag_previous_link = document.createElement("a")
						pag_previous_link.className = 'page-link'
						pag_previous_link.setAttribute('href', '#')
						pag_previous_link.setAttribute('tabindex', '-1')
						pag_previous_link.setAttribute('aria-disabled', 'true')
						pag_previous_link.innerHTML = 'Previous'
					pag_previous.appendChild(pag_previous_link)
					if (this.ActualOffset > this.LimitPerPage)
					{
						let ThisClone = this
						pag_previous.addEventListener(
							'click',
							function ChangePagePrevious(e){
								
								//console.log('fff'+ThisClone.IdDemandeeAlbum)
								
								ThisClone.Set_This( 'Set_Pagination','ActualOffset', (ThisClone.ActualOffset - ThisClone.LimitPerPage) ) 	// stockage
								ThisClone.GetRecordings()
								
							},
							{once:false}
						)
					}
					pag_buttons.appendChild(pag_previous)

					// page link
					this.NbPages = Math.trunc((this.NbReponses/this.LimitPerPage))
					console.log('this.LimitPerPage')
					console.log(this.LimitPerPage)
					console.log('this.NbReponses')
					console.log(this.NbReponses)
					console.log('this.NbPages')
					console.log(this.NbPages)

					let max = (this.NbPages > 1) ? (this.NbPages < 10) ? this.NbPages+1 : 10 : this.NbPages
					for (let i=0; i < max ; i++){
						let title = 'page ' + ( ( this.LimitPerPage * i ) + 1 ) + ' à ' + ( ( this.LimitPerPage * ( i + 1 ) ) + 1 )
						
						let ThisClone = this
						// buttonpage = buttonpage  + '<li class="page-item"><a class="page-link" href="#" title="' + title + '">' + ( ( this.LimitPerPage * i ) + 1 ) + '</a></li>'
						
						var pag_button = document.createElement("li")
						console.log('--------ActualOffset-------')
						console.log(this.ActualOffset)
						if (((this.LimitPerPage*i)+1) == this.ActualOffset)
						{

						console.log('---------A----------------')
						console.log((this.LimitPerPage*i)+1)
						console.log('---------A----------------')
						}
						pag_button.className = 'page-item' + (((( this.LimitPerPage*i)+1) == this.ActualOffset) ? ' active' : '' )

						// version button
						// let itembutton = document.createElement("button")
						// itembutton.setAttribute('title', title)
						// itembutton.innerHTML = ( ( this.LimitPerPage * i ) + 1 )
						// itembutton.className = 'btn btn-secondary btn-sm'	
						// 	var iconebutton = document.createElement("i")
						// 	iconebutton.className = ThisClone.IconeVoirAlbum + ' voirlafiche'
						// 	itembutton.appendChild(iconebutton)
						// pag_button.appendChild(itembutton)
						
						var pag_button_link = document.createElement("a")
						pag_button_link.className = 'page-link'
						pag_button_link.setAttribute('href', '#')
						pag_button_link.setAttribute('title', title)
						pag_button_link.innerHTML = ( ( this.LimitPerPage * i ) + 1 )
						
						pag_button.appendChild(pag_button_link)

						pag_button.addEventListener(
							'click',
							function ChangePage(e){
								ThisClone.Set_This( 'Set_Pagination','ActualOffset',((ThisClone.LimitPerPage * i ) + 1) ) 	// stockage
								ThisClone.GetRecordings()
							},
							{once:false}
						)
						pag_buttons.appendChild(pag_button)
					}

					// NEXT
					//
					var pag_next = document.createElement("li")
					pag_next.className = 'page-item' + (this.ActualOffset <= (this.NbReponses - this.LimitPerPage) ? '' : ' disabled')
						var pag_next_link = document.createElement("a")
						pag_next_link.className = 'page-link'
						pag_next_link.setAttribute('href', '#')
						pag_next_link.innerHTML = 'Next'
					pag_next.appendChild(pag_next_link)
					if (this.ActualOffset < (this.NbReponses - this.LimitPerPage))
					{
						let ThisClone = this
						pag_next.addEventListener(
							'click',
							function ChangePageNext(e){
								
								//console.log('fff'+ThisClone.IdDemandeeAlbum)
								
								ThisClone.Set_This( 'Set_Pagination','ActualOffset', (ThisClone.LimitPerPage + ThisClone.ActualOffset) ) 	// stockage
								ThisClone.GetRecordings()
								
							},
							{once:false}
						)
					}
					pag_buttons.appendChild(pag_next)

			// regroupement
			pagination.appendChild(pag_buttons)

			// 
			if (document.querySelector('#pagination'))
			{
				let aEffacer = document.querySelector('#pagination')
				aEffacer.parentNode.removeChild(aEffacer)
				document.querySelector('#cardtable').prepend(pagination)
			}
			else{
				document.querySelector('#cardtable').prepend(pagination)
			}
		}
	}

	Set_FullUrl(){
		console.group('Set_FullUrl: by ' + this.Famillia[this.MaSelection]['SearchTag'])
		let limit = "&limit=" + this.LimitPerPage; 
		let fullsearch = ''; 
		if (this.MaSelection == 'default')
		{
			for (let i = 0; i < this.FullColonnes.length; i++)
			{
				// fullsearch = fullsearch + (i>0 ? ' OR ' : '') + this.FullColonnes[i] + ':' + this.MaRecherche
				fullsearch = fullsearch + (i>0 ? ' OR ' : '') + this.FullColonnes[i] + ':' + '"' + this.MaRecherche + '"'
			}
		}
		else{
			fullsearch = this.MaSelection + ':"' + this.MaRecherche + '"'
		}

		this.Set_This('Set_FullUrl','UrlDemandee',this.UrlDatas.url + this.TypeActuel + this.UrlDatas.inc + fullsearch + limit + '&offset=' + this.ActualOffset) 	// stockage
		console.groupEnd()
	}
	
	Set_FullUrlAlbum(){
		//console.group('Set_FullUrlAlbum')
		this.Set_This('Set_FullUrlAlbum','UrlDemandeeAlbum',this.UrlDatas.url + this.TypeActuel + this.UrlDatas.inc + 'id:' + this.IdDemandeeAlbum) 	// stockage
		console.log('url:'+this.UrlDemandeeAlbum)
		//console.groupEnd()
	}

	Set_This(Func, Nom, Value){
		var oldValue = this[Nom]
		this[Nom] = Value
		//console.log('(' + Func + ') Set_(' + Nom + ': "' + oldValue + '" to "' + Value + '")')
	}

	Set_NbSubmitPlus1(){
		this.NbSubmit = this.NbSubmit + 1
		//console.log('NbSubmit:' + this.NbSubmit)
	}

	// Getters
	Get_This(Func, Nom){
		console.log('(' + Func + ') Get_(' + Nom + '="' + this[Nom] + '")')
		return this[Nom]
	}
	
	GetRecordings(){
		console.groupCollapsed('GetRecordings')
		// console.trace('GetRecordings')
		this.initialise
		this.Set_NbSubmitPlus1()	// incrementation
		this.Set_CleanNewSearch()	// update and/or reset old datas
		this.Set_FullUrl()				// set new url with clean data
		// this.Make_BarProgress(0)

		this.Set_This('GetRecordings','vinyl_searching',true)		
		if (this.vinyl_Buton){
			this.MyOldVinyl(true)
		}

		var MonPost = new XMLHttpRequest()
		MonPost.open(this.UrlDatas.methode, this.UrlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		let ThisClone = this
		MonPost.onreadystatechange = function() {
			console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status)
			let chargement = (MonPost.readyState * 25)
			// ThisClone.Make_BarProgress(chargement)

			// ThisClone.MyOldVinylOpacity((MonPost.readyState * 25)/100)

			if(MonPost.readyState == 4 && MonPost.status == 200) {
				let resultat = JSON.parse(MonPost.responseText)
				ThisClone.Set_This('GetRecordings','ReponseReq',resultat) 									// stockage
				// ThisClone.Set_This('GetRecordings','NbReponses',resultat[ThisClone.ReqActuel].length) 												// stockage
				

				ThisClone.AjouterAuxAnciennesRecherches([ThisClone.MaRecherche,ThisClone.UrlDemandee,ThisClone.NbReponses])
				// set nagigation
				ThisClone.Set_This('GetRecordings','NbReponses',ThisClone.ReponseReq.count) 												// stockage
				// console.log(ThisClone.NbReponses)
				console.log('errurrrrrrrrrrrrrrrrrrr')
				console.log(ThisClone.NbReponses)

				console.log('----------------------')
				console.log(ThisClone.ReponseReq)
				console.log('----------------------')

				if (ThisClone.vinyl_Buton && ThisClone.vinyl_searching){
					ThisClone.MyOldVinyl(false)
				}	
				ThisClone.Set_This('GetRecordings','vinyl_searching',false)	

				ThisClone.RefreshReponsesTable()
			}
		}
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		MonPost.send()
		console.groupEnd()
	}
	GetAlbums(lesreleases){
		console.clear()
		// console.groupCollapsed('GetAlbums')
		// console.trace('GetAlbums')
		this.initialise
		this.Set_FullUrlAlbum()							// set new url with clean data
		this.Make_Modal(lesreleases)
		
		/*
		this.Set_FullUrlAlbum()
		UrlDemandeeAlbum
		this.RefreshReponsesTable()

		*/
		
		// this.Make_BarProgress(0)
		// var MonPost = new XMLHttpRequest()
		// MonPost.open(this.UrlDatas.methode, this.UrlDemandeeAlbum, true)
		// MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		//MonPost.Headers.Add("User-Agent", (someone@yahoo.com"));

		// let ThisClone = this


		// MonPost.onreadystatechange = function() {
		// 	console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status)
		// 	// let chargement = (MonPost.readyState * 25)
		// 	// ThisClone.Make_BarProgress(chargement)
			
		// 	if(MonPost.readyState == 4 && MonPost.status == 200) {
		// 		ThisClone.Set_This('GetAlbums','reponseAlbums',JSON.parse(MonPost.responseText)) 									// stockage
		// 		// ThisClone.Set_This('GetAlbums','NbReponsesAlbums',ThisClone.ReponseReq.count) 												// stockage
		// 		// ThisClone.AjouterAuxAnciennesRecherches([ThisClone.MaRecherche,ThisClone.UrlDemandee,ThisClone.NbReponses])
		// 		console.log(ThisClone.reponseAlbums)
		// 		// console.log(ThisClone.ReponseReq)
		// 		// ThisClone.RefreshReponsesTable()
				// var modalbody = document.querySelector("#"+"lesalbums")		
				// modalbody.innerHTML = modalbody.innerHTML + '<br>'+ ThisClone.reponseAlbums.count + ' réponse' + ((ThisClone.reponseAlbums.count > 1) ? 's' : '')
				// modalbody.innerHTML = 'listereleased'


		// 	}
		// }
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		// MonPost.send()



		// console.groupEnd()
	}

	Get_Date(){
		// var aujourdhui = Date.now()
		var today = new Date()
		return today.getDate() + '-' +
			today.getMonth() + '-' +
			today.getFullYear() + ' ' +
			today.getHours() + ':' +
			today.getMinutes() + ':' +
			today.getSeconds() + ':'
		;
	}

	// Makers
	Set_CleanString(value) 
	{
		if(value != '' && value != false && value != null)
		{
			if (value.length < 1) return false 		// 'texte trop cour';
			if (value.length > 50) return false 	// 'texte trop long';
			return encodeURIComponent(value)
		}
	}

	Set_CleanNewSearch(){
		console.groupCollapsed('Set_CleanNewSearch: ' + this.MaSelection)
		this.Set_This('Set_CleanNewSearch','TypeActuel',this.Famillia[this.MaSelection].type) 					// stockage
		this.Set_This('Set_CleanNewSearch','ReqActuel',this.Famillia[this.MaSelection].SearchCategorie) // stockage
		this.Set_This('Set_CleanNewSearch','FullColonnes',this.Famillia[this.MaSelection].SearchTag) 		// stockage
		this.Set_This('Set_CleanNewSearch','ReponseHtml','') 																						// stockage
		this.Set_This('Set_CleanNewSearch','ReponseReq','') 																						// stockage
		console.groupEnd()
	}

	Make_SelectMenu(){
		console.groupCollapsed('Make_SelectMenu')
		var indexfamillia = this.Famillia
		var MenuFamillia = document.querySelector('#maselection')		
		for (var datas in indexfamillia)
		{
			var MenuOption = document.createElement("option")
			MenuOption.text = indexfamillia[datas]['texteselect']
			MenuOption.value = indexfamillia[datas]['name']

			console.log(indexfamillia[datas]['name'] + '>' + indexfamillia[datas]['texteselect'])
			MenuFamillia.add(MenuOption)
			
		}
		MenuFamillia.selectedIndex = 0
		console.groupEnd()
	}

	// Checkers
	IsActif(){
		return this.NbSubmit <= this.NbSubmitDie ? true : false
	}

	StartFromScratch()
	{
		this.Set_This('StartFromScratch','ReponseHtml','') 																						// stockage
		this.Set_This('StartFromScratch','ReponseReq',null) 																							// stockage
		this.Set_This('StartFromScratch','NbSubmit',0) 																								// stockage remise à zero des tentative de recherches vides
		this.Set_This('StartFromScratch','MaRecherche','') 																						// stockage
		// this.Set_This('StartFromScratch','MaSelection',null) 																					// stockage
	}

	TableauHtml()
	{
		if (this.ReponseReq)
		{
			// table body
			var tbody = document.createElement("tbody")
			let datas = this.ReponseReq[this.ReqActuel]
			let ligneId =  this.ActualOffset

			for ( var Objet of datas)
			{
				var trbody = document.createElement("tr")
				
				// line number col
				var item = document.createElement("td")
				item.setAttribute('title', 'artist-credit-id : ' + Objet['artist-credit'][0]['artist']['id'])
				item.className = 'idline'
				item.innerHTML = (ligneId)
				trbody.appendChild(item)

				// artist col
				var item = document.createElement("td")
				item.innerHTML = (Objet['artist-credit'] && Objet['artist-credit'][0]) ? Objet['artist-credit'][0].name :'vide'
				trbody.appendChild(item)

				// title col
				var item = document.createElement("td")
				item.innerHTML = Objet['title']
				trbody.appendChild(item)

				// album col
				var item = document.createElement("td")
					// liste release album col
					let nbreleased = 0
					if (Objet['releases']){
						let listereleased = 'L#' + ligneId + "\n"
						for (var released in Objet['releases']){
							let lesreleases = Objet['releases'][released]
							listereleased = listereleased +
								'' + lesreleases['count'] +
								' / ' + lesreleases['title'] +
								' (' + lesreleases['status'] + ')' +
								' [https://ia802605.us.archive.org/10/items/mbid-'+ lesreleases['id'] + ']' +
								"\n"
								nbreleased =  nbreleased + lesreleases['count']
						}
						item.setAttribute('title', listereleased)
					}
					else{
						// pas de release

					}
				item.innerHTML = (Objet['releases'] && Objet['releases'][0]) ? Objet['releases'][0].title + ' ('+ nbreleased + ')' : this.nodata
				trbody.appendChild(item)


				// actions col
				var item = document.createElement("td")
				item.className = 'actions'
					let	ThisClone = this
					let itembutton = document.createElement("button")
					itembutton.setAttribute('recording_id', Objet.id)
					
					if (Objet['releases']){
						let LeRelease = Objet
						// let toto = Objet['releases']
						itembutton.addEventListener(
							'click',
							function Modal(e){
								ThisClone.IdDemandeeAlbum = Objet.id

								ThisClone.GetAlbums(LeRelease)
							},
							{once:false}
						)
					}


					itembutton.className = 'btn btn-dark'		
						var iconebutton = document.createElement("i")
						iconebutton.className = ThisClone.IconeVoirAlbum + ' voirlafiche'
						itembutton.appendChild(iconebutton)
					item.appendChild(itembutton)
				trbody.appendChild(item)


				tbody.appendChild(trbody)
				
				ligneId++
			}

			return tbody

		}
		else
		{
			return 'vide'
		}
	}

	Make_Modal(listereleased){
		console.log(listereleased)
		if (!document.querySelector('#modalalbum'))
		{
			var modalalbum = document.createElement("div")
			modalalbum.id = "modalalbum"
			modalalbum.className = "fullscreen"
				
				var modaldialog = document.createElement("div")
				modaldialog.id = "modaldialog"
				// modaldialog.className = "modal-dialog"
				modaldialog.setAttribute('role', 'document')
					var modalcontent = document.createElement("div")
					modalcontent.id = "modal-content"
					modalcontent.className = "modal-content"
						
						
						// var modalbody = document.createElement("div")
						// modalbody.id = "modalbody"
						// modalbody.className = "modal-body"
						// modalbody.innerHTML = 'Informations'
						
						// tag,destId,leString,lId,laClass
						


						// MODAL CONTENT
						// modalcontent.appendChild(modalheader)

						// this.ifreleases(listereleased)

						
						// END MODAL CONTENT
							
						modaldialog.appendChild(modalcontent)
						modalalbum.appendChild(modaldialog)

						
						
						
						
					//	https://musicbrainz.org/ws/2/release/?fmt=json&query=artist:"Daft%20punk" AND release:fc1eb6d6-1c46-429a-8332-4f881c541ae7&limit=200&offset=1
						
						//https://ia800906.us.archive.org/5/items/mbid-fc1eb6d6-1c46-429a-8332-4f881c541ae7/mbid-fc1eb6d6-1c46-429a-8332-4f881c541ae7-11707693118_thumb500.jpg
						
						document.body.appendChild(modalalbum)
						this.ModalAddHeader('div','modal-content',(listereleased['artist-credit'] && listereleased['artist-credit'][0]) ? listereleased['artist-credit'][0].name + '-' + listereleased['title'] + "(" + (listereleased['score']) + "%) " + "(" + (listereleased['isrcs']) + ")":'vide')
						this.ModalAddContent('div','modal-content',"Informations",'modalinfo','modal-body')


						// this.ModalAddContent('div','modal-content',(listereleased['artist-credit']) ? "Title - " + listereleased['artist-credit'].name + '-' + listereleased['title'] :'vide','modaltitre','modal-body-content')

						for (let released in listereleased['releases']){
							let item = listereleased['releases'][released]
							console.log("ici:"+item)
							this.ModalAddContent('div','modal-content',		"Title - " + 	( (item['title']) ? item['title']  : 'vide' ),'modaltitre','modal-body-content')
							this.ModalAddContent('div','modal-content',		"Artist - " + ( (item['artist-credit']) ? item['artist-credit'][0].name : 'vide' ),'modalartist','modal-body-content')
							this.ModalAddContent('div','modal-content',		"Album - ???",'modalartist','modal-body-content')
							this.ModalAddContent('div','modal-content',		"Genres - ???",'modalartist','modal-body-content')
							this.ModalAddContent('div','modal-content',		"Length - " + ( (item['length']) ? item['length'] : 'vide'),'modalartist','modal-body-content')
						
						}
						
						this.ModalAddFooter('div','modal-content')
						// var modalbody = document.querySelector("#"+"modalbody")				
						// var enplus = document.createElement("div")
						// enplus.id = "lesalbums"
						// enplus.className = "lesalbums"
						// enplus.innerHTML = this.IdDemandeeAlbum + '<br>'+ this.UrlDemandeeAlbum
						// modalbody.appendChild(enplus)


						// var modalbody = document.querySelector("#"+"lesalbums")	
						// modalbody.innerHTML = listerel

						// modaltitle.innerHTML = (listereleased['artist-credit'] && listereleased['artist-credit'][0]) ? listereleased['artist-credit'][0].name + '-' + listereleased['title'] :'vide'
		}
	}
	ModalAddHeader(tag,destId,leString){
		let Cible = document.querySelector('#'+destId)
		
						// FOOTER
						var modalheader = document.createElement(tag)
						modalheader.className = "modal-header"
							var modaltitle = document.createElement("h5")
							modaltitle.id = "ModalLabel"
							modaltitle.className = "modallabel"
							// modaltitle.innerHTML = "Détail de la sélection"
							modaltitle.innerHTML = "Titre"
							//refresh title
							modaltitle.innerHTML = leString
							
								var modalbutton = document.createElement("button")
								modalbutton.id = "ModalClose"
								modalbutton.className = "close"
								modalbutton.setAttribute('type', 'button')
								modalbutton.setAttribute('data-dismiss', 'modal')
								modalbutton.setAttribute('aria-label', 'Close')
								modalbutton.addEventListener(
									'click',
									function Del_Modal(e){
										let aEffacer = document.querySelector('#modalalbum')
										aEffacer.parentNode.removeChild(aEffacer)
									},
									{once:true}
								)
								// modalbutton.innerHTML = "Détail de la sélection"
									var modalclose = document.createElement("i")
									modalclose.className = "fas fa-window-close"
									modalclose.setAttribute('aria-hidden', 'true')

									modalbutton.appendChild(modalclose)
									
						modalheader.appendChild(modaltitle)
						modalheader.appendChild(modalbutton)
						// END FOOTER
						
			Cible.appendChild(modalheader)
	}
	ModalAddFooter(tag,destId){
		let Cible = document.querySelector('#'+destId)
		
						// FOOTER
						var modalfooter = document.createElement(tag)
						modalfooter.className = "modal-footer"
							var modalannuler = document.createElement("button")
							modalannuler.className = "btn btn-secondary"
							modalannuler.innerHTML = 'Annuler'
							modalannuler.setAttribute('type', 'button')
							modalannuler.setAttribute('data-dismiss', 'modal')
							var modalfermer = document.createElement("a")
							modalfermer.className = "btn btn-primary"
							modalfermer.innerHTML = 'Fermer'
							modalfermer.setAttribute('href', '#')
							modalfermer.addEventListener(
								'click',
								function Del_Modal(e){
									let aEffacer = document.querySelector('#modalalbum')
									aEffacer.parentNode.removeChild(aEffacer)
								},
								{once:true}
							)
						modalfooter.appendChild(modalannuler)
						modalfooter.appendChild(modalfermer)

						
			Cible.appendChild(modalfooter)
						// END FOOTER
	}
	/**
	 * modalcontent(tag,destId,leString,lId,laClass)
	 * 
	 */
	ModalAddContent(tag,destId,leString,lId,laClass,lIcone=null){
		console.log("	AddContent: " + leString)
		let Cible = document.querySelector('#'+destId)
		if (Cible){
			let ajout = document.createElement(tag)
				ajout.id = lId
				ajout.className = laClass
				ajout.innerHTML = leString
				if(lIcone){
					let icone = document.createElement('i')
					icone.className = 'fas fa-record-vinyl'
					ajout.prepend(icone)
				}
				
			Cible.appendChild(ajout)
		}
		else{
			console.log('div [' + destId + '] n\'existe pas')
		}

	}		

	ifreleases(datas){
								
		if (datas){
			var modalbody = document.querySelector("#"+"lesalbums")	
			console.log('listereleased')
			console.log(datas)
			let listerel = ''	
			for (var released in datas){

				var modalletitre = document.createElement("div")
				// modalreleases.id = "modalbody"
				modalletitre.className = "modal-body-content"
				modalletitre.innerHTML = 'Title - '
				// modalcontent.appendChild(modalletitre)

																																																			// 	console.log(released)
																																																			// 	let laRelease = datas[released]
																																																			// 	listerel = listerel +
																																																			// 		'' + laRelease['count'] +
																																																			// 		' / ' + laRelease['title'] +
																																																			// 		' (' + laRelease['status'] + ')' +
																																																			// 		' [https://musicbrainz.org/ws/2/release/'+ laRelease['id'] + ']' +
																																																			// 		// ' <img src="https://musicbrainz.org/ws/2/release/'+ laRelease['id'] + '/mbid-'+ laRelease['id'] + '.jpg"></img>' +
																																																			// 		"\n"
																																																			// 		// nbreleased =  nbreleased + laRelease['count']
			}
			modalbody.innerHTML = listerel
		}
	}

	// SPINNER VINYL
	MyOldVinylButon(){
		let vinylactivity = document.querySelector('#vinyl-bouton-content')
		let spinnervinyl = document.querySelector('#spinnervinyl')
		if (this.vinyl_Buton){
			vinylactivity.innerHTML = " Spin is Off"
			this.Set_This('vinyl-bouton','vinyl_Buton',false)
			this.MyOldVinyl(false)
			console.log('vinyl_Buton:' + this.vinyl_Buton)
			spinnervinyl.classList.add("disabled")
			// spinnervinyl.classList.remove("spinning")
		}
		else{
			vinylactivity.innerHTML = " Spin is ON"
			this.Set_This('vinyl-bouton','vinyl_Buton',true)
			console.log('vinyl_Buton:' + this.vinyl_Buton)
			spinnervinyl.classList.remove("disabled")
			// spinnervinyl.classList.add("spinning")
		}
	}

	MyOldVinylOpacity(centage){
		console.log(centage)
		let vinyl = document.querySelector('#spinnervinyl')
		if(vinyl){
			vinyl.style.opacity = centage;
		}
	}

	MyOldVinyl(on){
		let vinyl = document.querySelector('#spinnervinyl')
		if(vinyl){
			if (on){
					vinyl.classList.add("searching")
					// document.querySelector('#spinnervinyl').style.opacity = "1"
					// document.querySelector('#vinylsearch').innerHTML = (this.MaRecherche) ? document.querySelector('#marecherche').value : ''
					// document.querySelector('#vinylalbum').innerHTML = this.Famillia[this.MaSelection]['SearchTag']//'Album'
			}
			else{
					vinyl.classList.remove("searching")
					// document.querySelector('#spinnervinyl').style.opacity = "0"
					// document.querySelector('#vinylsearch').innerHTML = ''
			}
		}
	}

	// Del_BarProgress(value){
	// 	// var aEffacer = document.querySelector('#progressbar')
	// 	// aEffacer.parentNode.removeChild(aEffacer)
	// }


	// Make_BarProgress(value){
	// 	let jelametdans = "#progresss"
	// 	if (document.querySelector('#progressbar') && value === 0)
	// 	{
	// 		var aEffacer = document.querySelector('#progressbar')
	// 		aEffacer.parentNode.removeChild(aEffacer)
	// 		// aEffacer.style.display = 'none';
	// 	}
	// 	if (document.querySelector('#progress'))
	// 	{
	// 		let tagProgress = document.querySelector('#progress')
	// 		let txtProgress = '(' + value + '% )'
	// 		tagProgress.style.width = value + "%"
	// 		tagProgress.setAttribute('aria-valuenow', value)
	// 		tagProgress.innerHTML = txtProgress
	// 		if (value > 99){setTimeout(this.Del_BarProgress(), 3000)}
	// 	}
	// 	else
	// 	{
	// 		var tagProgressBar = document.createElement("div")
	// 		tagProgressBar.id = "progressbar"
	// 		tagProgressBar.className = "progress"

	// 		var tagProgress = document.createElement("div")
	// 		tagProgress.id = "progress"
	// 		tagProgress.className = "progress-bar"
	// 		tagProgress.innerHTML = "0%"
	// 		tagProgress.style.width = value + "%"
	// 		tagProgress.style.color = "white"
	// 		tagProgress.setAttribute('aria-valuenow', value)
	// 		tagProgress.setAttribute('aria-valuemin', 0)
	// 		tagProgress.setAttribute('aria-valuemax', 100)
	// 		tagProgress.setAttribute('role', 'progress-bar')
			
	// 		tagProgressBar.appendChild(tagProgress)

	// 		document.querySelector(jelametdans).appendChild(tagProgressBar)
	// 	}
	// }

	RefreshInnerHtml(objetid,content,by=false)
	{
		tag = by ? '.' : '#';
		if (document.querySelector(tag+objetid))
		{
			document.querySelector(tag+objetid).innerHtml = content
		}
	}

	DisplayHtmlPage(tbody)
	{
		containertableau = document.querySelector('#containertableau')
		
		// Titre
		var tagAccroche = document.createElement("h1")
		tagAccroche.id = "tableau"
		tagAccroche.className = "h3 mb-2 text-gray-800"
		tagAccroche.innerHTML = "Recherchez dans artiste, titre, album ou dans les trois !!!"
		
		// afficher le retour de la recherche
		var tagReadyState = document.createElement("div")
		tagReadyState.id = "readyState"
		tagReadyState.className = "mb-4"
		tagReadyState.innerHTML = "readyState"

		// afficher le status de la recherche
		var tagStatut = document.createElement("div")
		tagStatut.id = "status"
		tagStatut.className = "mb-4"
		tagStatut.innerHTML = "Statut."

		var tagProgressBar = document.createElement("div")
		tagProgressBar.id = "progressbar"
		tagProgressBar.className = "progress"

		var tagProgress = document.createElement("div")
		tagProgress.id = "progress"
		tagProgress.className = "progress-bar"
		tagProgress.style.width = "100%"


		// tagProgress.role = "progress-bar"
		// tagProgress.style.width = "width: 25%"
		// tagProgress.aria-valuenow = 25
		// tagProgress.aria-valuemin = 0
		// tagProgress.aria-valuemax = 100
		// tagProgress.innerHTML = 0
		// <div class="progress">
		// 	<div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
		// </div>
		
		// remplissage
		containertableau.innerHTML = '';
		containertableau.appendChild(tagAccroche)
		containertableau.appendChild(tagReadyState)
		containertableau.appendChild(tagStatut)

		// document.querySelector('#status').innerHTML = 'MonPost .readyState:'+ MonPost.readyState + ' .status:'+ MonPost.status



			tagReadyState.innerHTML = "this.UrlDemandee"

			
			var card = document.createElement("div")
			card.id = "cardtable"
			card.className = "card shadow mb-4"

				var cardheader = document.createElement("div")
				cardheader.className = "card-header py-3"

					var cardheaderh6 = document.createElement("div")
					cardheaderh6.id = "lareponse"
					cardheaderh6.className = "m-0 font-weight-bold text-primary"
					// cardheaderh6.innerHTML = "nb Résultats"

			
			var cardbody = document.createElement("div")
			cardbody.className = "card-body"

				var tableresponsive = document.createElement("div")
				tableresponsive.className = "table-responsive"

					var table = document.createElement("table")
					table.id = "datatable"
					// table.id = "musika-reponse"
					table.className = "table table-bordered table-striped"
					table.style.width = "100%"
					table.style.cellspacing = "0"





			if (this.MaRecherche!='' && this.MaSelection!='')
			{
				// table header
				var thead = document.createElement("thead")
				thead.id = "musika-header"
				var trhead = document.createElement("tr")
				for (var i = 0; i < this.Famillia[this.MaSelection].intitules.length; i++)
				{
					var item = document.createElement("th")
					item.innerHTML = this.Famillia[this.MaSelection].intitules[i];
					trhead.appendChild(item)
				}
				thead.appendChild(trhead)

				// // table footer
				// var tfoot = document.createElement("tfoot")
				// tfoot.id = "musika-footer"
				// var trfoot = document.createElement("tr")
				// for (var i = 0; i < this.Famillia[this.MaSelection].intitules.length; i++)
				// {
				// 	var item = document.createElement("th")
				// 	item.innerHTML = this.Famillia[this.MaSelection].intitules[i];
				// 	trfoot.appendChild(item)
				// }
				// tfoot.appendChild(trfoot)

				// full table childs
				table.appendChild(thead)
				// table.appendChild(this.TableauHtml())
				// table.appendChild(tfoot)

			}
				tableresponsive.appendChild(table)
				cardbody.appendChild(tableresponsive)
				cardheader.appendChild(cardheaderh6)

				card.appendChild(cardheader)
				card.appendChild(cardbody)

				containertableau.appendChild(card)
				
		this.Make_SelectMenu()	
	}

	RefreshReponsesTable(tbody)
	{	
		document.querySelector("#tableau").innerHTML = (this.ReponseReq) ? 'recherche par ' + this.Famillia[this.MaSelection].texteselect : "Recherchez un artiste, un titre, un album ou les trois !!!"
		document.querySelector("#readyState").innerHTML = this.UrlDemandee
		document.querySelector("#lareponse").innerHTML = this.NbReponses + " Résultat" + ((this.NbReponses > 1) ? 's.' : '.' ) 
		
		document.querySelector("#datatable").innerHTML = ''


				// table header
				var thead = document.createElement("thead")
				thead.id = "musika-header"
				var trhead = document.createElement("tr")
				for (var i = 0; i < this.Famillia[this.MaSelection].intitules.length; i++)
				{
					var item = document.createElement("th")
					item.innerHTML = this.Famillia[this.MaSelection].intitules[i];
					trhead.appendChild(item)
				}
				thead.appendChild(trhead)
				document.querySelector("#datatable").appendChild(thead)
		
				// table body
				document.querySelector("#datatable").appendChild(this.TableauHtml())

				// table footer
				var tfoot = document.createElement("tfoot")
				tfoot.id = "musika-footer"
				var trfoot = document.createElement("tr")
				for (var i = 0; i < this.Famillia[this.MaSelection].intitules.length; i++)
				{
					var item = document.createElement("th")
					item.innerHTML = this.Famillia[this.MaSelection].intitules[i];
					trfoot.appendChild(item)
				}
				tfoot.appendChild(trfoot)
				document.querySelector("#datatable").appendChild(tfoot)
				this.Set_Pagination()
	}

}

// console.log('// je rappele : album =release , piste = title = recording, artist = artiste')

let Zik = new Muzica('musika')
Zik.Listener()
Zik.DisplayHtmlPage()
