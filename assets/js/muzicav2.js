"use strict";
// Muzica.js

console.log('Muzica.js is ON');


class Muzica {
	constructor ()
	{
		this.Debug = true
		this.NbSubmitDie = 5
		this.NbSubmitMax = 3
		this.NbSubmit = 0
		this.InputSearch = 'marecherche'
		this.InputSelect = 'maselection'
		
		this.UrlDatas = {
			"methode"		: 'GET',
			"url"			: 'https://musicbrainz.org/ws/2/',
			"type"			: 'artist',
			"moncode"		: '45f07934-675a-46d6-a577-6f8637a411b1',
			"inc"			: '/?query=',
			"jsonformat"	: '&fmt=json'
		}
		// area, artist, event, instrument, label, place, recording, release, release-group, series, work, url
		this.Famillia = 
		{
			'default': {
				"texte" : "Everything",
				"type" : "artist",
				"req" : "artists",
				"champs": ["id","type","type-id","score","name","sort-name"],
				"and": []
			},
			'artist': {
				"texte" : "Artist",
				"type" : "artist",
				"req" : "artists",
				"champs": ["id","type","type-id","score","name","sort-name"],
				"and": []
			},
			'album': {
				"texte" : "Album",
				"type" : "album",
				"req" : "albums",
				"champs": ["id","type","type-id","score","name","sort-name"],
				"and": []
			},
			'title': {
				"texte" : "Title",
				"type" : "title",
				"req" : "titles",
				"champs": ["id","type","type-id","score","name","sort-name"],
				"and": []
			},
			'serie': {
				"texte" : "Series",
				"type" : "serie",
				"req" : "series",
				"champs": ["id"],
				"and": []
			}
		}


		this.lesanciennesrecherches = [
			{
			"date": this.donnemoiladate,
			"mots": '',
			"type": ''
			}
		]

		this.reponse = ''
		this.FamilleActuel = 'default'
		this.TypeActuel = ''
		this.ReqActuel = ''
		this.MaRecherche = ''
		this.reponsehtml = ''
		this.UrlRequested = ''
	}

	Listener(){
		console.log('Mise en place des "EventListener"');
		let UglyValue = this
		document.getElementById('rechercher').addEventListener(
			'submit',
			function(event)
			{
				event.preventDefault();
				console.log('rechercher cliqué -> remise a zero');
				UglyValue.StartFromScratch() // remise a zero
				if (UglyValue.IsActif()){
					// getting search words in input
					var MaRecherche = document.getElementById(UglyValue.InputSearch).value;
					if (MaRecherche && MaRecherche != '')
					{
						console.log('MaRecherche:' + MaRecherche);
						MaRecherche = UglyValue.Set_CleanString(MaRecherche);
						UglyValue.Set_This('Listener:','MaRecherche',MaRecherche) 							// stockage

						console.log('Recherche lancée');
						UglyValue.GetDatas();
					}
					else
					{
						console.log('Recherche Vide');
					}
				}
			}
		)
		document.getElementById('maselection').addEventListener(
			'change',
			function(event){
				var MaSelection = UglyValue.Set_CleanString(document.getElementById('maselection').value);
				if (MaSelection != '')
				{
					UglyValue.Set_This('Listener','FamilleActuel',MaSelection) 									// stockage
					UglyValue.Set_CleanNewSearch()
				}
			}
		)
	}
	// Setters
	Set_CleanNewSearch(){
		this.Set_This('Set_CleanNewSearch','TypeActuel',this.Famillia[this.FamilleActuel].type) 				// stockage
		this.Set_This('Set_CleanNewSearch','ReqActuel',this.Famillia[this.FamilleActuel].req) 					// stockage
		this.Set_This('Set_CleanNewSearch','reponsehtml','') 													// stockage
		this.Set_This('Set_CleanNewSearch','reponse','') 														// stockage
	}
	Set_This(Func, Nom, Value){
		var oldValue = this[Nom]
		this[Nom] = Value
		console.log('(' + Func + ') Set_(' + Nom + ': "' + oldValue + '" to "' + Value + '")')
	}
	Set_NbSubmitPlus1(){
		this.NbSubmit = this.NbSubmit + 1
		console.log('NbSubmit:' + this.NbSubmit)
	}
	Set_FullUrl(){
		var urlrequete = this.UrlDatas.url + this.TypeActuel + this.UrlDatas.inc + this.MaRecherche + this.UrlDatas.jsonformat;
		this.UrlRequested =  urlrequete
		console.log('(urlrequete:' + urlrequete)
	}

	// Getters
	Get_This(Func, Nom){
		console.log('(' + Func + ') Get_(' + Nom + '="' + this[Nom] + '")')
		return this[Nom]
	}
	// Makers
	Set_CleanString(value) 
	{
		if(value!='')
		{
			console.log('Set_CleanString:' + value)
			let action = true
			
			let checks = [
				{
				'html' : '',
				'min' : 3,
				"max" : -50
				}
			]
			// let checks = ['html',3,-50]
			for ( var data of checks)
			{
				switch(data.key)
				{
					case 'html':
						action = encodeURIComponent(value) 
					break;
					case 3:
						action = (value.length > 3) ?? false
					break;
					case -50:
						action = (value.length < 50) ?? false
					break;
					case 'all':
						action = (value.length > 3) ?? false
						action = (value.length < 50) ?? false
						action = encodeURIComponent(value)
					break;
				}
			}
			action = value ?? false // quoi si vide et non false ????
	
			return action ? action : ''
		}
	}
	Make_SelectMenuFamillia(){
		console.trace('titi')
		var indexfamillia = this.Famillia
		var MenuFamillia = document.querySelector('#maselection')		
		for (var datas in indexfamillia)
		{
			var MenuOption = document.createElement("option")
			MenuOption.text = indexfamillia[datas]['texte']
			MenuOption.value = indexfamillia[datas]['type']
			MenuFamillia.add(MenuOption)
			
		}
		MenuFamillia.selectedIndex = 0
	}
	// Checkers
	IsActif(){
		return this.NbSubmit <= this.NbSubmitDie ? true : false
	}
	GetDatas(){
		this.initialise
		this.Set_NbSubmitPlus1() 	// incrementation
		this.Set_CleanNewSearch()	// update and/or reset old datas
		this.Set_FullUrl();			// set new url with clean data

		var MonPost = new XMLHttpRequest()
		MonPost.open(this.UrlDatas.methode, this.UrlRequested, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		let UglyValue = this
		MonPost.onreadystatechange = function() {
			console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status);

			if(MonPost.readyState == 4 && MonPost.status == 200) {
				UglyValue.reponse =  JSON.parse(MonPost.responseText)
				UglyValue.RefreshHtml()
			}
		}
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		MonPost.send()
	}


	StartFromScratch()
	{
		this.reponsehtml = ''
		this.reponse = null
		this.NbSubmit = 0			// remise à zero des tentative de recherches vides
		this.MaRecherche = ''

	}























	donnemoiladate(){
		var today = new Date();
		var aujourdhui = Date.now();
		return aujourdhui.getDate() + '-' +
			aujourdhui.getMonth() + '-' +
			aujourdhui.getFullYear() + ' ' +
			aujourdhui.getHours() + ':' +
			aujourdhui.getMinutes() + ':' +
			aujourdhui.getSeconds() + ':'
		;

	}
	RefreshHtml()
	{
		
		containertableau = document.querySelector('#containertableau')
		
		// Titre
		var tagAccroche = document.createElement("h1")
		tagAccroche.id = "tableau"
		tagAccroche.className = "h3 mb-2 text-gray-800"
		tagAccroche.innerHTML = (this.reponse) ? "Etats requête" : "Recherchez un artiste, un titre, un album ou les trois !!!"
		// afficher le retour de la recherche
		var tagReadyState = document.createElement("div")
		tagReadyState.id = "readyState"
		tagReadyState.className = "mb-4"
		tagReadyState.innerHTML = (this.reponse) ? "Ici quelques réponses d'ajax." : ''
		// afficher le status de la recherche
		var tagStatut = document.createElement("div")
		tagStatut.id = "status"
		tagStatut.className = "mb-4"
		tagStatut.innerHTML = (this.reponse) ? "Statut." : "..."
		
		// remplissage
		containertableau.innerHTML = '';
		containertableau.appendChild(tagAccroche)
		containertableau.appendChild(tagReadyState)
		containertableau.appendChild(tagStatut)

		// document.querySelector('#status').innerHTML = 'MonPost .readyState:'+ MonPost.readyState + ' .status:'+ MonPost.status


		if(this.reponse)
		{
			console.log( 'page')
			// tagReadyState.innerHTML = this.UrlRequested

			console.log(this.UrlRequested);
			console.log('this.reponse:' + this.reponse ? ' ok ' : ' ko ' )




			// containertableau.appendChild('<!-- DataTables Example -->')
			
			var card = document.createElement("div")
			card.className = "card shadow mb-4"

				var cardheader = document.createElement("div")
				cardheader.className = "card-header py-3"

					var cardheaderh6 = document.createElement("div")
					cardheaderh6.id = "lareponse"
					cardheaderh6.className = "m-0 font-weight-bold text-primary"
					cardheaderh6.innerHTML = "Réponses"

			
			var cardbody = document.createElement("div")
			cardbody.className = "card-body"

				var tableresponsive = document.createElement("div")
				tableresponsive.className = "table-responsive"

					var table = document.createElement("div")
					table.id = "dataTable"
					table.className = "table table-bordered"
					table.style.width = "100%"
					table.style.cellspacing = "0"

			if (this.TypeActuel)
			{
				var champs = this.Famillia[this.TypeActuel].champs

				// table header
				var thead = document.createElement("thead")
				thead.id = "musika-header"
				var trhead = document.createElement("tr")
				for (var i = 0; i < champs.length; i++)
				{
					var item = document.createElement("th");
					item.innerHTML = champs[i];
					trhead.appendChild(item);
				}
				thead.appendChild(trhead)

				// table footer
				var tfoot = document.createElement("tfoot")
				tfoot.id = "musika-footer"
				var trfoot = document.createElement("tr")
				for (var i = 0; i < champs.length; i++)
				{
					var item = document.createElement("th");
					item.innerHTML = champs[i];
					trfoot.appendChild(item);
				}
				tfoot.appendChild(trfoot)

				// table body
				var tbody = document.createElement("tbody")
				table.id = "musika-reponse"
				let datas = this.reponse[this.ReqActuel];				
				for ( var Objet of datas)
				{
					var trbody = document.createElement("tr")
					for (var i = 0; i < champs.length; i++)
					{
						var item = document.createElement("td");
						item.innerHTML = Objet[champs[i]]
						trbody.appendChild(item);
					}
					tbody.appendChild(trbody)
				}
				// full table childs
				table.appendChild(thead)
				table.appendChild(tbody)
				table.appendChild(tfoot)

				tableresponsive.appendChild(table)
				cardbody.appendChild(tableresponsive)
				cardheader.appendChild(cardheaderh6)

				card.appendChild(cardheader)
				card.appendChild(cardbody)

				containertableau.appendChild(card)
			}


		// document.querySelector('#readyState').innerHTML = 'none';
		// document.getElementById(UglyValue.InputSearch).value = ''; // on efface le input de recherche ?
		// document.getElementById("identifiant").value;
		}
	}

	// VueTable(donnees)
	// {
	// 	containertableau = document.querySelector('#containertableau')
	// 	containertableau.innerHTML = '';
	// 	var accroche = document.createElement("h1")
	// 	accroche.id = "tableau"
	// 	accroche.className = "h3 mb-2 text-gray-800"
	// 	accroche.innerHTML = "Etats requête"
	// }


}




let Zik = new Muzica()
Zik.Listener();
Zik.RefreshHtml();
Zik.Make_SelectMenuFamillia()
