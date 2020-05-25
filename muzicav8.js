"use strict";
class Muzica {
	constructor(muzica) {
		this.Version = 8
		console.groupCollapsed('muzica' + 'V' + this.Version + '.js')
		console.log('constructor()')
		// console.trace()
		//
		this.Debug = true // affiche en console si true
		this.nbSubmitDie = 5 // nb max de submit si recherche vide avant de bloquer
		// this.nbSubmitMax = 3							// nb max de submit si recherche vide
		this.nbSubmit = 0 // nb couranbt de recherche vide
		// info nav
		this.limitPerPage = 25 // nb couranbt de recherche videoffset
		this.ActualOffset = 0 // nb couranbt de recherche videoffset
		this.NbReponses = 0
		this.NbPages = 0
		//
		this.InputSearch = 'marecherche' // contenu du value dans le input recherche
		this.InputSubmit = 'rechercher' // contenu du value dans le submit 
		this.InputSelect = 'maselection' // contenu du value dans le option select
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

		this.vinyl_Buton = true // n'apparait pas lors de la recherche si true 
		this.vinyl_enabled = true
		this.vinyl_searching = false // true si recherche en cours

		this.urlmbid = ''
		this.mbid = ''
		//
		this.UrlDatas = {
			"methode": 'GET',
			"url": 'https://musicbrainz.org/ws/2/',
			"inc": '/?fmt=json' + '&query=',
			"arts": 'https://coverartarchive.org/release/',
			"fmt": '?fmt=json'
		}
		//
		this.Famillia = {
			'default': {
				"name": "default",
				"texteselect": "EveryThing",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"]
			},
			'artist': {
				"name": "artist",
				"texteselect": "Artiste",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"]
			},
			'recording': {
				"name": "recording",
				"texteselect": "Title",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"]
			},
			'release': {
				"name": "release",
				"texteselect": "Album",
				"type": "recording",
				"SearchCategorie": "recordings",
				"intitules": ["#", "artist", "title", "album", "actions"],
				"SearchTag": ["artist", "release", "recording"]
			}
		}
		this.modalName = 'rel_modal'
		this.lesAnciennesRecherches = []
		console.groupEnd()
	}
	ajouterAuxAnciennesRecherches(datas) {
		this.lesAnciennesRecherches.push({
			"date": this.Get_Date(),
			"recherche": datas[0],
			"maselection": datas[1],
			"nbreponse": datas[2]
		})
	}
	Listener() {
		// close modal hit esc
		document.addEventListener('keydown', (e) => {
				var modal = document.querySelector('#'+this.modalName);
				if (e.keyCode === 27 && modal) {
					modal.parentNode.removeChild(modal)
				}
			}
		);
		// submit
		document.querySelector('#' + this.InputSubmit).addEventListener('submit', (event) => {
				event.preventDefault()
				this.StartFromScratch() // remise a zero
				if (this.IsActif()) {
					// getting search words in input
					let marecherche = document.querySelector('#' + this.InputSearch).value;
					if (marecherche && marecherche != '') {
						console.log('Recherche lancée')
						this.set_This('Listener', 'ActualOffset', 0) // stockage
						this.set_This('Listener:', 'MaRecherche', this.Set_CleanString(marecherche)) // stockage
						this.GetRecordings()
					} else {
						console.log('Recherche Vide')
					}
				}
			}
		)
		// champs recherche
		document.querySelector('#' + this.InputSelect).addEventListener('change', (event) => {
			console.clear()
			var index = event.target.selectedIndex;
			document.querySelector('.searchbloc').style.marginTop = null
			let ladiv = document.querySelector('#' + this.InputSelect)
			var MaSelection = this.Set_CleanString(event.target.value)
			if (MaSelection && MaSelection != '') {
				this.set_This('Listener', 'MaSelection', MaSelection) // stockage
				this.set_This('Set_CleanNewSearch', 'ActualOffset', 0) // stockage
				this.Set_CleanNewSearch()
				event.target[index].setAttribute('selected', true)
			}
			document.querySelector('#' + this.InputSelect).blur()
		})
		// spinner on off
		document.querySelector('#vinyl-bouton').addEventListener('click', (event) => {
			this.myOldVinylButon()
		})
	}

	// Setters
	Set_Pagination() {
		let bloc = ''
		if (this.NbReponses < 1) {
			if (document.querySelector('#pagination')) {
				let aEffacer = document.querySelector('#pagination')
				aEffacer.parentNode.removeChild(aEffacer)
			}
		}
		else if (this.NbReponses > this.limitPerPage){
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
			pag_previous.className = 'page-item' + (this.ActualOffset < this.limitPerPage + 1 ? ' disabled' : '')
			var pag_previous_link = document.createElement("a")
			pag_previous_link.className = 'page-link'
			pag_previous_link.setAttribute('href', '#')
			pag_previous_link.setAttribute('tabindex', '-1')
			pag_previous_link.setAttribute('aria-disabled', 'true')
			pag_previous_link.textContent = 'Previous'
			pag_previous.appendChild(pag_previous_link)
			if (this.ActualOffset > this.limitPerPage + 1) {
				pag_previous.addEventListener('click', (e) => {
						this.set_This('Set_Pagination', 'ActualOffset', (this.ActualOffset - this.limitPerPage)) // stockage
						this.GetRecordings()
					},{once: false}
				)
			}
			pag_buttons.appendChild(pag_previous)
			// page link
			this.NbPages = Math.trunc((this.NbReponses / this.limitPerPage))
			let max = (this.NbPages > 1) ? (this.NbPages < 10) ? this.NbPages + 1 : 10 : this.NbPages
			for (let i = 0; i < max; i++) {
				let title = 'page ' + ((this.limitPerPage * i) + 1) + ' à ' + ((this.limitPerPage * (i + 1)) + 1)
				var pag_button = document.createElement("li")
				pag_button.className = 'page-item' + ((((this.limitPerPage * i) + 1) == this.ActualOffset) ? ' active' : '')

				// version button
				// let itembutton = document.createElement("button")
				// itembutton.setAttribute('title', title)
				// itembutton.textContent = ( ( this.limitPerPage * i ) + 1 )
				// itembutton.className = 'btn btn-secondary btn-sm'	
				// 	var iconebutton = document.createElement("i")
				// 	iconebutton.className = this.IconeVoirAlbum + ' voirlafiche'
				// 	itembutton.appendChild(iconebutton)
				// pag_button.appendChild(itembutton)

				var pag_button_link = document.createElement("a")
				pag_button_link.className = 'page-link'
				pag_button_link.setAttribute('href', '#')
				pag_button_link.setAttribute('title', title)
				pag_button_link.textContent = ((this.limitPerPage * i) + 1)

				pag_button.appendChild(pag_button_link)

				pag_button.addEventListener('click', (e) => {
						this.set_This('Set_Pagination', 'ActualOffset', ((this.limitPerPage * i) + 1)) // stockage
						this.GetRecordings()
					},
					{once: false}
				)
				pag_buttons.appendChild(pag_button)
			}
			// NEXT
			//
			var pag_next = document.createElement("li")
			pag_next.className = 'page-item' + (this.ActualOffset <= (this.NbReponses - this.limitPerPage) ? '' : ' disabled')
			var pag_next_link = document.createElement("a")
			pag_next_link.className = 'page-link'
			pag_next_link.setAttribute('href', '#')
			pag_next_link.textContent = 'Next'
			pag_next.appendChild(pag_next_link)
			if (this.ActualOffset < (this.NbReponses - this.limitPerPage)) {
				pag_next.addEventListener('click', (e) => {
						this.set_This('Set_Pagination', 'ActualOffset', (this.limitPerPage + this.ActualOffset)) // stockage
						this.GetRecordings()
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

	Set_FullUrl() {
		let limit = "&limit=" + this.limitPerPage;
		let fullsearch = '';
		if (this.MaSelection == 'default') {
			for (let i = 0; i < this.FullColonnes.length; i++) {
				fullsearch = fullsearch + (i > 0 ? ' OR ' : '') + this.FullColonnes[i] + ':' + '"' + this.MaRecherche + '"'
			}
		} else {
			fullsearch = this.MaSelection + ':"' + this.MaRecherche + '"'
		}
		this.set_This('Set_FullUrl', 'UrlDemandee', this.UrlDatas.url + this.TypeActuel + this.UrlDatas.inc + fullsearch + limit + '&offset=' + this.ActualOffset) // stockage
	}

	set_This(Func, Nom, Value) {
		// var oldValue = this[Nom]
		//console.log('(' + Func + ') Set_(' + Nom + ': "' + oldValue + '" to "' + Value + '")')
		this[Nom] = Value
	}
	Get_This(Func, Nom) {
		// console.log('(' + Func + ') Get_(' + Nom + '="' + this[Nom] + '")')
		return this[Nom]
	}

	Set_nbSubmitPlus1() {
		this.nbSubmit = this.nbSubmit + 1
	}

	GetRecordings() {
		this.initialise
		this.Set_nbSubmitPlus1() // incrementation
		this.Set_CleanNewSearch() // update and/or reset old datas
		this.Set_FullUrl() // set new url with clean data
		this.set_This('GetRecordings', 'vinyl_searching', true)
		if (this.vinyl_Buton) {
			this.myOldVinyl(true)
		}
		// request
		var MonPost = new XMLHttpRequest()
		MonPost.open(this.UrlDatas.methode, this.UrlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		MonPost.onreadystatechange = (e) => {
			// console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status)
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultat = JSON.parse(MonPost.responseText)
				this.set_This('GetRecordings', 'ReponseReq', resultat) // stockage
				// old searchs
				this.ajouterAuxAnciennesRecherches([this.MaRecherche, this.UrlDemandee, this.NbReponses])
				// set navigation
				this.set_This('GetRecordings', 'NbReponses', this.ReponseReq.count) // stockage
				//
				console.log(this.ReponseReq)
				if (this.vinyl_Buton && this.vinyl_searching) {
					this.myOldVinyl(false)
				}
				this.set_This('GetRecordings', 'vinyl_searching', false)
				this.RefreshReponsesTable()
			}
		}
		MonPost.send()
	}

	get_arts(mbid) {
		var MonPost = new XMLHttpRequest()
		MonPost.open(this.UrlDatas.methode, this.UrlDatas['arts'] + mbid + this.UrlDatas['fmt'], true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		MonPost.onreadystatechange = (e) => {
			// console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status)
			// console.log('mbid:' + mbid)
			// console.log(this.UrlDatas['arts'] + mbid + this.UrlDatas['fmt'])
			if (MonPost.readyState == 4 && MonPost.status == 200) {
				let resultats = JSON.parse(MonPost.responseText)
				this.set_images(resultats, mbid)
				return resultats
			}
		}
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		MonPost.send()
	}

	set_images(resultats, mbid) {
		if (resultats && resultats['images']) {
			console.log(resultats.images.length)
			for (var i in resultats.images) {
				resultats.images[i].thumbnails.small ? this.ModalAddContent(true, 'div', 'arts-' + mbid, this.ModalAddImage(resultats.images[i].thumbnails.small, 'modal-vignette', mbid), 'image-' + mbid, 'modalinfo-item') : ''
			}
		}
	}
	Get_Date() {
		// var aujourdhui = Date.now()
		var today = new Date()
		return today.getDate() + '-' +
			today.getMonth() + '-' +
			today.getFullYear() + ' ' +
			today.getHours() + ':' +
			today.getMinutes() + ':' +
			today.getSeconds() + ':';
	}

	// Makers
	Set_CleanString(value) {
		if (value != '' && value != false && value != null) {
			if (value.length < 1) return false // 'texte trop cour';
			if (value.length > 50) return false // 'texte trop long';
			return encodeURIComponent(value)
		}
	}

	Set_CleanNewSearch() {
		this.set_This('Set_CleanNewSearch', 'TypeActuel', this.Famillia[this.MaSelection].type) // stockage
		this.set_This('Set_CleanNewSearch', 'ReqActuel', this.Famillia[this.MaSelection].SearchCategorie) // stockage
		this.set_This('Set_CleanNewSearch', 'FullColonnes', this.Famillia[this.MaSelection].SearchTag) // stockage
		this.set_This('Set_CleanNewSearch', 'ReponseHtml', '') // stockage
		this.set_This('Set_CleanNewSearch', 'ReponseReq', '') // stockage
	}

	Make_SelectMenu() {
		var indexfamillia = this.Famillia
		var MenuFamillia = document.querySelector('#maselection')
		for (var datas in indexfamillia) {
			var MenuOption = document.createElement("option")
			MenuOption.text = indexfamillia[datas]['texteselect']
			MenuOption.value = indexfamillia[datas]['name']
			MenuFamillia.add(MenuOption)
		}
		MenuFamillia.selectedIndex = 0
	}
	
	// Checkers
	IsActif() {
		return this.nbSubmit <= this.nbSubmitDie ? true : false
	}
	
	StartFromScratch() {
		this.set_This('StartFromScratch', 'ReponseHtml', '') // stockage
		this.set_This('StartFromScratch', 'ReponseReq', null) // stockage
		this.set_This('StartFromScratch', 'nbSubmit', 0) // stockage remise à zero des tentative de recherches vides
		this.set_This('StartFromScratch', 'MaRecherche', '') // stockage
		// this.set_This('StartFromScratch','MaSelection',null) 																					// stockage
	}

	TableauHtml() {
		if (this.ReponseReq) {
			// table body
			var tbody = document.createElement("tbody")
			let datas = this.ReponseReq[this.ReqActuel]
			let ligneId = this.ActualOffset
			for (var Objet of datas) {

				var trbody = document.createElement("tr")
				// line number col
				var item = document.createElement("td")
				item.className = 'idline'
				item.textContent = (ligneId)
				trbody.appendChild(item)
				// artist col
				var item = document.createElement("td")
				item.textContent = (Objet['artist-credit'] && Objet['artist-credit'][0]) ? Objet['artist-credit'][0].name : 'vide'
				item.setAttribute('title', 'artist-credit-id : ' + Objet['artist-credit'][0]['artist']['id'])
				trbody.appendChild(item)
				// title col
				var item = document.createElement("td")
				item.textContent = (Objet['title']) ? Objet['title'] : 'vide'
				trbody.appendChild(item)
				// album col
				var item = document.createElement("td")

				// liste release album col
				let nbreleased = 0
				if (Objet['releases']) {
					let lesreleases = ''
					for (var released in Objet['releases']) {
						let lesreleases = Objet['releases'][released]
						lesreleases = lesreleases +
							'' + lesreleases['title'] +
							' (' + lesreleases['status'] + ')' +
							"\n"
						nbreleased = nbreleased + lesreleases['count']
					}
					item.setAttribute('title', lesreleases)
				} else {
					// pas de release
				}
				item.textContent = Objet['title']
				item.textContent = (Objet['releases'] && Objet['releases'][0]) 
					? Objet['releases'][0].title
					: this.nodata
				trbody.appendChild(item)
				// actions col
				var item = document.createElement("td")
				item.className = 'actions'
				let itembutton = document.createElement("button")
				itembutton.setAttribute('recording_id', Objet.id)

				if (Objet['releases']) {
					let leRelease = Objet
					itembutton.addEventListener('click', (e) => {
						console.log('Objet[releases]------------------------------------------------------------------------------------')
						console.log(Objet['releases'])
						this.IdDemandeeAlbum = Objet.id
						this.Make_Modal(leRelease)},
						{once: false})
				}

				itembutton.className = 'btn btn-dark'
				var iconebutton = document.createElement("i")
				iconebutton.className = this.IconeVoirAlbum + ' voirlafiche'
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

	Make_Modal(lesreleases) {
		console.log('lesreleases')
		console.log(lesreleases)
		if (!document.querySelector('#fond-modal')) {
			var modalalbum = document.createElement("div")
			modalalbum.id = "rel_modal"
			modalalbum.className = "rel-modal-fs"
				var modaldialog = document.createElement("div")
				modaldialog.id = "rel-modal-cadre"
				modaldialog.className = "rel-modal-cadre"
				// modaldialog.setAttribute('role', 'document')
					var modalcontent = document.createElement("div")
					modalcontent.id = 'rel-contenu-modal'
					modalcontent.className = "rel-modal-contenu"

			modaldialog.appendChild(modalcontent)
			modalalbum.appendChild(modaldialog)
			document.body.appendChild(modalalbum)



			this.ModalAddContent(true, 'div', 'rel-contenu-modal', "Informations", 'rel-modal-contenu-contenu', 'rel-modal-contenu-contenu')
				this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu', "Informations", 'rel-modal-contenu-contenu-info', 'rel-modal-contenu-contenu-info')

					let rec_score = lesreleases['score'] ? lesreleases['score'] : false
					let rec_length = lesreleases['length'] ? lesreleases['length'] : false
					let rec_isrcs = lesreleases['isrcs'] ? lesreleases['isrcs'] : false
					let rec_id = lesreleases['id'] ? lesreleases['id'] : false
					let rec_artistcredit = lesreleases['artist-credit'] ? lesreleases['artist-credit'] : false
					let rec_video = lesreleases['video'] ? lesreleases['video'] : false

					this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu-info', "id: " + (rec_id ? rec_id : 'vide'), 'modalid', 'rel-modal-contenu-contenu-info-item')
					this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu-info', "isrcs: " + (rec_isrcs ? rec_isrcs : 'vide'), 'modalisrcs', 'rel-modal-contenu-contenu-info-item')
					rec_score ? this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Score: " + rec_score + '%', 'modalscore', 'rel-modal-contenu-contenu-info-item') : 'vide'
					rec_artistcredit ? this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Artists: " + this.getall_tag(rec_artistcredit, 'name') + '.', 'modalartists', 'rel-modal-contenu-contenu-info-item') : 'vide'
					rec_length ? this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Length: " + rec_length + '/' + this.get_timeformat(rec_length), 'modallength', 'rel-modal-contenu-contenu-info-item') : ''
					rec_video ? this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu-info', "Video: " + rec_video, 'modalvideo', 'rel-modal-contenu-contenu-info-item') : ''

				// RELEASES
				this.ModalAddContent(true, 'div', 'rel-modal-contenu-contenu', '', 'lesreleases', 'lesreleases')
				let relCount = 0
			for (let released in lesreleases['releases']) {
				let lereleased = lesreleases['releases'][released]
				let rel_divid = 'release-' + lereleased['id']
				let rel_title = lereleased['title'] ? lereleased['title'] : false
				let rel_count = lereleased['count'] ? lereleased['count'] : false
				let rel_id = lereleased['id'] ? lereleased['id'] : false
				let rel_artistcredit = lereleased['artist-credit'] ? lereleased['artist-credit'] : false	
				this.ModalAddContent(true, 'div', 'lesreleases', relCount + ") Release Title: " + ((rel_title) ? rel_title : 'vide'), rel_divid, 'unerelease')
				this.ModalAddContent(true, 'div', rel_divid, "Id: " + (rel_id ? rel_id : 'vide'), 'modal-rel-id-' + relCount, 'modalinfo-item')
				this.ModalAddContent(true, 'div', rel_divid, "Count: " + (rel_count ? rel_count : 'vide'), 'modal-rel-count-' + relCount, 'modalinfo-item')
				this.ModalAddContent(true, 'div', rel_divid, "Release Artists: " + (rel_artistcredit ? this.getall_tag(rel_artistcredit, 'name') + '.' : 'vide'), 'modal-rel-artist-' + relCount, 'modalinfo-item')

					let rel_country = lereleased['country'] ? lereleased['country'] : false
					let rel_date = lereleased['date'] ? lereleased['date'] : false
					let rel_disambiguation = lereleased['disambiguation'] ? lereleased['disambiguation'] : false
					let rel_trackcount = lereleased['track-count'] ? lereleased['track-count'] : false
					rel_country ? 				this.ModalAddContent(true, 'div', rel_divid, "country: " + rel_country, 'modal-rel-country-' + relCount, 'modalinfo-item') : ''
					rel_date ?						this.ModalAddContent(true, 'div', rel_divid, "date: " + rel_date, 'modal-rel-date-' + relCount, 'modalinfo-item') : 'vide'
					rel_disambiguation ? 	this.ModalAddContent(true, 'div', rel_divid, "disambiguation: " + rel_disambiguation, 'modal-rel-disambiguation-' + relCount, 'modalinfo-item') : 'vide'
					rel_trackcount ? 			this.ModalAddContent(true, 'div', rel_divid, "track-count: " + rel_trackcount, 'modal-rel-trackcount-' + relCount, 'modalinfo-item') : 'vide'

				// let urlcover = 'https://coverartarchive.org/release/' + lereleased['id'] + '?fmt=json'
				// let urlhtml = '<a href="' + urlcover + '" target="_out_' + lereleased['id'] + '">covert</a>'
				// 	urlhtml ? this.ModalAddContent(true, 'div', rel_divid,
				// 						"lien: " + this.makelinktag(urlcover,'covert',lereleased['id']),
				// 						'modal-rel-urlhtml-' + relCount,
				// 						'modalinfo-item') : 'vide'
				// ARTS
				let art_divid = 'arts-' + lereleased['id']
				this.ModalAddContent(true, 'div', rel_divid, '', art_divid, 'arts')
				// this.set_This('Make_Modal', 'mbid', lereleased['id']) // stockage 
				this.get_arts(lereleased['id'])
				relCount++
			}
			this.ModalAddHeader('div', 'rel-contenu-modal', (lesreleases['artist-credit'] && lesreleases['artist-credit'][0]) ? 'Record: ' + lesreleases['artist-credit'][0].name + '-' + lesreleases['title'] : 'vide')
			this.ModalAddFooter('div', 'rel-contenu-modal')
		}
	}

	makelinktag(url,text,target) {
		var link = document.createElement("a")
		link.className = ""
		link.setAttribute('href', url)
		link.setAttribute('target', '_out_' + target)
		link.textContent = text
		return link
	}
	get_timeformat(number) {
		if (number && number > 0) {
			// let minutes = Math.floor((number) / 60); 
			// let seconds = minutes % 60;
			// return (minutes > 0 ? (minutes > 9 ? minutes : '0' + minutes) : '00') + 'm' + (seconds > 0 ? (seconds > 9 ? seconds : '0' + seconds + 's') : '00')
			return new Date(number * 1000).toISOString().substr(11, 8)
		}
		return '00:00'
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
	ModalAddHeader(tag, destId, leString) {
		let Cible = document.querySelector('#' + destId)
		var modalheader = document.createElement(tag)
		modalheader.className = "modal-headerx"
		modalheader.className = "rel-modal-contenu-header"
		var modaltitle = document.createElement("h6")
		modaltitle.id = "modalLabelx"
		modaltitle.className = "rel-modal-contenu-header-label"
		modaltitle.textContent = leString

		var modalbutton = document.createElement("button")
		modalbutton.id = "modalClosex"
		modalbutton.className = "btn-rel btn-rel-close"
		// modalbutton.setAttribute('type', 'button')
		// modalbutton.setAttribute('data-dismiss', 'modal')
		// modalbutton.setAttribute('aria-label', 'Close')
		// modalbutton.textContent = "Détail de la sélection"
		modalbutton.addEventListener('click', (e) => {
				let aEffacer = document.querySelector('#rel_modal')
				aEffacer.parentNode.removeChild(aEffacer)},
				{once: true}
		)

		var modalclose = document.createElement("i")
		modalclose.className = "far fa-window-close"
		// modalclose.className = "fas fa-window-close
		modalclose.setAttribute('aria-hidden', 'true')

		modalbutton.appendChild(modalclose)
		modalheader.appendChild(modaltitle)
		modalheader.appendChild(modalbutton)
		Cible.prepend(modalheader)
	}
	ModalAddFooter(tag, destId) {
		let Cible = document.querySelector('#' + destId)
		var modalfooter = document.createElement(tag)
		modalfooter.className = "rel-modal-contenu-footer"
			var modalyoutube = document.createElement("a")
			modalyoutube.className = "btn-rel btn-rel-youtube"
			modalyoutube.setAttribute('href', 'https://youtube.com')
			modalyoutube.setAttribute('target', '_youtube')
			modalyoutube.setAttribute('type', 'button')
			modalyoutube.textContent = ' Youtube'
				var modalyoutubeico = document.createElement("i")
				modalyoutubeico.className = 'fab fa-youtube'
				modalyoutube.prepend(modalyoutubeico)

			var modalfermer = document.createElement("a")
			modalfermer.className = "btn-rel btn-rel-close"
			modalfermer.textContent = ' Fermer'
				var modalfermerico = document.createElement("i")
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

	ModalAddImage(lurl, laClass, mbid) {
		let ajout = document.createElement('img')
		ajout.id = 'vig-' + mbid
		ajout.className = laClass
		ajout.style.width = '250px'
		ajout.src = lurl
		return ajout
	}
	ModalAddContent(pos = false, tag, destId, leString, lId, laClass, lIcone = null) {
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

	ifreleases(datas) {
		if (datas) {
			var modalbody = document.querySelector("#" + "lesalbums")
			let listerel = ''
			for (var released in datas) {
				var modalletitre = document.createElement("div")
				// modalreleases.id = "modalbody"
				modalletitre.className = "modal-body-content"
				modalletitre.textContent = 'Title - '
			}
			modalbody.textContent = listerel
		}
	}

	// SPINNER VINYL
	myOldVinylButon() {
		let vinylactivity = document.querySelector('#vinyl-bouton-content')
		let spinnervinyl = document.querySelector('#spinnervinyl')
		if (this.vinyl_Buton) {
			vinylactivity.textContent = 'SpinIsOff <i class="fas fa-toggle-on"></i>'
			this.set_This('vinyl-bouton', 'vinyl_Buton', false)
			this.myOldVinyl(false)
			spinnervinyl.classList.add("disabled")
			event.target.title = 'Switch Spinner OFF'
			// spinnervinyl.classList.remove("spinning")
		} else {
			vinylactivity.textContent = 'SpinIsON <i class="fas fa-toggle-off"></i>'
			this.set_This('vinyl-bouton', 'vinyl_Buton', true)
			spinnervinyl.classList.remove("disabled")
			event.target.title = 'Switch Spinner ON'
			// spinnervinyl.classList.add("spinning")
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

	RefreshInnerHtml(objetid, content, by = false) {
		tag = by ? '.' : '#';
		if (document.querySelector(tag + objetid)) {
			document.querySelector(tag + objetid).innerHtml = content
		}
	}

	DisplayHtmlPage() {
		let containertableau = document.querySelector('#containertableau')

		// Some stuff here in the future
		var tagStatut = document.createElement("div")
		tagStatut.id = "status"
		tagStatut.className = "mb-4"
		tagStatut.textContent = "Some stuff here in the future !"

		// clean the existing table div
		containertableau.textContent = '';
		containertableau.appendChild(tagStatut)

		var card = document.createElement("div")
		card.id = "cardtable"
		card.className = "cardx shadow mb-4"

		var cardheader = document.createElement("div")
		cardheader.className = "card-header py-3"

		var cardresponse = document.createElement("div")
		cardresponse.id = "lareponse"
		cardresponse.className = "m-0 font-weight-bold text-primary"
		// cardresponse.textContent = "nb Results"

		var cardbody = document.createElement("div")
		cardbody.className = "card-bodyx"

		var tableresponsive = document.createElement("div")
		tableresponsive.className = "table-responsive"

		var table = document.createElement("table")
		table.id = "datatable"
		// table.id = "musika-reponse"
		table.className = "table table-bordered table-striped table-hover table-sm table-responsive"
		// table.style.width = "100%"
		// table.style.cellspacing = "0"

		var tablecaption = document.createElement("caption")
		containertableau.textContent = 'Recording List / Liste des albums';
		table.appendChild(tablecaption)
		
		tableresponsive.appendChild(table)
		cardheader.appendChild(cardresponse)
		card.appendChild(cardheader)

		cardbody.appendChild(tableresponsive)
		card.appendChild(cardbody)

		containertableau.appendChild(card)

		this.Make_SelectMenu()
	}

	RefreshReponsesTable() {
		document.querySelector("#lareponse").textContent = this.UrlDemandee + '<br>' + this.NbReponses + " Résultat" + ((this.NbReponses > 1) ? 's.' : '.')

		// clean the existing datatable div
		document.querySelector("#datatable").textContent = ''

		// table header
		var thead = document.createElement("thead")
		thead.id = "musika-header"
		var trhead = document.createElement("tr")
		for (var i = 0; i < this.Famillia[this.MaSelection].intitules.length; i++) {
			var item = document.createElement("th")
			item.textContent = this.Famillia[this.MaSelection].intitules[i];
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
		for (var i = 0; i < this.Famillia[this.MaSelection].intitules.length; i++) {
			var item = document.createElement("th")
			item.textContent = this.Famillia[this.MaSelection].intitules[i];
			trfoot.appendChild(item)
		}
		tfoot.appendChild(trfoot)
		document.querySelector("#datatable").appendChild(tfoot)
		this.Set_Pagination()
	}

}

let Zik = new Muzica('musika')
Zik.Listener()
Zik.DisplayHtmlPage()