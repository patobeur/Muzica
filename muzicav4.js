"use strict";

class Muzica {
	constructor ()
	{
		console.groupCollapsed('class Muzica constructor')
		console.trace()
		this.Debug = true 		// affiche en console si true
		this.NbSubmitDie = 5		// nb max de submit si recherche vide avant de bloquer
		this.NbSubmitMax = 3		// nb max de submit si recherche vide
		this.NbSubmit = 0			// nb couranbt de recherche vide

		this.InputSearch = 'marecherche' // contenu du champs recherche
		this.InputSelect = 'maselection'	// choix dans le menu select

		this.lesanciennesrecherches = [
			{
			"date": this.Get_Date,
			"mots": '',
			"type": ''
			}
		]

		this.reponse = ''
		this.FamilleActuel = ''
		this.MaSelection = 'default'
		this.TypeActuel = ''
		this.ReqActuel = ''
		this.FullReqActuel = []
		this.MaRecherche = ''
		this.reponsehtml = ''
		this.UrlDemandee = ''
		this.NbReponses = ''
		
		this.UrlDatas = {
			"methode"		: 'GET',
			"url"				: 'https://musicbrainz.org/ws/2/',
			"inc"				: '/?fmt=json'+'&query='
		}

		this.Intitules = ["#","artist","title","album","actions"];
		this.Traduction = [null,"name","recording","release",null];
		this.Famillia = 
		{
			'default': {
				"name" : 		"default",
				"texte" : 	"Everything",
				"type" : 		"release",
				"req" : 		"releases",
				"champs": 	["name","recording","release"],
				"request": 	["redording","title","release"]
			}
			,'artist': {
				"name" : 		"artist",
				"texte" : 	"Artiste",
				"type" : 		"artist",
				"req" : 		"artists",
				"champs": 	["name","recording","release"],
				"request": 	["title"]
			}
			,'release': {
				"name" : 		"release",
				"texte" : 	"Série (release)",
				"type" : 		"release",
				"req" : 		"releases",
				"champs": 	['artist','title'],
				"request": 	["redording","title","release"]
			}
			,'recording': {
				"name" : 		"recording",
				"texte" : 	"Enregistrement (recording)",
				"type" : 		"recording",
				"req" : 		"recordings",
				"champs": 	["id","type","type-id","score","name","sort-name"],
				"request": 	["redording","title","release"]
			}
		}
		console.groupEnd()
	}

	Listener(){
		console.groupCollapsed('Mise en place des "EventListener"');
		console.trace()
		let this_clone = this
		document.getElementById('rechercher').addEventListener(
			'submit',
			function(event)
			{
				event.preventDefault();
				
				console.clear()
				console.log('rechercher cliqué -> remise a zero');
				this_clone.StartFromScratch() // remise a zero
				if (this_clone.IsActif()){
					// getting search words in input
					var MaRecherche = document.getElementById(this_clone.InputSearch).value;
					if (MaRecherche && MaRecherche != '')
					{
						this_clone.Set_This('Listener:','MaRecherche',this_clone.Set_CleanString(MaRecherche)) 							// stockage

						console.log('Recherche lancée');
						this_clone.GetDatas();
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
				var MaSelection = this_clone.Set_CleanString(document.getElementById('maselection').value);
				if (MaSelection != '')
				{
					console.clear()
					this_clone.Set_This('Listener','FamilleActuel',MaSelection) 								// stockage
					this_clone.Set_This('Listener','MaSelection',MaSelection) 								// stockage
					this_clone.Set_CleanNewSearch()
				}
			}
		)
		console.groupEnd()
	}

	// Setters
	Set_FullUrl(){
		console.group('Set_FullUrl: by ' + this.Famillia[this.TypeActuel]['request'])
		let fullsearch = ''; 
		for (let i = 0; i < this.FullReqActuel.length; i++)
		{
			fullsearch = fullsearch + (i>0 ? ' AND ' : '') + this.FullReqActuel[i] + ':' + this.MaRecherche
		}

		this.Set_This('Set_FullUrl','UrlDemandee',this.UrlDatas.url + this.TypeActuel + this.UrlDatas.inc + fullsearch) 	// stockage
		console.groupEnd()
	}
	Set_CleanNewSearch(){
		console.groupCollapsed('Set_CleanNewSearch: ' + this.MaSelection)
		this.Set_This('Set_CleanNewSearch','TypeActuel',this.Famillia[this.MaSelection].type) 					// stockage
		this.Set_This('Set_CleanNewSearch','ReqActuel',this.Famillia[this.MaSelection].req) 						// stockage
		this.Set_This('Set_CleanNewSearch','FullReqActuel',this.Famillia[this.MaSelection].request) 		// stockage
		this.Set_This('Set_CleanNewSearch','reponsehtml','') 																							// stockage
		this.Set_This('Set_CleanNewSearch','reponse','') 																									// stockage
		console.groupEnd()
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

	// Getters
	Get_This(Func, Nom){
		console.log('(' + Func + ') Get_(' + Nom + '="' + this[Nom] + '")')
		return this[Nom]}
	
	// Makers
	Set_CleanString(value) 
	{
		if(value != '' && value != false && value != null)
		{
			if (value.length < 3) return 'texte trop cour';
			if (value.length > 20) return 'texte trop long';
			return encodeURIComponent(value)
		}
	}

	// Makers
	Set_CleanString2(value) 
	{
		if(value!='')
		{
			console.log('Set_CleanString:' + value)
			let clean = true
			
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
						clean = encodeURIComponent(value) 
					break;
					case 3:
						clean = (value.length > 3) ?? false
					break;
					case -50:
						clean = (value.length < 50) ?? false
					break;
					case 'all':
						clean = (value.length > 3) ?? false
						clean = (value.length < 50) ?? false
						clean = encodeURIComponent(value)
					break;
				}
			}
			clean = value ?? false // quoi si vide et non false ????	
			return clean ? clean : ''}}

	Make_SelectMenu(){
		console.groupCollapsed('Make_SelectMenu')
		var indexfamillia = this.Famillia
		var MenuFamillia = document.querySelector('#maselection')		
		for (var datas in indexfamillia)
		{
			var MenuOption = document.createElement("option")
			MenuOption.text = indexfamillia[datas]['texte']
			MenuOption.value = indexfamillia[datas]['name']
			console.log(indexfamillia[datas]['name'] + '>' + indexfamillia[datas]['texte'])
			MenuFamillia.add(MenuOption)
			
		}
		MenuFamillia.selectedIndex = 0
		console.groupEnd()
	}
	// Checkers
	IsActif(){
		return this.NbSubmit <= this.NbSubmitDie ? true : false
	}
	GetDatas(){
		console.groupCollapsed('GetDatas')
		console.trace('GetDatas')
		this.initialise
		this.Set_NbSubmitPlus1() 	// incrementation
		this.Set_CleanNewSearch()	// update and/or reset old datas
		this.Set_FullUrl();			// set new url with clean data

		var MonPost = new XMLHttpRequest()
		MonPost.open(this.UrlDatas.methode, this.UrlDemandee, true)
		MonPost.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

		let thisClone = this
		MonPost.onreadystatechange = function() {
			console.log('MonPost.readyState: ' + MonPost.readyState + ' / MonPost.status:' + MonPost.status);

			
			if(MonPost.readyState == 4 && MonPost.status == 200) {
				thisClone.reponse =  JSON.parse(MonPost.responseText)
				thisClone.NbReponses =  thisClone.reponse.count
				console.log(thisClone.NbReponses)
				console.log(thisClone.reponse)
				;
				thisClone.RefreshHtml();
			}
		}
		// MonPost.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		MonPost.send()
		console.groupEnd('(urlrequete:' + this.urlrequete)
	}

	StartFromScratch()
	{
		this.reponsehtml = ''
		this.reponse = null
		this.NbSubmit = 0			// remise à zero des tentative de recherches vides
		this.MaRecherche = ''
	}

	Get_Date(){
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

	TableauHtml()
	{
		if (this.reponse)
		{
			
			var champs = this.Famillia[this.TypeActuel].champs

			// table body
			var tbody = document.createElement("tbody")
			let datas = this.reponse[this.ReqActuel];
			let ligneId = 0

			for ( var Objet of datas)
			{
				var trbody = document.createElement("tr")
				
				// line number manual col
				var item = document.createElement("td");
				item.innerHTML = ++ligneId
				trbody.appendChild(item);

				// artist
				var item = document.createElement("td");
				item.innerHTML = Objet[champs[i]]
				trbody.appendChild(item);

					for (var i = 0; i < champs.length; i++)
					{
						var item = document.createElement("td");
						item.innerHTML = Objet[champs[i+1]]
						trbody.appendChild(item);
					}

				tbody.appendChild(trbody)
			}

			return tbody

		}
		else
		{
			return 'vide'
		}
	}

	RefreshHtml(tbody)
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


		if( this.NbReponses > 0 )
		{

			console.log( 'page: ' + this.reponse)
			tagReadyState.innerHTML = this.UrlDemandee

			console.log(this.UrlDemandee);
			console.log('this.reponse ? :' + this.reponse ? ' ok ' : ' vide ' )

			
			var card = document.createElement("div")
			card.className = "card shadow mb-4"

				var cardheader = document.createElement("div")
				cardheader.className = "card-header py-3"

					var cardheaderh6 = document.createElement("div")
					cardheaderh6.id = "lareponse"
					cardheaderh6.className = "m-0 font-weight-bold text-primary"
					cardheaderh6.innerHTML = this.NbReponses + " Résultats" + ((this.NbReponses > 1) ? 's.' : '.' ) 

			
			var cardbody = document.createElement("div")
			cardbody.className = "card-body"

				var tableresponsive = document.createElement("div")
				tableresponsive.className = "table-responsive"

					var table = document.createElement("div")
					table.id = "dataTable"
					// table.id = "musika-reponse"
					table.className = "table table-bordered"
					table.style.width = "100%"
					table.style.cellspacing = "0"





			if (this.TypeActuel)
			{
				// var champs = this.Famillia[this.TypeActuel].champs

				// table header
				var thead = document.createElement("thead")
				thead.id = "musika-header"
				var trhead = document.createElement("tr")
				for (var i = 0; i < this.Intitules.length; i++)
				{
					var item = document.createElement("th");
					item.innerHTML = this.Intitules[i];
					trhead.appendChild(item);
				}
				thead.appendChild(trhead)

				// table footer
				var tfoot = document.createElement("tfoot")
				tfoot.id = "musika-footer"
				var trfoot = document.createElement("tr")
				for (var i = 0; i < this.Intitules.length; i++)
				{
					var item = document.createElement("th");
					item.innerHTML = this.Intitules[i];
					trfoot.appendChild(item);
				}
				tfoot.appendChild(trfoot)

				// full table childs
				table.appendChild(thead)
				table.appendChild(this.TableauHtml())
				table.appendChild(tfoot)

				tableresponsive.appendChild(table)
				cardbody.appendChild(tableresponsive)
				cardheader.appendChild(cardheaderh6)

				card.appendChild(cardheader)
				card.appendChild(cardbody)

				containertableau.appendChild(card)



				// // CONSOLE HTML
				// var consolehtml = document.createElement("div")
				// consolehtml.id = "consolehtml"
				// consolehtml.className = "text-primary"
	
				// 	var consolepre = document.createElement("pre")
				// 	consolepre.id = "consolepre"
				// 	consolepre.className = "text-primary"
				// 	console.log(this.reponse);		
				// 	// consolepre.innerHTML = encodeURI(this.reponse[this.ReqActuel])
					
				// consolehtml.appendChild(consolepre)
				// containertableau.appendChild(consolehtml)
			}


		// document.querySelector('#readyState').innerHTML = 'none';
		// document.getElementById(this_clone.InputSearch).value = ''; // on efface le input de recherche ?
		// document.getElementById("identifiant").value;
		}
	}

}




console.log('muzica'+ 'v5' + '.js is ON');
console.log('// je rappele : album =release , piste = title = recording, artist = artiste');

let Zik = new Muzica()
Zik.Listener();
Zik.RefreshHtml();
Zik.Make_SelectMenu()
