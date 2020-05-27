"use strict";
class Muzica {
	constructor(muzica) {
		this.Version = 10
		console.groupCollapsed('api version ' + this.Version + ' vanilla js')
		console.log('ecf javascript 2020')
		console.log('https://github.com/patobeur/Muzica')
		console.log('Thx you DWWM2 2020')
		console.log('Full hugs from P4t0b3ur !!!')
		this.showOldSearch = false // to do

		this.debug = true // affiche en console si true
		this.modalFooter = false // youtube & close bottom buttons on modal layout
		this.nbSubmitDie = 5 // nb max de submit si recherche vide avant de bloquer
		this.vinylButon = true // n'apparait pas lors de la recherche si true 
		this.vinyl_enabled = true
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

		this.lesAnciennesRecherches = []
		this.urlmbid = ''
		this.mbid = ''
		//
		this.urlDatas = {
			"methode": 'GET',
			"url": 'https://musicbrainz.org/ws/2/',
			"inc": '/?fmt=json' + '&query=',
			"arts": 'https://coverartarchive.org/release/',
			"fmt": '?fmt=json',
			"rel": '&inc=genres+ratings+artists+releases'
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
			}
		}
		console.groupEnd()
	}
	set_OldSearch(datas) {
		this.lesAnciennesRecherches.push({
			"date": this.get_Date(),
			"recherche": (datas[0] ? datas[0] : null),
			"url": (datas[1] ? datas[1] : null),
			"nbreponse": (datas[2] ? datas[2] : null),
			"select": (datas[3] ? datas[3] : null)
		})
	}
	// HERE WE LISTEN DIF-PARTS OF THE PAGE
	listener() {
		// Listening hover submit
		document.querySelector('#rechercher').addEventListener('mouseover', (event) => {
			let notempty = document.querySelector('#' + this.inputSearch).value != '' ? true : false
			this.set_submit_onoff(notempty)
		})
		// Listening Keaboard
		document.addEventListener('keydown', (e) => {
				let modal = document.querySelector('#'+this.modalName);
				// escape close the modal
				if (e.keyCode === 27 && modal) {
					modal.parentNode.removeChild(modal)
				}
			}
		);
		// Listening submit
		document.querySelector('#' + this.formName).addEventListener('submit', (event) => {
				event.preventDefault()
				this.reinit_search() // remise a zero
				// if (this.is_Actif()) {
					// getting search words in input
					let marecherche = document.querySelector('#' + this.inputSearch).value;
					if (marecherche && marecherche != '') {
						this.set_This('Listener', 'actualOffset', 0)
						this.set_This('Listener:', 'maRecherche', this.set_CleanString(marecherche))
						this.get_ReqRecordings()
					} else {
					}
				// }
			}
		)
		// Listening selects menu
		document.querySelector('#' + this.inputSelect).addEventListener('change', (event) => {
			console.clear()
			let index = event.target.selectedIndex
			document.querySelector('.searchbloc').style.marginTop = null
			let ladiv = document.querySelector('#' + this.inputSelect)
			let maSelection = this.set_CleanString(event.target.value)
			if (maSelection && maSelection != '') {
				this.set_This('Listener', 'maSelection', maSelection)
				this.set_This('set_CleanNewSearch', 'actualOffset', 0)
				this.set_CleanNewSearch()
				event.target[index].setAttribute('selected', true)
				
			}
			document.querySelector('#' + this.inputSelect).blur()
		})
		// spinner on off
		document.querySelector('#vinyl-bouton').addEventListener('click', (event) => {
			this.myOldVinylButon()
		})
	}

	// Setters
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
	set_Pagination() {
		let bloc = ''
		if (this.nbReponses < 1) {
			if (document.querySelector('#pagination')) {
				let aEffacer = document.querySelector('#pagination')
				aEffacer.parentNode.removeChild(aEffacer)
			}
		}
		else if (this.nbReponses > this.limitPerPage){
			// pagination group
			let pagination = document.createElement("nav")
			pagination.id = 'pagination'
			pagination.className = 'pagination justify-content-center'
			pagination.setAttribute('aria-label', 'Page navigation example')
			// pagination button group
			let pag_buttons = document.createElement("ul")
			pag_buttons.className = 'pagination justify-content-end pagination-sm'
			// previous
			let pag_previous = document.createElement("li")
			pag_previous.className = 'page-item' + (this.actualOffset < this.limitPerPage + 1 ? ' disabled' : '')
			let pag_previous_link = document.createElement("a")
			pag_previous_link.className = 'page-link'
			pag_previous_link.setAttribute('href', '#')
			pag_previous_link.setAttribute('tabindex', '-1')
			pag_previous_link.setAttribute('aria-disabled', 'true')


			pag_previous_link.textContent = 'Previous'
			pag_previous.appendChild(pag_previous_link)
			if (this.actualOffset > this.limitPerPage + 1) {
				pag_previous.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', (this.actualOffset - this.limitPerPage))
						this.get_ReqRecordings()
					},{once: false}
				)
			}
			pag_buttons.appendChild(pag_previous)
			// page link
			this.nbPages = Math.trunc((this.nbReponses / this.limitPerPage))
			let max = (this.nbPages > 1) ? (this.nbPages < 10) ? this.nbPages + 1 : 10 : this.nbPages
			for (let i = 0; i < max; i++) {
				let title = 'page ' + ((this.limitPerPage * i) + 1) + ' à ' + ((this.limitPerPage * (i + 1)) + 1)
				let pag_button = document.createElement("li")
				pag_button.className = 'page-item' + ((((this.limitPerPage * i) + 1) == this.actualOffset) ? ' active' : '')

				let pag_button_link = document.createElement("a")
				pag_button_link.className = 'page-link'
				pag_button_link.setAttribute('href', '#')
				pag_button_link.setAttribute('title', title)
				pag_button_link.textContent = ((this.limitPerPage * i) + 1)

				pag_button.appendChild(pag_button_link)

				pag_button.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', ((this.limitPerPage * i) + 1))
						this.get_ReqRecordings()
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
			pag_next_link.textContent = 'Next'
			pag_next.appendChild(pag_next_link)
			if (this.actualOffset < (this.nbReponses - this.limitPerPage)) {
				pag_next.addEventListener('click', (e) => {
						this.set_This('set_Pagination', 'actualOffset', (this.limitPerPage + this.actualOffset))
						this.get_ReqRecordings()
					},
					{once: false}
				)
			}
			pag_buttons.appendChild(pag_next)
			pagination.appendChild(pag_buttons)
			// 
			if (document.querySelector('#pagination')) {
				let aEffacer = document.querySelector('#pagination')
				aEffacer.parentNode.removeChild(aEffacer)
				document.querySelector('#cardtable').prepend(pagination)
			}
			else {
				document.querySelector('#cardtable').prepend(pagination)
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


	set_images(resultats, mbid) {
		if (resultats && resultats['images']) {
			console.log(resultats.images.length + ' image(s)')
			for (var i in resultats.images) {
				resultats.images[i].thumbnails.small ? this.modal_AddContent(true, 'div', 'arts-' + mbid, this.ModalAddImage(resultats.images[i].thumbnails.small, 'modal-vignette', mbid), 'image-' + mbid, 'modalinfo-item') : ''
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
	// GETTERS 
	get_ReqRecordings() {
		this.initialise
		this.set_NbSubmitPlus1() // incrementation
		this.set_CleanNewSearch() // update and/or reset old datas
		this.set_FullUrl() // set new url with clean data
		this.set_This('get_ReqRecordings', 'vinyl_searching', true)
		if (this.vinylButon) {
			this.myOldVinyl(true)
		}
		// request
		let MonPost = new XMLHttpRequest()
		MonPost.open(this.urlDatas.methode, this.urlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		MonPost.onreadystatechange = (e) => {
			// console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status)
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultat = JSON.parse(MonPost.responseText)
				this.set_This('get_ReqRecordings', 'reponseReq', resultat)
				// set nb response for pagination
				this.set_This('get_ReqRecordings', 'nbReponses', this.reponseReq.count)
				// old searchs
				this.set_OldSearch([this.maRecherche, this.urlDemandee, this.nbReponses])
				//
				// this.debug ? console.log(this.reponseReq.recordings) : ''
				if (this.vinylButon && this.vinyl_searching) {
					this.myOldVinyl(false)
				}
				this.set_This('get_ReqRecordings', 'vinyl_searching', false)
				this.refresh_ResponsTable()
			}
		}
		this.debug ? console.log('get all Records at : ' + this.urlDemandee) : ''
		MonPost.send()
	}

	get_ReqReleaseByRecordingsId(oneRecord){
		let MonPost = new XMLHttpRequest()
		let urlDemandee = 'https://musicbrainz.org/ws/2/recording/' + oneRecord.id + this.urlDatas['fmt'] + this.urlDatas['rel']
		// 660404c9-a3e5-43c5-bd76-4339b00190e6?inc=genres+ratings+artists+releases

		MonPost.open(this.urlDatas.methode, urlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		MonPost.onreadystatechange = (e) => {
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultats = JSON.parse(MonPost.responseText)
				// this.debug ? console.log('B resultats: ') : ''
				// this.debug ? console.log(resultats) : ''
				
				this.make_Modal(resultats)
			}
		}
		this.debug ? console.log('get all Releases from a Record_id at : ' + urlDemandee) : ''
		MonPost.send()
	}
	get_ReqArtsByReleaseId(mbid) {
		let MonPost = new XMLHttpRequest()
		let urlDemandee = this.urlDatas['arts'] + mbid + this.urlDatas['fmt']

		MonPost.open(this.urlDatas.methode, urlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		MonPost.onreadystatechange = (e) => {
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultats = JSON.parse(MonPost.responseText)
				this.debug ? console.log('all images from Release_Id : '+ mbid) : ''
				this.debug ? console.log(resultats) : ''
				this.set_images(resultats, mbid)
				return resultats
			}
			else{
				// console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status)
			}
		}
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		this.debug ? console.log('get all arts from a Release_id at : ' + urlDemandee) : ''
		MonPost.send()
	}

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
	
	// Checkers
	// is_Actif() {
	// 	return this.nbSubmit <= this.nbSubmitDie ? true : false
	// }
	
	reinit_search() {
		this.set_This('reinit_search', 'reponseHtml', '')
		this.set_This('reinit_search', 'reponseReq', null)
		this.set_This('reinit_search', 'nbSubmit', 0)
		this.set_This('reinit_search', 'maRecherche', '')
		// this.set_This('reinit_search','maSelection',null)
	}

	// Makers
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
				if (oneRecord['releases']) {
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
				} else {
					// no release
				}
				item.textContent = oneRecord['title']
				item.textContent = (oneRecord['releases'] && oneRecord['releases'][0]) 
					? oneRecord['releases'][0].title
					: this.nodata
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
							this.get_ReqReleaseByRecordingsId(record)
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


	make_Modal(lesreleases) {
		this.debug ? console.log('lesreleases') : ''
		this.debug ? console.log(lesreleases) : ''
		

		if (!document.querySelector('#fond-modal')) {
			let modalalbum = document.createElement("div")
			modalalbum.id = "rel_modal"
			modalalbum.className = "rel-modal-fs"
				let modaldialog = document.createElement("div")
				modaldialog.id = "rel-modal-cadre"
				modaldialog.className = "rel-modal-cadre"
				// modaldialog.setAttribute('role', 'document')
					let modalcontent = document.createElement("div")
					modalcontent.id = 'rel-contenu-modal'
					modalcontent.className = "rel-modal-contenu"
			modaldialog.appendChild(modalcontent)
			modalalbum.appendChild(modaldialog)
			document.body.appendChild(modalalbum)

			this.modal_AddContent(true, 'div', 'rel-contenu-modal', null, 'rel-modal-contenu-contenu', 'rel-modal-contenu-contenu')
				this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu', "Informations", 'rel-modal-contenu-contenu-info', 'rel-modal-contenu-contenu-info')

					// let rec_score = lesreleases['score'] ? lesreleases['score'] : false
					// rec_score ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Score: " + rec_score + '%', 'modalscore', 'rel-modal-contenu-contenu-info-item') : 'vide'
					// let rec_isrcs = lesreleases['isrcs'] ? lesreleases['isrcs'] : false
					// this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "isrcs: " + (rec_isrcs ? rec_isrcs : 'vide'), 'modalisrcs', 'rel-modal-contenu-contenu-info-item')

					lesreleases['title']
					
					let rec_title = lesreleases['title'] ? lesreleases['title'] : false
					rec_title ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Title: " + rec_title + '.', 'modaltitle', 'rel-modal-contenu-contenu-info-item') : 'vide'
					
					let rec_artistcredit = lesreleases['artist-credit'] ? lesreleases['artist-credit'] : false
					rec_artistcredit ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Artists: " + this.getall_tag(rec_artistcredit, 'name') + '.', 'modalartists', 'rel-modal-contenu-contenu-info-item') : 'vide'
					
					// let rec_id = lesreleases['id'] ? lesreleases['id'] : false
					// this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "id: " + (rec_id ? rec_id : 'vide'), 'modalid', 'rel-modal-contenu-contenu-info-item')

					let rec_genres = lesreleases['genres'] ? lesreleases['genres'] : false
					rec_genres ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Genres: " + this.getall_tag(rec_genres, 'name') + '.', 'modalgenres', 'rel-modal-contenu-contenu-info-item') : 'vide'
					
					
					let rec_length = lesreleases['length'] ? lesreleases['length'] : false
					rec_length ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Length: " + this.make_Pylformat(rec_length), 'modallength', 'rel-modal-contenu-contenu-info-item') : ''
					
					let rec_rating = lesreleases['rating'] ? lesreleases['rating'].value : 0
					let rec_votescount = lesreleases['votes-count'] ? lesreleases['votes-count'].value : 0
					rec_rating ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Rating value: " + rec_rating, 'modalrating', 'rel-modal-contenu-contenu-info-item') : ''
					this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Note : " + this.set_Stars(rec_votescount), 'modalnote', 'rel-modal-contenu-contenu-info-item')

					// let rec_video = lesreleases['video'] ? lesreleases['video'] : false
					// rec_video ? this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Video: " + rec_video, 'modalvideo', 'rel-modal-contenu-contenu-info-item') : ''

				// RELEASES
				this.modal_AddContent(true, 'div', 'rel-modal-contenu-contenu', '', 'lesreleases', 'lesreleases')
				let relCount = 0
				for (let released in lesreleases['releases'])
				{
					let lereleased = lesreleases['releases'][released]	
					// let rel_count = lereleased['count'] ? lereleased['count'] : false
					//this.modal_AddContent(true, 'div', rel_divid, "Count: " + (rel_count ? rel_count : 'vide'), 'modal-rel-count-' + relCount, 'modalinfo-item')
					let rel_divid = 'release-' + lereleased['id']
					let rel_title = lereleased['title'] ? lereleased['title'] : false
					let titlerelease = document.createElement("h6")
					titlerelease.className = "modal-rel-title"
					titlerelease.textContent =  " Album : " + ((rel_title) ? rel_title : 'vide')
					this.modal_AddContent(true, 'div', 'lesreleases', titlerelease , rel_divid, 'unerelease')
					// let rel_id = lereleased['id'] ? lereleased['id'] : false
					// this.modal_AddContent(true, 'div', rel_divid, "Id: " + (rel_id ? rel_id : 'vide'), 'modal-rel-id-' + relCount, 'modalinfo-item')
					// let rec_genres = lereleased['genres'] ? lereleased['genres'] : 'vide'
					// rec_genres ? this.modal_AddContent(true, 'div', rel_divid, "Genres: " + this.getall_tag(rec_genres, 'name') + '.', 'modalgenres', 'modalinfo-item') : 'vide'
					// let rel_artistcredit = lereleased['artist-credit'] ? lereleased['artist-credit'] : false	
					// this.modal_AddContent(true, 'div', rel_divid, "Release Artists: " + (rel_artistcredit ? this.getall_tag(rel_artistcredit, 'name') + '.' : 'vide'), 'modal-rel-artist-' + relCount, 'modalinfo-item')
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
					
					this.get_ReqArtsByReleaseId(lereleased['id'])

					relCount++
				}
			this.modal_AddHeader('div', 'rel-contenu-modal', (lesreleases['artist-credit'] && lesreleases['artist-credit'][0]) ? lesreleases['artist-credit'][0].name + ' - ' + lesreleases['title'] : 'vide')
			this.modal_AddFooter('div', 'rel-contenu-modal')
		}
	}

	// modal stuff
	modal_AddHeader(tag, destId, leString) {
		let cible = document.querySelector('#' + destId)
		let modalheader = document.createElement(tag)
		modalheader.className = "modal-headerx"
		modalheader.className = "rel-modal-contenu-header"
		let modaltitle = document.createElement("h6")
		modaltitle.id = "modalLabelx"
		modaltitle.className = "rel-modal-contenu-header-label"
		modaltitle.textContent = leString

		let modalbutton = document.createElement("button")
		modalbutton.id = "modalClosex"
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

	set_imagesTempo(mbid) {
		this.modal_AddContent(true, 'div', 'arts-' + mbid, this.modal_AddImage('toto', 'modal-vignette-tempo', mbid), 'tempo-' + mbid, 'modalinfo-item')
		ajout.src = 'assets/theme/spinner.jpg'
	}
	ModalAddImage(lurl, laClass, mbid) {
		let ajout = document.createElement('img')
		ajout.id = 'vig-' + mbid
		ajout.className = laClass
		ajout.style.width = '250px'
		ajout.src = lurl
		return ajout
		// var img = new Image();
		// img.onload = function() {
		// 	document.querySelector('#vig-' + mbid).src = lurl
		// }
		// img.src = lurl
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

	// html refreshs
	get_HtmlPage() {
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
		card.className = "cardx shadow mb-4"

		let cardheader = document.createElement("div")
		cardheader.className = "card-header py-3"

		let cardresponse = document.createElement("div")
		cardresponse.id = "lareponse"
		cardresponse.className = "m-0 font-weight-bold text-primary"
		// cardresponse.textContent = "nb Results"

		let cardbody = document.createElement("div")
		cardbody.className = "card-bodyx"

		let tableresponsive = document.createElement("div")
		tableresponsive.className = "table-responsive"

		let table = document.createElement("table")
		table.id = "datatable"
		// table.id = "musika-reponse"
		table.className = "table table-bordered table-striped table-hover table-sm"
		// table.style.width = "100%"
		// table.style.cellspacing = "0"

		let tablecaption = document.createElement("caption")
		containertableau.textContent = 'Recording List / Liste des albums';
		table.appendChild(tablecaption)
		
		tableresponsive.appendChild(table)
		cardheader.appendChild(cardresponse)
		card.appendChild(cardheader)

		cardbody.appendChild(tableresponsive)
		card.appendChild(cardbody)

		containertableau.appendChild(card)

		this.make_SelectMenu()
	}
	refresh_ResponsTable() {
		document.querySelector("#lareponse").textContent = this.nbReponses + " Résultat" + ((this.nbReponses > 1) ? 's.' : '.')

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
	make_awesomeico(string){
		let awesomeico = document.createElement("i")
		awesomeico.className = string
		return awesomeico
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
	set_This(Func, Nom, Value) {
		// var oldValue = this[Nom]
		//console.log('(' + Func + ') set_(' + Nom + ': "' + oldValue + '" to "' + Value + '")')
		this[Nom] = Value
	}
	get_This(Func, Nom) {
		// console.log('(' + Func + ') Get_(' + Nom + '="' + this[Nom] + '")')
		return this[Nom]
	}
	make_Pylformat(number) {
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

	// todo 
	set_Stars(score) {
		let empty = "☆"
		let full = "★"
		let stars = ''
		for(let i= 0;i < 5; i++){
			stars += score>i ? full : empty
		}
		return stars
	}
}

let Zik = new Muzica('musika')
Zik.listener()
Zik.get_HtmlPage()