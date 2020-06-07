"use strict";
class Muzica {
	constructor(muzica) {
		this.Version = 10
		this.debug = false // affiche en console si true
		this.optionsdebug = false // affiche les changement d'options en console si true
		this.debug ? console.groupCollapsed('api version ' + this.Version + ' vanilla js') : ''
		this.debug ? console.log('source: https://github.com/patobeur/Muzica') : ''
		// this.debug ? console.log('Full hugs from |º47083µЯ !!!') : ''
		this.showOldSearch = true // to do
		this.oldSearch = []

		this.minchar = 1
		this.maxchar = 50

		this.modalFooter = false // youtube & close bottom buttons on modal layout
		this.nbSubmitDie = 5 // nb max de submit si recherche vide avant de bloquer
		this.vinylButon = true // n'apparait pas lors de la recherche si true 
		this.vinyl_enabled = true // l'option est elle active ? oui si true
		this.vinyl_searching = false // true si recherche en cours
		// this.nbSubmitMax = 3							// nb max de submit si recherche vide
		this.nbSubmit = 0 // nb couranbt de recherche vide
		// info nav
		this.limitPerPage = 25 // nb couranbt de recherche videoffset
		this.actualOffset = 0 // nb couranbt de recherche videoffset
		this.nbReponses = 0
		this.nbPages = 0
		// some datas
		this.inputSearch = 'marecherche' // contenu du value dans le input recherche
		this.formName = 'rechercher' // contenu du value dans le submit 
		this.inputSelect = 'maselection' // contenu du value dans le option select
		this.modalName = 'rel_modal'
		this.iconeVoirAlbum = 'fas fa-plus-circle'
		//
		this.reponseReq = ''
		this.maSelection = 'default'
		this.maRecherche = ''
		this.typeActuel = ''
		this.reqActuel = ''
		this.fullColonnes = []
		this.reponseHtml = ''
		this.urlDemandee = ''
		this.nbReponses = 0
		this.nodata = 'no data'

		this.urlmbid = ''
		this.mbid = ''
		//
		this.urlDatas = {
			"methode": 'GET',
			"url": 'https://musicbrainz.org/ws/2/',
			"inc": '/?fmt=json' + '&query=',
			"rel": '&inc=genres+ratings+artists+releases+annotation',
			"arts": 'https://coverartarchive.org/release/',
			"fmt": '?fmt=json'
		}
		//
		this.myCats = {
			'default': {
				"name": "default",
				"texteselect": "EveryThing",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"],
				"iconeclass": "fas fa-globe-europe"
			},
			'artist': {
				"name": "artist",
				"texteselect": "Artiste",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"],
				"iconeclass": "fas fa-user-music"
			},
			'recording': {
				"name": "recording",
				"texteselect": "Title",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"],
				"iconeclass": "fas fa-record-vinyl"
			},
			'release': {
				"name": "release",
				"texteselect": "Album",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"],
				"iconeclass": "fas fa-album-collection"
			},
			'stuff': {
				"name": "stuff",
				"texteselect": "Stuff",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"],
				"iconeclass": "fas fa-album-collection"
			}
		}
		//footer modal option
		this.optionsModal = 'options_modal'
		this.optionsModalinter = 'options_link'
		this.origineOptionsClasseName = 'footerlink boutton'
		this.enabledOptionsClasseName = 'up'
		this.debug ? console.groupEnd() : ''
	}

	// HERE WE LISTEN DIF-PARTS OF THE PAGE
	listener() {
		// Listening hover submit
		document.querySelector('#rechercher').addEventListener('mouseover', (event) => {
			let notempty = document.querySelector('#' + this.inputSearch).value != '' ? true : false
			this.set_submit_onoff(notempty)
		})
		// Listening Keyboard
		document.addEventListener('keydown', (e) => {
			let modal = document.querySelector('#'+this.modalName);
			let modalOptions = document.querySelector('#'+this.optionsModal);
				// escape close the modal
				if (e.keyCode === 27 && modal) {
					modal.parentNode.removeChild(modal)
				}
				if (e.keyCode === 27 && modalOptions) {
					modalOptions.parentNode.removeChild(modalOptions)
					// modalOptions.classList.remove(this.enabledOptionsClasseName)

				}
		})
		// Listening submit
		document.querySelector('#' + this.formName).addEventListener('submit', (event) => {
				event.preventDefault()
				this.set_InitialSearch() // remise a zero
				// if (this.is_Actif()) {
					// getting search words in input
					let marecherche = document.querySelector('#' + this.inputSearch).value;
					if (marecherche && marecherche != '') {
						this.set_This('Listener', 'actualOffset', 0)
						this.set_This('Listener:', 'maRecherche', this.set_CleanString(marecherche))
						this.get_Recordings()
					} else {
					}
				// }
		})
		// Listening selects menu
		document.querySelector('#' + this.inputSelect).addEventListener('change', (event) => {
			let changed = event.target.options[event.target.selectedIndex].value;
			let changed2 = event.target.options[event.target.selectedIndex].index;
			event.target.options[changed2].selected = 'selected'
			console.log(changed)
			console.log(changed2)
			// this.debug ? console.clear() : ''
			// let index = event.target.selectedIndex
			// document.querySelector('.searchbloc').style.marginTop = null
			// // let ladiv = document.querySelector('#' + this.inputSelect)
			// let maSelection = this.set_CleanString(event.target.value)
			// console.log("maSelection:" + maSelection) 
			// if (maSelection && maSelection != '') {
			// 	this.set_This('Listener', 'maSelection', maSelection)
			// 	this.set_This('set_CleanNewSearch', 'actualOffset', 0)
			// 	this.set_CleanNewSearch()
			// 	console.log("index:" + index) 
			// 	event.target[index].setAttribute('selected', true)
				
			// }
			// document.querySelector('#' + this.inputSelect).blur()
		})
		// spinner on off
		document.querySelector('#vinyl-bouton').addEventListener('click', (e) => {
			this.myOldVinylButon()
		})
	}

	// Setters
	set_This(Func, Nom, Value) {
		// var oldValue = this[Nom]
		//this.debug ? console.log('(' + Func + ') set_(' + Nom + ': "' + oldValue + '" to "' + Value + '")') : ''
		this[Nom] = Value
	}
	set_submit_onoff(notempty) {
		if (notempty){
			document.querySelector('#' + this.inputSearch).classList.remove('empty')
			let submitbuts = document.querySelector('.clonA')
			submitbuts.classList.remove('no')
			submitbuts = document.querySelector('.clonB')
			submitbuts.classList.remove('no')
		}
		else {
			document.querySelector('#' + this.inputSearch).classList.add('empty')
			let submitbuts = document.querySelector('.clonA')
			submitbuts.classList.add('no')
			submitbuts = document.querySelector('.clonB')
			submitbuts.classList.add('no')
			document.querySelector('#' + this.inputSearch).focus()
		}

		
	}
	del_TagById(tagId){
		let aEffacer = document.querySelector('#'+tagId)
		aEffacer ? aEffacer.parentNode.removeChild(aEffacer) : ''
	}
	set_Pagination() {
		if (this.nbReponses < 1) {
				this.del_TagById('pagination')
		}
		else if (this.nbReponses > this.limitPerPage){
			// pagination group
			let pagination = document.createElement("nav")
			pagination.id = 'pagination'
			pagination.className = 'pagination-groupe'
			pagination.setAttribute('aria-label', 'Page navigation example')
			// pagination button group
			let pag_buttons = document.createElement("ul")
			pag_buttons.className = 'pagination justify-content-end pagination-sm'

			// previous
			let pag_previous = document.createElement("li")
			pag_previous.className = 'page-item' + (this.actualOffset < this.limitPerPage ? ' disabled' : '')
			let pag_previous_link = document.createElement("a")
			pag_previous_link.className = 'page-link'
			pag_previous_link.setAttribute('href', '#')
			pag_previous_link.setAttribute('tabindex', '-1')
			pag_previous_link.setAttribute('aria-disabled', 'true')


			pag_previous_link.textContent = '<<'
			pag_previous.appendChild(pag_previous_link)
			if (this.actualOffset >= this.limitPerPage) {
				pag_previous.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', (this.actualOffset - this.limitPerPage))
						this.get_Recordings()
					},{once: false}
				)
			}
			pag_buttons.appendChild(pag_previous)
			
			// page link
			this.nbPages = Math.trunc((this.nbReponses / this.limitPerPage))
			let max = (this.nbPages > 1) ? (this.nbPages < 10) ? this.nbPages + 1 : 10 : this.nbPages
			for (let i = 0; i < max; i++) {
				let title = 'page ' + (i+1)
				// let title = 'page ' + ((this.limitPerPage * i) + ) + ' à ' + ((this.limitPerPage * (i + 1)) + 1)
				let pag_button = document.createElement("li")
				pag_button.className = 'page-item' + ((((this.limitPerPage * i) + 1) == this.actualOffset) ? ' active' : '')

				let pag_button_link = document.createElement("a")
				pag_button_link.className = 'page-link'
				pag_button_link.setAttribute('href', '#')
				pag_button_link.setAttribute('title', title)
				pag_button_link.textContent = ((this.limitPerPage * i) )

				pag_button.appendChild(pag_button_link)

				pag_button.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', ((this.limitPerPage * i) ))
						document.querySelector('#contents').scrollTo(0,0)
						this.get_Recordings()
					},
					{once: false}
				)
				pag_buttons.appendChild(pag_button)
			}
			// NEXT
			//
			let pag_next = document.createElement("li")
			pag_next.className = 'page-item' + (this.actualOffset <= (this.nbReponses - this.limitPerPage) ? '' : ' disabled')
			let pag_next_link = document.createElement("a")
			pag_next_link.className = 'page-link'
			pag_next_link.setAttribute('href', '#')
			pag_next_link.textContent = '>>'
			pag_next.appendChild(pag_next_link)
			if (this.actualOffset < (this.nbReponses - this.limitPerPage)) {
				pag_next.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', (this.limitPerPage + this.actualOffset))
						this.get_Recordings()
					},
					{once: false}
				)
			}
			pag_buttons.appendChild(pag_next)
			// END
			//
			let pag_end = document.createElement("li")
			pag_end.className = 'page-item' + (this.actualOffset <= (this.nbReponses - this.limitPerPage) ? '' : ' disabled')
			let pag_end_link = document.createElement("a")
			pag_end_link.className = 'page-link'
			pag_end_link.setAttribute('href', '#')
			pag_end_link.textContent = 'end'
			pag_end.appendChild(pag_end_link)
			if (this.actualOffset < (this.nbReponses - this.limitPerPage)) {
				pag_end.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', (    Math.floor(this.nbReponses / this.limitPerPage)*this.limitPerPage ))
						this.get_Recordings()
					},
					{once: false}
				)
			}
			pag_buttons.appendChild(pag_end)
			pagination.appendChild(pag_buttons)
			// 
			if (document.querySelector('#pagination')) {
				
				this.del_TagById('pagination')
				// let aEffacer = document.querySelector('#pagination')
				// aEffacer.parentNode.removeChild(aEffacer)
				document.querySelector('#cardtable').appendChild(pagination)
			}
			else {
				document.querySelector('#cardtable').appendChild(pagination)
			}
		}
	}
	set_FullUrl() {
		let limit = "&limit=" + this.limitPerPage;
		let fullsearch = '';
		if (this.maSelection == 'default') {
			for (let i = 0; i < this.fullColonnes.length; i++) {
				fullsearch = fullsearch + (i > 0 ? ' OR ' : '') + this.fullColonnes[i] + ':' + '"' + this.maRecherche + '"'
			}
		} else {
			fullsearch = this.maSelection + ':"' + this.maRecherche + '"'
		}
		this.set_This('set_FullUrl', 'urlDemandee', this.urlDatas.url + this.typeActuel + this.urlDatas.inc + fullsearch + limit + '&offset=' + this.actualOffset)
	}
	set_NbSubmitPlus1() {
		this.nbSubmit = this.nbSubmit + 1
	}
	/**
 * set a new image
 * @param resultats indexed datas
 * @param mbid mbid
 */
	set_images(resultats, mbid) {
		if (resultats && resultats['images']) {
			this.debug ? console.log(resultats.images.length + ' image' + (resultats.images.length > 0 ? 's' : '') ) : ''
			for (var i in resultats.images) {
				resultats.images[i].thumbnails.small ? this.modal_AddContent(true, 'div', 'arts-' + mbid, this.modal_AddImage(resultats.images[i].thumbnails.small, 'modal-vignette', mbid,resultats.images[i].id), 'image-' + mbid, 'modalinfo-item') : ''
			}
		}
	}
	set_CleanString(value) {
		if (value != '' && value != false && value != null) {
			if (value.length < 1) return false // 'to shorty';
			if (value.length > 50) return false // 'to long';
			return encodeURIComponent(value)
		}
	}
	set_CleanNewSearch() {
		this.set_This('set_CleanNewSearch', 'typeActuel', this.myCats[this.maSelection].type)
		this.set_This('set_CleanNewSearch', 'reqActuel', this.myCats[this.maSelection].SearchCategorie)
		this.set_This('set_CleanNewSearch', 'fullColonnes', this.myCats[this.maSelection].SearchTag)
		this.set_This('set_CleanNewSearch', 'reponseHtml', '')
		this.set_This('set_CleanNewSearch', 'reponseReq', '')
	}
	set_OldSearch(datas) {
		this.oldSearch.push(
			{
				"date": this.get_Date(),
				"recherche": (datas[0] ? datas[0] : null),
				"url": (datas[1] ? datas[1] : null),
				"nbreponse": (datas[2] ? datas[2] : null),
				"select": (datas[3] ? datas[3] : null)
			}
		)
		this.debug ? console.log("oldSearch:") : ''
		this.debug ? console.log(this.oldSearch) : ''
	}
	set_InitialSearch() {
		this.set_This('set_InitialSearch', 'reponseHtml', '')
		this.set_This('set_InitialSearch', 'reponseReq', null)
		this.set_This('set_InitialSearch', 'nbSubmit', 0)
		this.set_This('set_InitialSearch', 'maRecherche', '')
	}

	// GETTERS 
	get_This(Func, Nom) {
		// console.log('(' + Func + ') Get_(' + Nom + '="' + this[Nom] + '")')
		return this[Nom]
	}
	get_Recordings() {
		this.initialise
		this.set_NbSubmitPlus1() // incrementation
		this.set_CleanNewSearch() // update and/or reset old datas
		this.set_FullUrl() // set new url with clean data
		this.set_This('get_Recordings', 'vinyl_searching', true)
		if (this.vinylButon) {
			this.myOldVinyl(true)
		}
		// request
		let MonPost = new XMLHttpRequest()
		MonPost.open(this.urlDatas.methode, this.urlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		MonPost.onreadystatechange = (e) => {
			// this.debug ? ('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status): ''
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultat = JSON.parse(MonPost.responseText)
				this.set_This('get_Recordings', 'reponseReq', resultat)
				// set nb response for pagination
				this.set_This('get_Recordings', 'nbReponses', this.reponseReq.count)
				// old searchs
				this.set_OldSearch([this.maRecherche, this.urlDemandee, this.nbReponses, this.maSelection])
				//
				// this.debug ? console.log(this.reponseReq.recordings) : ''
				if (this.vinylButon && this.vinyl_searching) {
					this.myOldVinyl(false)
				}
				this.set_This('get_Recordings', 'vinyl_searching', false)
				this.refresh_ResponsTable()

				// ICI GESTION NOT FOUND
			}
		}
		this.debug ? console.clear() : ''
		this.debug ? console.log('get all Records at : ' + this.urlDemandee) : ''
		MonPost.send()
	}
	get_ReleaseByRecordingsId(oneRecord){
		let MonPost = new XMLHttpRequest()
		let urlDemandee = 'https://musicbrainz.org/ws/2/recording/' + oneRecord.id + this.urlDatas['fmt'] + this.urlDatas['rel']

		MonPost.open(this.urlDatas.methode, urlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		this.make_modal_alive(true)

		MonPost.onreadystatechange = (e) => {
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultats = JSON.parse(MonPost.responseText)
				// this.debug ? console.log('B resultats: ') : ''
				// this.debug ? console.log(resultats) : ''
				
				this.make_Modal(resultats)
			}
			
			// // ICI GESTION NOT FOUND
			// if (MonPost.readyState == 4 && MonPost.status == 400) {
			// 	let resultats = document.querySelector('#resultats').textContent
			// 	this.debug ? console.log('404 not found with : ' + urlDemandee) : ''
			// }

		}
		this.debug ? console.log('get all Releases by Record ID : ' + urlDemandee) : ''
		MonPost.send()
	}
	get_ArtsByReleaseId(mbid,title) {
		let MonPost = new XMLHttpRequest()
		let urlDemandee = this.urlDatas['arts'] + mbid + this.urlDatas['fmt']
		let divresultats = document.querySelector('#release-'+mbid)
		let reltitle = document.querySelector('#rel-title-' + mbid)

		MonPost.open(this.urlDatas.methode, urlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		
		reltitle.textContent = " LOADING ."

		MonPost.onreadystatechange = (e) => {
			// if (MonPost.readyState == 4 && MonPost.status != 200) {
				this.debug ? console.log('coucou') : ''
			// }

			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultats = JSON.parse(MonPost.responseText)
				this.debug ? console.log('all images from Release_Id : '+ mbid) : ''
				reltitle.textContent = title
				this.debug ? console.log(resultats) : ''
				this.set_images(resultats, mbid)
				return resultats
			}
			// 404 NOT FOUND
			if (MonPost.readyState == 4 && MonPost.status == 404) {
				divresultats ? divresultats.textContent = "Sorry, no cover art found for release : " + mbid + ' !' : ''
				this.debug ? console.log('No cover art found at url : ' + urlDemandee) : ''
			}

			// ICI ICI ICI

		}
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		this.debug ? console.log('get all arts from a Release_id at : ' + urlDemandee) : ''
		MonPost.send()
	}

	// reinit
	set_InitialSearch() {
		this.set_This('set_InitialSearch', 'reponseHtml', '')
		this.set_This('set_InitialSearch', 'reponseReq', null)
		this.set_This('set_InitialSearch', 'nbSubmit', 0)
		this.set_This('set_InitialSearch', 'maRecherche', '')
		// this.set_This('set_InitialSearch','maSelection',null)
	}

	// Makers
	make_SelectMenu() {
		let catIndex = this.myCats
		let menuSelect = document.querySelector('#maselection')
		for (var datas in catIndex) {
			let MenuOption = document.createElement("option")
			MenuOption.text = catIndex[datas]['texteselect']
			MenuOption.value = catIndex[datas]['name']
				let iconeclass = document.createElement("option")
				// to do
			menuSelect.add(MenuOption)
		}
		menuSelect.selectedIndex = 0
	}	
	make_HtmlTable() {
		if (this.reponseReq) {
			// table body
			let tbody = document.createElement("tbody")
			let datas = this.reponseReq[this.reqActuel]
			let ligneId = this.actualOffset
			for (var oneRecord of datas) {

				let trbody = document.createElement("tr")
				// line number col
				let item = document.createElement("td")
				item.className = 'idline'
				item.textContent = (ligneId)
				trbody.appendChild(item)
				// artist col
				item = document.createElement("td")
				item.textContent = (oneRecord['artist-credit'] && oneRecord['artist-credit'][0]) ? oneRecord['artist-credit'][0].name : 'vide'
				item.setAttribute('title', 'artist-credit-id : ' + oneRecord['artist-credit'][0]['artist']['id'])
				trbody.appendChild(item)
				// title col
				let itemtitle = document.createElement("td")
				itemtitle.textContent = (oneRecord['title']) ? oneRecord['title'] : 'vide'


				// album col
				item = document.createElement("td")

				// liste release album col
				let nbreleased = 0
				let nblines = 0
				// if (oneRecord['releases']) {
					let lesreleasesA = ''
					let lesreleasesB = ''
					for (var released in oneRecord['releases']) {
						let lesreleases = oneRecord['releases'][released]
						lesreleasesA = lesreleasesA +
							'' + lesreleases['title'] +
							' (' + lesreleases['status'] + ')' +
							"\n"
							lesreleasesB = lesreleasesB +
								'' + lesreleases['id'] +
								"\n"
						nbreleased = nbreleased + lesreleases['count']
						nblines++
					}
					lesreleasesA = nblines + ' release' + (nblines>1 ? 's' : '') + ' found \n' + lesreleasesA
					lesreleasesB = nblines + ' release' + (nblines>1 ? 's' : '') + ' found \n' + lesreleasesB
					itemtitle.setAttribute('title', lesreleasesB)
					item.setAttribute('title', lesreleasesA)
				// } else {
				// 	// no release
				// }
				item.textContent = oneRecord['title']
				item.textContent = (oneRecord['releases'] && oneRecord['releases'][0]) ? oneRecord['releases'][0].title : this.nodata
				trbody.appendChild(itemtitle)
				trbody.appendChild(item)
				// actions col
				item = document.createElement("td")
				item.className = 'actions'
					let itembutton = document.createElement("button")
					itembutton.setAttribute('recording_id', oneRecord.id)
					itembutton.setAttribute('title', 'release Id: ' +oneRecord.id)

					if (oneRecord['releases']) {
						let record = oneRecord
						itembutton.addEventListener('click', (e) => {
							this.get_ReleaseByRecordingsId(record)
						},
							{once: false})
					}
									
					itembutton.className = 'btn btn-dark'
						let iconebutton = document.createElement("i")
						iconebutton.className = this.iconeVoirAlbum
						itembutton.appendChild(iconebutton)
				item.appendChild(itembutton)

				trbody.appendChild(item)
				tbody.appendChild(trbody)
				ligneId++
			}
			return tbody
		}
		else {
			return 'vide'
		}
	}
	make_modal_alive(statut){
		// if (!document.querySelector('#fond-modal')) {
			let modalalbum = document.createElement("div")
			modalalbum.id = this.modalName
			
			modalalbum.onclick = (e)=>{
				e.target.id === this.modalName ? this.del_TagById(this.modalName) : ''
			}
			modalalbum.className = "rel-modal-fs" + (statut ? '-loading' : '')
				let modaldialog = document.createElement("div")
				modaldialog.id = "rel-modal-cadre"
				modaldialog.className = "rel-modal-cadre"
					let modalcontent = document.createElement("div")
					modalcontent.id = 'rel-contenu-modal'
					modalcontent.className = "rel-modal-contenu"

		if (statut){
			let recordloading = document.createElement("img")
			recordloading.className = "recordloading"
			recordloading.src = 'assets/theme/loadingvinyl.svg'
			modalcontent.appendChild(recordloading)
		}
			modaldialog.appendChild(modalcontent)
			modalalbum.appendChild(modaldialog)
			document.body.appendChild(modalalbum)

		// }
	}
	make_Modal(lesreleases) {
		this.debug ? console.log('lesreleases') : ''
		this.debug ? console.log(lesreleases) : ''

		if (document.querySelector('#rel_modal')) {
			this.del_TagById('rel_modal')
		}
		this.make_modal_alive(null)
		this.modal_AddContent(true, 'div', 'rel-contenu-modal', null, 'rel-modal-contenu-contenu', 'rel-modal-contenu-contenu')
			this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu', "Informations", 'rel-modal-contenu-contenu-info', 'rel-modal-contenu-contenu-info')

				let rec_title = lesreleases['title'] ? lesreleases['title'] : false
				rec_title ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Title: " + rec_title + '.', 'modaltitle', 'rel-modal-contenu-contenu-info-item') : 'vide'
				
				let rec_artistcredit = lesreleases['artist-credit'] ? lesreleases['artist-credit'] : false
				rec_artistcredit ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Artists: " + this.getall_tag(rec_artistcredit, 'name') + '.', 'modalartists', 'rel-modal-contenu-contenu-info-item') : 'vide'

				let rec_genres = lesreleases['genres'] ? lesreleases['genres'] : false
				rec_genres ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Genres: " + this.getall_tag(rec_genres, 'name') + '.', 'modalgenres', 'rel-modal-contenu-contenu-info-item') : 'vide'
				
				
				let rec_length = lesreleases['length'] ? lesreleases['length'] : false
				rec_length ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Length: " + this.make_Pyl_TimeFormat(rec_length), 'modallength', 'rel-modal-contenu-contenu-info-item') : ''
				
				let rec_rating = lesreleases['rating'] ? lesreleases['rating'].value : 0
				let rec_votescount = lesreleases['votes-count'] ? lesreleases['votes-count'].value : 0
				rec_rating ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Rating value: " + this.set_Stars(rec_rating), 'modalrating', 'rel-modal-contenu-contenu-info-item') : ''

			// RELEASES
			this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu', '', 'lesreleases', 'lesreleases')
			let relCount = 0
			for (let released in lesreleases['releases'])
			{
				let lereleased = lesreleases['releases'][released]	

				let rel_divid = 'release-' + lereleased['id']
				let rel_title = lereleased['title'] ? lereleased['title'] : false
				let titlerelease = document.createElement("h6")
				titlerelease.className = "modal-rel-title"
				titlerelease.id = "rel-title-" + lereleased['id']
				titlerelease.textContent = " Album : " + ((rel_title) ? rel_title : 'vide')
				this.modal_AddContent(true, 'div', 'lesreleases', titlerelease , rel_divid, 'unerelease')
				
					let rel_country = lereleased['country'] ? lereleased['country'] : false
					let rel_date = lereleased['date'] ? lereleased['date'] : false
					let rel_disambiguation = lereleased['disambiguation'] ? lereleased['disambiguation'] : false
					let rel_trackcount = lereleased['track-count'] ? lereleased['track-count'] : false
					rel_country ? 				this.modal_AddContent(true, 'div', rel_divid, "country: " + rel_country, 'modal-rel-country-' + relCount, 'modalinfo-item') : ''
					rel_date ?						this.modal_AddContent(true, 'div', rel_divid, "date: " + rel_date, 'modal-rel-date-' + relCount, 'modalinfo-item') : 'vide'
					rel_disambiguation ? 	this.modal_AddContent(true, 'div', rel_divid, "disambiguation: " + rel_disambiguation, 'modal-rel-disambiguation-' + relCount, 'modalinfo-item') : 'vide'
					rel_trackcount ? 			this.modal_AddContent(true, 'div', rel_divid, "track-count: " + rel_trackcount, 'modal-rel-trackcount-' + relCount, 'modalinfo-item') : 'vide'
				
				// ARTS
				let art_divid = 'arts-' + lereleased['id']
				this.modal_AddContent(true, 'div', rel_divid, '', art_divid, 'arts')
				this.get_ArtsByReleaseId(lereleased['id'],rel_title)
				relCount++
			}
		this.modal_AddHeader('div', 'rel-contenu-modal', (lesreleases['artist-credit'] && lesreleases['artist-credit'][0]) ? lesreleases['artist-credit'][0].name + ' - ' + lesreleases['title'] : 'vide')
		this.modal_AddFooter('div', 'rel-contenu-modal')
	}

	// modal stuff
	modal_AddHeader(tag, destId, leString) {
		let cible = document.querySelector('#' + destId)
		let modalheader = document.createElement(tag)
		modalheader.className = "rel-modal-contenu-header"
		let modaltitle = document.createElement("h6")
		modaltitle.id = "ZLabel"
		modaltitle.className = "rel-modal-contenu-header-label"
		modaltitle.textContent = leString

		let modalbutton = document.createElement("button")
		modalbutton.id = "ZClose"
		modalbutton.className = "btn-rel btn-rel-close"
		modalbutton.addEventListener('click', (e) => {
				let aEffacer = document.querySelector('#rel_modal')
				aEffacer.parentNode.removeChild(aEffacer)},
				{once: true}
		)
		modalbutton.textContent = "Close"
		modalheader.appendChild(modaltitle)
		modalheader.appendChild(modalbutton)
		cible.prepend(modalheader)
	}
	modal_AddFooter(tag, destId) { // IF this.modalFooter TRUE
		// youtub and close button for modal layout 
		if (this.modalFooter){
			let Cible = document.querySelector('#' + destId)
			var modalfooter = document.createElement(tag)
			modalfooter.className = "rel-modal-contenu-footer"
				let modalyoutube = document.createElement("a")
				modalyoutube.className = "btn-rel btn-rel-youtube"
				modalyoutube.setAttribute('href', 'https://youtube.com')
				modalyoutube.setAttribute('target', '_youtube')
				modalyoutube.setAttribute('type', 'button')
				modalyoutube.textContent = ' Youtube'
					let modalyoutubeico = document.createElement("i")
					modalyoutubeico.className = 'fab fa-youtube'
					modalyoutube.prepend(modalyoutubeico)

				let modalfermer = document.createElement("a")
				modalfermer.className = "btn-rel btn-rel-close"
				modalfermer.textContent = ' Fermer'
					let modalfermerico = document.createElement("i")
					modalfermerico.className = 'fas fa-door-closed'
					modalfermer.prepend(modalfermerico)
					// modalfermer.setAttribute('href', '#')
					modalfermer.addEventListener('click',(e) => {
						let aEffacer = document.querySelector('#rel_modal')
						aEffacer.parentNode.removeChild(aEffacer)},
						{once: true}
					)

			modalfooter.appendChild(modalyoutube)
			modalfooter.appendChild(modalfermer)

			Cible.appendChild(modalfooter)
		}
	}
	modal_AddImage(lurl, laClass, mbid, imgid) {
		let ajout = document.createElement('img')
		ajout.id = 'vig-' + imgid
		ajout.className = laClass + ' LOADING RELEASE...'
		ajout.src = 'assets/theme/loadingvinyl.svg'
		var img = new Image();
		img.onload = (e)=> {
			// document.querySelector('#vig-' + imgid).style.width.unset()
			let newimage = document.querySelector('#vig-' + imgid)
			newimage ? document.querySelector('#vig-' + imgid).src = lurl : ''
			newimage ? document.querySelector('#vig-' + imgid).classList.remove('loading') : ''
		}
		img.src = lurl
		return ajout
	}
	modal_AddContent(pos = false, tag, destId, leString, lId, laClass, lIcone = null) {
		let Cible = document.querySelector('#' + destId)
		if (Cible) {
			let ajout = document.createElement(tag)
			ajout.id = lId
			ajout.className = laClass
			if (typeof leString === 'object' && leString !== null) {
				ajout.appendChild(leString)
			} else {
				ajout.textContent = leString
			}
			if (lIcone) {
				let icone = document.createElement('i')
				icone.className = 'fas fa-record-vinyl'
				ajout.prepend(icone)
			}
			pos ? Cible.appendChild(ajout) : Cible.prepend(ajout)
		}
	}
	modal_TempoVignette(mbid) {
		this.modal_AddContent(true, 'div', 'arts-' + mbid, this.modal_AddImage('toto', 'modal-vignette-tempo', mbid), 'tempo-' + mbid, 'modalinfo-item')
	}

	// html refreshs
	fresh_HtmlPage() {
		let containertableau = document.querySelector('#containertableau')

		// Some stuff here in the future
		let tagStatut = document.createElement("div")
		tagStatut.id = "status"
		tagStatut.className = "mb-4"
		tagStatut.textContent = "Some stuff here in the future !"

		// clean the existing table div
		containertableau.textContent = '';
		containertableau.appendChild(tagStatut)

		let card = document.createElement("div")
		card.id = "cardtable"
		card.className = "lapage shadow"

		let cardheader = document.createElement("div")
		cardheader.className = "page-entete"

		let cardresponse = document.createElement("div")
		cardresponse.id = "lareponse"
		cardresponse.className = "font-weight-bold text-primary"

		let cardbody = document.createElement("div")
		cardbody.className = "page-corps"

		let tableresponsive = document.createElement("div")
		tableresponsive.className = "table-responsive"

		let table = document.createElement("table")
		table.id = "datatable"
		table.className = "table table-bordered table-striped table-hover table-sm"
		// table.style.width = "100%"
		// table.style.cellspacing = "0"

		let tablecaption = document.createElement("caption")
		containertableau.textContent = '';
		table.appendChild(tablecaption)
		
		tableresponsive.appendChild(table)
		cardheader.appendChild(cardresponse)
		card.appendChild(cardheader)

		cardbody.appendChild(tableresponsive)
		card.appendChild(cardbody)

		containertableau.appendChild(card)

		this.refresh_PageHeaderContent()
		this.make_SelectMenu()
		this.make_footer()
	}
	refresh_PageHeaderContent(string=null){
		this.del_TagById('pageheadercontent')
		let bloccontents = document.createElement("div")
		bloccontents.id = 'pageheadercontent'
		bloccontents.textContent = 'Make your own search on : '
		let content = document.createElement("a")
		content.setAttribute('href', 'https://musicbrainz.org/')
		content.setAttribute('title', 'Make your own search on MusicbrainZ')
		content.setAttribute('target', '_musicbrainz')
		content.textContent = 'MusicBrainz - The Open Music Encyclopedia'
		bloccontents.appendChild(content)
		let br = document.createElement("br")
		bloccontents.appendChild(br)		
		if (string) {
			let txt = document.createTextNode(string);
			bloccontents.appendChild(txt)
		}
		document.querySelector("#lareponse").appendChild(bloccontents)
	}
	refresh_ResponsTable() {
		if ( this.nbReponses == 0){
			// no results
			document.querySelector("#lareponse").textContent =""
			// document.querySelector("#datatable").textContent = ""
			document.querySelector("#datatable").textContent = "Nothing found, sorry !"
			this.refresh_PageHeaderContent()
			// clearing pagination
			this.del_TagById('pagination')
		}
		else
		{
			this.refresh_PageHeaderContent()
			document.querySelector("#lareponse").textContent = this.nbReponses + " Result" + ((this.nbReponses > 1) ? 's.' : '.')
			// clean the existing datatable div
			document.querySelector("#datatable").textContent = ''
			// table header
			let thead = document.createElement("thead")
			thead.id = "musika-header"
			let trhead = document.createElement("tr")
			for (var i = 0; i < this.myCats[this.maSelection].intitules.length; i++) {
				let item = document.createElement("th")
				item.textContent = this.myCats[this.maSelection].intitules[i];
				trhead.appendChild(item)
			}
			thead.appendChild(trhead)
			document.querySelector("#datatable").appendChild(thead)

			// table body
			document.querySelector("#datatable").appendChild(this.make_HtmlTable())

			// table footer
			let tfoot = document.createElement("tfoot")
			tfoot.id = "musika-footer"
			let trfoot = document.createElement("tr")
			for (var i = 0; i < this.myCats[this.maSelection].intitules.length; i++) {
				let item = document.createElement("th")
				item.textContent = this.myCats[this.maSelection].intitules[i];
				trfoot.appendChild(item)
			}
			tfoot.appendChild(trfoot)
			document.querySelector("#datatable").appendChild(tfoot)
			this.set_Pagination()
		}
	}

	// SPINNER VINYL
	myOldVinylButon() {
		let vinylactivity = document.querySelector('#vinyl-bouton-content')
		let spinnervinyl = document.querySelector('#spinnervinyl')
		if (this.vinylButon) {
			this.set_This('vinyl-bouton', 'vinylButon', false)
			this.myOldVinyl(false)
			vinylactivity.textContent ='SpinIsOff '
			let vinylactivity_icone = document.createElement("i")
			vinylactivity_icone.className = "fas fa-toggle-on"
			vinylactivity.appendChild(vinylactivity_icone)
			spinnervinyl.classList.add("disabled")
			event.target.title = 'Switch Spinner OFF'
			spinnervinyl.classList.remove("spinning")
		}
		else {
			this.set_This('vinyl-bouton', 'vinylButon', true)
			spinnervinyl.classList.remove("disabled")
			event.target.title = 'Switch Spinner ON'
			vinylactivity.textContent ='SpinIsON '
			let vinylactivity_icone = document.createElement("i")
			vinylactivity_icone.className = "fas fa-toggle-off"
			vinylactivity.appendChild(vinylactivity_icone)
			spinnervinyl.classList.add("spinning")
		}
	}
	myOldVinylOpacity(centage) {
		let vinyl = document.querySelector('#spinnervinyl')
		if (vinyl) {
			vinyl.style.opacity = centage;
		}
	}
	myOldVinyl(on) {
		let vinyl = document.querySelector('#spinnervinyl')
		if (document.querySelector('#spinnervinyl')) {
			if (on) {
				vinyl.classList.add("searching")
			} else {
				vinyl.classList.remove("searching")
			}
		}
	}

	// STUFF
	getall_artistcredit(index, le_name) {
		if (index.length > 0) {
			let retour = []
			for (let i = 0; i < index.length; i++) {
				retour[i] = index[i][le_name]
			}
			return retour.length > 0 ? retour.join(", ") : 'vide'
		}
		return 'vide'
	}
	getall_tag(index, le_name) {
		if (index.length > 0) {
			let retour = []
			for (let i = 0; i < index.length; i++) {
				retour[i] = index[i][le_name]
			}
			return retour.length > 0 ? retour.join(", ") : 'vide'
		}
		return 'vide'
	}
	get_Date() {
		// let rightnow = Date.now()
		let today = new Date()
		return today.getDate() + '-' +
			today.getMonth() + '-' +
			today.getFullYear() + ' ' +
			today.getHours() + ':' +
			today.getMinutes() + ':' +
			today.getSeconds() + ':';
	}
	make_awesomeico(string){
		let awesomeico = document.createElement("i")
		awesomeico.className = string
		return awesomeico
	}
	make_Pyl_TimeFormat(number) {
		//thx Pyl	
		let minutes = 0
    let seconds = 0
    if (number) {
				number /= 1000;
        seconds = Math.floor(number % 60) > 0 ? `${Math.floor(number % 60)}` : ''
        minutes = Math.floor(number / 60) > 0 ? `${Math.floor(number / 60)}:` : ''
        return minutes + seconds
    }
		return null
	}
	make_linktag(url,text,target) {
		let link = document.createElement("a")
		link.className = ""
		link.setAttribute('href', url)
		link.setAttribute('target', '_out_' + target)
		link.textContent = text
		return link
	}
	set_Stars(score) {
		let stars = ''
		for(let i= 0;i < 5; i++){
			stars += score>i ? "★" : "☆"
		}
		return stars
	}
	// modal options
	make_ModalOptions(targetedid){
		let optionmodal = document.querySelector("#" + this.optionsModal)
		if (!optionmodal)
		{
			let modalTitle = document.createElement("h4")
			modalTitle.textContent = "OPTIONS"
			let modalOptions = document.createElement("div")
			modalOptions.id = this.optionsModal
			modalOptions.className = this.optionsModal + "-fs"
			modalOptions.onclick = (e)=>{
				if (e.target.id === this.optionsModal){
					this.del_TagById(this.optionsModal)
					this.set_Pagination()
					
					if (targetedid){document.querySelector("#"+targetedid).classList.remove(this.enabledOptionsClasseName)}
				}
			}		
			let modalcadre = document.createElement("div")
			modalcadre.id = "options-modal-cadre"
			modalcadre.className = "options-modal-cadre"			
			modalcadre.appendChild(modalTitle)
			// modalcadre.setAttribute('role', 'document')
				let modalcontent = document.createElement("div")
				modalcontent.id = 'options-modal-contenu'
				modalcontent.className = "options-modal-contenu"				
				modalcadre.appendChild(modalcontent)
				modalTitle = document.createElement("div")
				modalTitle.className='modalOptionsTitre'
				modalTitle.textContent = "SEARCH"
				modalcontent.appendChild(modalTitle)
				// SLIDER RESULTS PER PAGE
				let sliderdiv = document.createElement("div")
				sliderdiv.className="option-col"
				let sliderinfo = document.createElement("div")
				sliderinfo.className="div-res-per-page-info"
				sliderinfo.textContent = "Result" + (this.limitPerPage > 1 ? 's' : '') + " wanted per page: " + this.limitPerPage
				let resperpage = document.createElement("input")
				resperpage.id = "limitPerPage"
				resperpage.className = "slide-res-per-page"
				resperpage.setAttribute('type',"range")
				resperpage.setAttribute('min',"1")
				resperpage.setAttribute('max',"100")
				resperpage.setAttribute('value',this.limitPerPage)
				resperpage.setAttribute('type',"range")
				resperpage.setAttribute('type',"range")
				resperpage.oninput = (e) => {
					this.set_This('modaloptions', 'limitPerPage', e.target.value)
					sliderinfo.textContent = "Result" + (e.target.value < 2 ? '' : 's') + " wanted per page: " + e.target.value;
				}
				sliderdiv.appendChild(sliderinfo)
				sliderdiv.appendChild(resperpage)
				modalcontent.appendChild(sliderdiv)
				// END SLIDER RESULTS PER PAGE
				modalTitle = document.createElement("div")
				modalTitle.className='modalOptionsTitre'
				modalTitle.textContent = "ANIMATIONS"
				modalcontent.appendChild(modalTitle)
					modalcontent.appendChild(this.make_Options('modalSpinnerText','Spinner','vinylButon'))
					modalTitle = document.createElement("div")
					modalTitle.className='modalOptionsTitre'
					modalTitle.textContent = "DEBUG"
					modalcontent.appendChild(modalTitle)
					modalcontent.appendChild(this.make_Options('modalDebugText','Debug lv1','debug'))
					modalcontent.appendChild(this.make_Options('modalOptionsDebugText','Debug lv2','optionsdebug'))

					
					modalTitle = document.createElement("div")
					modalTitle.className='modalOptionsTitre'
					modalTitle.textContent = "SERVICES"
					modalcontent.appendChild(modalTitle)
					modalcontent.appendChild(this.make_Hystory('modalOldSearch2','History','showOldSearch','oldSearch'))
					// More
					
					let moretodo = document.createElement("div")
					moretodo.className='modalOptionsTitre'
					moretodo.textContent = "TODO VALUES..."
					modalcontent.appendChild(moretodo)
					let todo = document.createElement("div")
					todo.className='option-row'
					todo.textContent = "max chars in search: " + this.maxchar
					modalcontent.appendChild(todo)
					todo = document.createElement("div")
					todo.className='option-row'
					todo.textContent = "Min chars in search: " + this.minchar
					modalcontent.appendChild(todo)

					moretodo = document.createElement("div")
					moretodo.className='modalOptionsTitre'
					moretodo.textContent = "TODO COLORS..."
					modalcontent.appendChild(moretodo)
					todo = document.createElement("div")
					todo.className='option-row'
					todo.textContent = "Bg color: " 
					modalcontent.appendChild(todo)


					modalcadre.appendChild(modalcontent)
				modalOptions.appendChild(modalcadre)
			document.body.appendChild(modalOptions)
			this.optionsdebug ? console.log('ok modal options true') : ''
		}
		else{
			if(optionmodal){
				optionmodal.parentNode.removeChild(optionmodal)
				this.optionsdebug ? console.log(' '+targetedid) : ''
				document.querySelector("#"+targetedid).classList.remove(this.enabledOptionsClasseName)
				this.optionsdebug ? console.log(document.querySelector("#"+targetedid).classList) : ''
			}
		}
	}
	
	make_Options(texteId,textContent,thisValueName){
					let modalOption = document.createElement("div")
					modalOption.className = 'option-row'
						let modalLabel = document.createElement("label")
						modalLabel.className="switch"
						let modalText = document.createElement("span")
						modalText.id = texteId
						modalText.className = 'spinner-text'
						modalText.textContent = textContent + " is " + (this[thisValueName] ? 'on' : 'off')
						let modalInput = document.createElement("input")
						modalInput.onclick = (e) => {
							this.set_This('modalOptions',thisValueName, e.target.checked)
							this[thisValueName] ? console.log(thisValueName + ': ' + this[thisValueName]) : ''
							document.querySelector("#"+texteId).textContent = textContent + " is " + (this[thisValueName] ? 'on' : 'off')
						}
						modalInput.setAttribute('type',"checkbox")
						modalInput.checked = this[thisValueName]
						let modalSlider = document.createElement("span")
						modalSlider.className = 'slider round'

						modalLabel.appendChild(modalInput)
						modalLabel.appendChild(modalSlider)
						modalOption.appendChild(modalText)
						modalOption.appendChild(modalLabel)
						return modalOption
	}

	make_Hystory(texteId,textContent,thisValueName){
					let full = document.createElement("div")
					full.className = 'fullhystory'
					let modalOption = document.createElement("div")
					modalOption.className = 'option-row'
						let modalLabel = document.createElement("label")
						modalLabel.className="switch"
						let modalText = document.createElement("span")
						modalText.id = texteId
						modalText.className = 'spinner-text'
						let letexte = (
								(this.oldSearch.length>0)
								? this.oldSearch.length + " "
								: 'No '
							)	+
							"current search" +
							(
								this.oldSearch.length > 1
								? "s" 
								: ""
							) 
						modalText.textContent = textContent + ' is ' + (this[thisValueName] ? 'on' : 'off') + ' ( ' + letexte + ')'
						this.optionsdebug ? console.log(thisValueName + ': ' + this[thisValueName]) : ''
						let modalInput = document.createElement("input")
					let modaloldsearch = document.createElement("div")
					modaloldsearch.id = 'oldsearch'
					modaloldsearch.className = this[thisValueName] ? 'oldsearch' : 'oldsearch off'
					for (let i = 0; i < this.oldSearch.length; i++){
						let br = document.createElement("br")
						let item = document.createElement("a")
						item.setAttribute('href', this.oldSearch[i].url)
						item.setAttribute('title', decodeURI(this.oldSearch[i].recherche))
						item.setAttribute('target', "_out")
						item.textContent = decodeURI(this.oldSearch[i].recherche)
						modaloldsearch.appendChild(item)
						modaloldsearch.appendChild(br)
						item = document.createElement("span")
						item.textContent = " (" + this.oldSearch[i].select + ")"
						modaloldsearch.appendChild(item)
						modaloldsearch.appendChild(br)
						item = document.createElement("span")
						item.textContent = " " + this.oldSearch[i].nbreponse + "Resp"
						modaloldsearch.appendChild(item)
						modaloldsearch.appendChild(br)
						item = document.createElement("span")
						item.textContent = " (" + this.oldSearch[i].date + ")"
						modaloldsearch.appendChild(item)
						modaloldsearch.appendChild(br)
					}
						modalInput.onclick = (e) => {
							this.set_This('modalOptions',thisValueName, e.target.checked)
							document.querySelector("#"+texteId).textContent = textContent + " is " + (this[thisValueName] ? 'on' : 'off')
							this.debug ? console.log(thisValueName + ': ' + this[thisValueName]) : ''
							document.querySelector("#oldsearch").classList = this[thisValueName] ? 'oldsearch' : 'oldsearch off'
						}
						modalInput.setAttribute('type',"checkbox")
						modalInput.checked = this[thisValueName]
						let modalSlider = document.createElement("span")
						modalSlider.className = 'slider round'
						modalLabel.appendChild(modalInput)
						modalLabel.appendChild(modalSlider)
						modalOption.appendChild(modalText)
						modalOption.appendChild(modalLabel)
						full.appendChild(modalOption)
						full.appendChild(modaloldsearch)
						return full
	}
	// menu footer
	make_footer(){
		let nbItemsInFooter = 3
		let textesItems = ['options','github','muzicbrainz','boostrap','fontawesome','awesome']
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
				bouttonitem.prepend(this.capital(textesItems[i]))
				bouttonitem.prepend(awesomeicone)
					bouttonitem.addEventListener('click',(event)=>{
						this.animefooter(event,actionItems[i],urlItems[i])
					})
					footeritems.appendChild(bouttonitem)
					footer.appendChild(footeritems)
			}
		}
	}
	capital(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	animefooter(e,action,url){
		let allup = document.getElementsByClassName(this.origineOptionsClasseName +  ' ' + this.enabledOptionsClasseName)
		this.optionsdebug ? console.log("clicked") : ''
		for (let j = 0;j<allup.length;j++){
			allup[j].classList.remove(this.enabledOptionsClasseName)
		}
		switch (action){
			case 'link':
				window.open(url)
			break;
			case 'modal':
				event.target.classList.add(this.enabledOptionsClasseName)
				this.make_ModalOptions(event.target.id)
			break;
			default:
				event.target.classList.add(this.enabledOptionsClasseName)
			break;
		}
	}
}
let Zik = new Muzica('musika')
Zik.listener()
Zik.fresh_HtmlPage()