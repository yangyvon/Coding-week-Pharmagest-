// Controller AngularJS
var JsonUploadController = function ($scope, $http, $filter, $timeout, fileReader) {
	
	// Initialisation de la liste des Widgets contenus dans l'OffiBoard
	$scope.listWidgets = [];

	$http({
		method: "GET",
		url: "http://localhost:8080/PiPharmagest/AngularJsServlet",
		headers: {
			'Content-type': 'application/json'
		}

	}).then(function mySuccess(response) {
		//console.log("Success");
		$scope.myRes = response.data.myArrayList;
		$scope.newIdWidgets = [];
		angular.forEach($scope.myRes, function (value, key) {

			$scope.listWidgets.push(JSON.parse(value.map.jsonData));
			$scope.newIdWidgets.push(value.map.idWidget);
		});
		
		for (var i = 0 ; i < $scope.listWidgets.length ; i++) {
			
			$scope.listWidgets[i]['idWidget'] = $scope.newIdWidgets[i];
		}

		$scope.statuscode = response.status;
		
		// Id du Widget courant
		$scope.idWidget = $scope.listWidgets.length;
		
	}, function myError(response) {
		console.log("Error");
	});
	
	// Nom par défaut du Widget courant
	$scope.widgetName = "Nouveau Widget";
	
	// Liste des différentes sections d'un Widget dans l'OffiBoard
	$scope.listeSection = ["Ventes","Achats","Clients","Collectivites","Operateurs","Produits"];

	// Section du Widget courant
	$scope.sectionWidget = "Ventes";

	// Liste des différentes sections + Tous
	$scope.listeSection2 = ["Tous","Ventes","Achats","Clients","Collectivites","Operateurs","Produits"];
	
	// Initialisation du filtre à "Tous"
	$scope.sectionWidget2 = "Tous";
	
	// Nombre de colonnes dans le tableau 2D (2 colonnes par défaut)
	$scope.colCount = 2;
	
	// Identifiant des axes supplémentaires (de 2 à 6)
	$scope.uniqId = 2;
	
	// Initialisation des axes
	$scope.selectedX = 0;
	$scope.selectedY = 1;
	$scope.selectedZ1 = 2;
	$scope.selectedZ2 = 3;
	$scope.selectedZ3 = 4;
	$scope.selectedZ4 = 5;
	$scope.selectedZ5 = 6;

	// Liste des axes
	$scope.selecteds = [$scope.selectedX, $scope.selectedY, $scope.selectedZ1, $scope.selectedZ2,
	                    $scope.selectedZ3, $scope.selectedZ4, $scope.selectedZ5];
	
	// Nombre de lignes par page affichées dans le tableau (10 lignes par défaut)
	$scope.display_limit1 = 10;

	// Initialisation des lignes du json
	$scope.lignes = [];

	// Variables pour la pagination
	$scope.filteredItems = [];
	$scope.groupedItems = [];
	$scope.itemsPerPage = 10;
	$scope.pagedItems = [];
	$scope.currentPage = 0;
	
	// Variables pour le tri et la recherche textuelle dans le tableau 2D
	$scope.query = "";
	$scope.sortingOrder = "";
	$scope.reverse = false;
	
	// Label du bouton qui transitionne d'un graphe à  un tableau
	$scope.labelButtonGraphtoTable = "Graphe";

	// Booleen true -> tableau false -> graphe
	$scope.booleenGrapheTableau = true;
	
	// Année sélectionnée pour la fonction somme par mois
	$scope.selectedYear = "";
	
	// Id pour le canvas
	$scope.visuContainer = "visualisationContainer";

	// Supprime l'élément à l'indice $index de la liste listWidgets
	$scope.remove2 = function($index){ 
		$scope.listWidgets.splice($index, 1);     
	};
	
	// Ajout d'un Widget à la base de données et à la liste listWidgets
	$scope.widgetAddToDb = function(nameWidg, nbCol, idUniq, arraySelecteds, dispLim,
			jsonFile, sectionWidg, nameJson, scopeKeys, jsonLines, val, typ, filteredIt,
			groupedIt, itPerPage, pagedIt, curPage, queryTab, sortOrder, reverseOrder,
			lbGrToTa, boolGrTa, selYear){
		
		var str = "visualisationContainer" + $scope.listWidgets.length;
		
		var dataToPost = {'idWidget':$scope.listWidgets.length, 'nomWidget':$scope.widgetName,
				'nbCol':$scope.colCount, 'idCol':$scope.uniqId, 'Axes':$scope.selecteds,
				'nbLignes':$scope.display_limit1, 'sectionWidget':$scope.sectionWidget,
				'jsonName':$scope.jsonFileName, 'keys':$scope.keys, 'lignes':$scope.lignes,
				'values':$scope.values, 'types':$scope.types, 'filteredItems':$scope.filteredItems,
				'groupedItems':$scope.groupedItems, 'itemsPerPage':$scope.itemsPerPage,
				'pagedItems':$scope.pagedItems, 'currentPage':$scope.currentPage,
				'query':$scope.query, 'sortingOrder':$scope.sortingOrder, 'reverse':$scope.reverse,
				'labelButtonGraphtoTable':$scope.labelButtonGraphtoTable, 
				'booleenGrapheTableau':$scope.booleenGrapheTableau,
				'selectedYear':$scope.selectedYear, 'visuContainer':str};

		$http({
			method: "POST",
			url: "http://localhost:8080/PiPharmagest/AngularJsServlet",
			data:dataToPost,

		}).then(function mySuccess(response) {
			//console.log("Post with success");

		}, function myError(response) {
			console.log("Post with error");

		});
		
		var newId = $scope.listWidgets.length;
		var str2 = "visualisationContainer" + newId;
		$scope.listWidgets.push({"idWidget":newId, "nomWidget":nameWidg, "jsonFile":jsonFile,
			"nbCol":nbCol, "idCol":idUniq, "Axes":arraySelecteds, "nbLignes":dispLim,
			"sectionWidget":sectionWidg, "jsonName":nameJson, "keys":scopeKeys, "lignes":jsonLines,
			"values":val, "types":typ, "filteredItems":filteredIt, "groupedItems":groupedIt,
			"itemsPerPage":itPerPage, "pagedItems":pagedIt, "currentPage":curPage,
			"query":queryTab, "sortingOrder":sortOrder, "reverse":reverseOrder,
			'labelButtonGraphtoTable':lbGrToTa,
			'booleenGrapheTableau':boolGrTa,
			'selectedYear':selYear,  'visuContainer':str2});
		$scope.closeWidget();
	};

	$scope.widgetUpdateToDb = function(nameWidg, nbCol, idUniq, arraySelecteds, dispLim,
			jsonFile, sectionWidg, nameJson, scopeKeys, jsonLines, val, typ, filteredIt,
			groupedIt, itPerPage, pagedIt, curPage, queryTab, sortOrder, reverseOrder,
			lbGrToTa, boolGrTa, selYear){

		// console.log("widgetUpdateToDb");
		var str = "visualisationContainer" + $scope.idWidget;
		var dataToPost = {'idWidget':$scope.idWidget, 'nomWidget':$scope.widgetName,
				'nbCol':$scope.colCount, 'idCol':$scope.uniqId, 'Axes':$scope.selecteds,
				'nbLignes':$scope.display_limit1, 'sectionWidget':$scope.sectionWidget,
				'jsonName':$scope.jsonFileName, 'keys':$scope.keys, 'lignes':$scope.lignes,
				'values':$scope.values, 'types':$scope.types, 'filteredItems':$scope.filteredItems,
				'groupedItems':$scope.groupedItems, 'itemsPerPage':$scope.itemsPerPage,
				'pagedItems':$scope.pagedItems, 'currentPage':$scope.currentPage,
				'query':$scope.query, 'sortingOrder':$scope.sortingOrder,
				'reverse':$scope.reverse, 'labelButtonGraphtoTable':$scope.labelButtonGraphtoTable, 
				'booleenGrapheTableau':$scope.booleenGrapheTableau,
				'selectedYear':$scope.selectedYear, 'visuContainer':str};

		$http({
			method: "PUT",
			url: "http://localhost:8080/PiPharmagest/AngularJsServlet",
			data:dataToPost,

		}).then(function mySuccess(response) {
			// console.log("Put with success");

		}, function myError(response) {
			console.log("Put with error");

		});

		var str2 = "visualisationContainer" + $scope.idWidget;
		var newWidget = {"idWidget":$scope.idWidget, "nomWidget":nameWidg, "jsonFile":jsonFile,
				"nbCol":nbCol, "idCol":idUniq, "Axes":arraySelecteds, "nbLignes":dispLim,
				"sectionWidget":sectionWidg, "jsonName":nameJson, "keys":scopeKeys, "lignes":jsonLines,
				"values":val, "types":typ, "filteredItems":filteredIt, "groupedItems":groupedIt,
				"itemsPerPage":itPerPage, "pagedItems":pagedIt, "currentPage":curPage,
				"query":queryTab, "sortingOrder":sortOrder, "reverse":reverseOrder,
				'labelButtonGraphtoTable':lbGrToTa, 'booleenGrapheTableau':boolGrTa,
				'selectedYear':selYear, 'visuContainer':str2};

		var indexW = 0;

		for (var i = 0 ; i < $scope.listWidgets.length ; i++) {

			if (angular.equals($scope.listWidgets[i]["idWidget"], $scope.idWidget)) {

				indexW = i;
			}
		}

		$scope.listWidgets.splice(indexW, 1, newWidget);
		$scope.closeWidget();
	};

	// Supprime de la liste des Widgets les Widgets sélectionnés par l'utilisateur dans le modal "Supprimer des Widgets"
	$scope.widgetDeleteFromDb = function(idW, widgName, nbCol, idUniq, arraySelecteds, dispLim,
			jsonFile, widgSection, jsonName, scopeKeys, jsonLines, val, typ, filteredIt, groupedIt,
			itPerPage, pagedIt, curPage, queryTab, sortOrder, reverseOrder, lbGrToTa, boolGrTa,
			selYear) {

		$scope.idWidget = idW;
		$scope.widgetName = widgName;
		$scope.colCount = nbCol;
		$scope.uniqId = idUniq;
		$scope.selecteds = arraySelecteds;
		$scope.display_limit1 = dispLim;
		$scope.sectionWidget = widgSection;
		$scope.jsonFileName = jsonName;
		$scope.filteredItems = filteredIt;
		$scope.groupedItems = groupedIt;
		$scope.itemsPerPage = itPerPage;
		$scope.pagedItems = pagedIt;
		$scope.currentPage = curPage;
		$scope.query = queryTab;
		$scope.sortingOrder = sortOrder;
		$scope.reverse = reverseOrder;

		$scope.jsonSrc = jsonFile;
		$scope.keys = scopeKeys;
		$scope.values = val;
		$scope.lignes = jsonLines;
		//$scope.lignes = JSON.parse($scope.jsonSrc);
		header = $scope.lignes[0];
		$scope.type = null;
		$scope.types = typ;
		$scope.labelButtonGraphtoTable = lbGrToTa;
		$scope.booleenGrapheTableau = boolGrTa;
		$scope.selectedYear = selYear;
		$scope.visuContainer = "visualisationContainer" + idW;

		$scope.search();
		
		var str = "visualtionContainer" + $scope.idWidget;
		
		var dataToPost = {'idWidget':$scope.idWidget, 'nomWidget':$scope.widgetName,
				'nbCol':$scope.colCount, 'idCol':$scope.uniqId, 'Axes':$scope.selecteds,
				'nbLignes':$scope.display_limit1, 'sectionWidget':$scope.sectionWidget,
				'jsonName':$scope.jsonFileName, 'keys':$scope.keys, 'lignes':$scope.lignes,
				'values':$scope.values, 'types':$scope.types, 'filteredItems':$scope.filteredItems,
				'groupedItems':$scope.groupedItems, 'itemsPerPage':$scope.itemsPerPage,
				'pagedItems':$scope.pagedItems, 'currentPage':$scope.currentPage,
				'query':$scope.query, 'sortingOrder':$scope.sortingOrder,
				'reverse':$scope.reverse, 'labelButtonGraphtoTable':$scope.labelButtonGraphtoTable, 
				'booleenGrapheTableau':$scope.booleenGrapheTableau,
				'selectedYear':$scope.selectedYear, 'visuContainer':str};

		$http({
			method: "DELETE",
			url: "http://localhost:8080/PiPharmagest/AngularJsServlet",
			data:dataToPost,

		}).then(function mySuccess(response) {
			// console.log("Delete with success");

		}, function myError(response) {
			console.log("Delete with error");

		});
		
		$scope.remove2($scope.idWidget);
		$scope.closeWidget();
		
		for (var j = 0 ; j < $scope.listWidgets.length ; j++) {

			$scope.listWidgets[j]["idWidget"] = j;
			$scope.listWidgets[j]["visuContainer"] = "visualisationContainer" + j;
		}
	};

	$scope.parseValue = function(val) {

		if (val.match(/^[\d ]+$/)) {

			return parseInt(val.split(' ').join(''),10);
		}

		else {

			return val;
		}
	};

	// Liste des mois de l'année (pour l'affichage du tableau mois par mois)
	$scope.getMonthsNames = function() {
		var monthsNames = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
		return monthsNames;
	};
	
	$scope.searchMatch = function (haystack, needle) {
		if (!needle) {
			return true;
		}
		var res = haystack.toString().indexOf(needle.toString()) !== -1;
		return res;
	};

	$scope.search = function () {
		$scope.filteredItems = $filter('filter')($scope.lignes, function (item) {
			for(var attr in item) {
				if ($scope.searchMatch(item[attr], $scope.query))
					return true;
			}
			return false;
		});
		if ($scope.sortingOrder !== '') {
			$scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
		}
		$scope.currentPage = 0;
		$scope.groupToPages();
	};

	$scope.search2 = function(indexWidget) {
		// console.log("index : " + indexWidget);
		$scope.listWidgets[indexWidget].filteredItems = $filter('filter')($scope.listWidgets[indexWidget].lignes, function (item) {
			for(var attr in item) {
				if ($scope.searchMatch(item[attr], $scope.listWidgets[indexWidget].query))
					return true;
			}
			return false;
		});
		if ($scope.listWidgets[indexWidget].sortingOrder !== '') {
			$scope.listWidgets[indexWidget].filteredItems = $filter('orderBy')($scope.listWidgets[indexWidget].filteredItems, $scope.listWidgets[indexWidget].sortingOrder, $scope.listWidgets[indexWidget].reverse);
		}
		$scope.listWidgets[indexWidget].currentPage = 0;
		$scope.groupToPages2(indexWidget);
	};

	$scope.groupToPages = function () {
		$scope.pagedItems = [];

		for (var i = 0; i < $scope.filteredItems.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
			}
		}

	};

	$scope.groupToPages2 = function (indexWidget) {
		$scope.listWidgets[indexWidget].pagedItems = [];

		for (var i = 0; i < $scope.listWidgets[indexWidget].filteredItems.length; i++) {
			if (i % $scope.listWidgets[indexWidget].itemsPerPage === 0) {
				$scope.listWidgets[indexWidget].pagedItems[Math.floor(i / $scope.listWidgets[indexWidget].itemsPerPage)] = [ $scope.listWidgets[indexWidget].filteredItems[i] ];
			} else {
				$scope.listWidgets[indexWidget].pagedItems[Math.floor(i / $scope.listWidgets[indexWidget].itemsPerPage)].push($scope.listWidgets[indexWidget].filteredItems[i]);
			}
		}

	};

	$scope.sort_by = function(newSortingOrder) {
		if ($scope.sortingOrder == newSortingOrder)
			$scope.reverse = !$scope.reverse;

		$scope.sortingOrder = newSortingOrder;

		$('th i').each(function(){

			$(this).removeClass().addClass('icon-sort');
		});
	};

	$scope.sort_by2 = function(newSortingOrder, indexWidget) {
		if ($scope.listWidgets[indexWidget].sortingOrder == newSortingOrder)
			$scope.listWidgets[indexWidget].reverse = !$scope.listWidgets[indexWidget].reverse;

		$scope.listWidgets[indexWidget].sortingOrder = newSortingOrder;

		$('th i').each(function(){

			$(this).removeClass().addClass('icon-sort');
		});
	};

	$scope.range = function (start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
		}
	};

	$scope.firstPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage = 0;
		}
	};

	$scope.lastPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage = $scope.pagedItems.length - 1;
		}
	};

	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};

	$scope.prevPage2 = function (indexWidget) {
		if ($scope.listWidgets[indexWidget].currentPage > 0) {
			$scope.listWidgets[indexWidget].currentPage--;
		}
	};

	$scope.nextPage2 = function (indexWidget) {
		if ($scope.listWidgets[indexWidget].currentPage < $scope.listWidgets[indexWidget].pagedItems.length - 1) {
			$scope.listWidgets[indexWidget].currentPage++;
		}
	};

	$scope.firstPage2 = function (indexWidget) {
		if ($scope.listWidgets[indexWidget].currentPage > 0) {
			$scope.listWidgets[indexWidget].currentPage = 0;
		}
	};

	$scope.lastPage2 = function (indexWidget) {
		if ($scope.listWidgets[indexWidget].currentPage < $scope.listWidgets[indexWidget].pagedItems.length - 1) {
			$scope.listWidgets[indexWidget].currentPage = $scope.listWidgets[indexWidget].pagedItems.length - 1;
		}
	};

	$scope.reinitOrder = function() {

		$scope.sortingOrder = "";
	};

	$scope.reinitOrder2 = function(indexWidget) {

		$scope.listWidgets[indexWidget].sortingOrder = "";
	};

	// Valeurs associées au header string
	$scope.getValues = function(string) {

		var res = [];

		for (var i = 0 ; i < $scope.lignes.length ; i++) {
			res[i] = $scope.lignes[i][string];
		}

		return res;
	};

	// Valeurs associées au header string
	$scope.getValuesSimple = function(i, val) {

		return val[i];
	};

	// Valeurs associées au header string
	$scope.getValues2 = function(string, lines) {

		var res = [];

		for (var i = 0 ; i < lines.length ; i++) {
			res[i] = lines[i][string];
		}

		return res;
	};

	// Somme les valeurs en fonction du mois
	$scope.sumValuesByMonth = function(cleDate, cleY, annee) {
		var months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var date;
		// console.log($scope.lignes);
		for (var i = 0; i < $scope.lignes.length; i++) {
			date = new Date($scope.lignes[i][cleDate]);
			if (date.getFullYear() == annee) {
				var input = $scope.lignes[i][cleY]; //Pour gérer les espaces dans les chaines de caractères issues de l'offiReport
				// var processed = input.replace(/ /g, '');
				// var output = parseInt(processed, 10);
				var output = parseInt(input, 10);
				months[date.getMonth()] += +output; // Fait la somme par mois
			}
		}
		return(months);
	};
	
	// Somme les valeurs en fonction du mois
	$scope.sumValuesByMonthDb = function(cleDate, cleY, annee, lines) {
		var months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var date;
		for (var i = 0; i < lines.length; i++) {
			date = new Date(lines[i][cleDate]);
			if (date.getFullYear() == annee) {
				var input = lines[i][cleY]; //Pour gérer les espaces dans les chaines de caractères issues de l'offiReport
				// var processed = input.replace(/ /g, '');
				// var output = parseInt(processed, 10);
				var output = parseInt(input, 10);
				months[date.getMonth()] += +output; // Fait la somme par mois
			}
		}
		return(months);
	};

	// Fonction qui construit le graphe
	$scope.getChart = function(cleX, cleY, annee, CanvasID) {
		var Canvas = document.getElementById(CanvasID);
		var chartOptions = {
				animation:{
					duration:1000
				},
				responsive:true,
				title:{
					display:true,
					position:'top',
					text: cleY+' par mois pour l\'annee '+ annee 
				},
				tooltips: {
					enabled:true
				},
				legend: {
					display: false,
					labels: {
						boxWidth: 80,
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
		};

		var barChart = new Chart(Canvas, {
			type: 'bar',
			data: {
				labels: $scope.getMonthsNames(),
				datasets: [{
					label: cleY,
					data: $scope.sumValuesByMonth(cleX,cleY,annee),

					backgroundColor: [
					                  'rgba(255, 99, 132, 0.6)',
					                  'rgba(54, 162, 235, 0.6)',
					                  'rgba(255, 206, 86, 0.6)',
					                  'rgba(75, 192, 192, 0.6)',
					                  'rgba(153, 102, 255, 0.6)',
					                  'rgba(255, 159, 64, 0.6)',
					                  'rgba(255, 99, 132, 0.6)',
					                  'rgba(54, 162, 235, 0.6)',
					                  'rgba(255, 206, 86, 0.6)',
					                  'rgba(75, 192, 192, 0.6)',
					                  'rgba(153, 102, 255, 0.6)',
					                  'rgba(255, 159, 64, 0.6)'
					                  ]

				}]
			},
			options:chartOptions
		});
	};
	
	// Fonction qui construit le graphe
	$scope.getChartDb = function(cleX, cleY, annee, CanvasID, lines) {
		var Canvas = document.getElementById(CanvasID);
		var chartOptions = {
				animation:{
					duration:1000
				},
				responsive:true,
				title:{
					display:true,
					position:'top',
					text: cleY+' par mois pour l\'annee '+ annee 
				},
				tooltips: {
					enabled:true
				},
				legend: {
					display: false,
					labels: {
						boxWidth: 80,
						fontColor: 'black'
					}
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
		};

		var barChart = new Chart(Canvas, {
			type: 'bar',
			data: {
				labels: $scope.getMonthsNames(),
				datasets: [{
					label: cleY,
					data: $scope.sumValuesByMonthDb(cleX,cleY,annee,lines),

					backgroundColor: [
					                  'rgba(255, 99, 132, 0.6)',
					                  'rgba(54, 162, 235, 0.6)',
					                  'rgba(255, 206, 86, 0.6)',
					                  'rgba(75, 192, 192, 0.6)',
					                  'rgba(153, 102, 255, 0.6)',
					                  'rgba(255, 159, 64, 0.6)',
					                  'rgba(255, 99, 132, 0.6)',
					                  'rgba(54, 162, 235, 0.6)',
					                  'rgba(255, 206, 86, 0.6)',
					                  'rgba(75, 192, 192, 0.6)',
					                  'rgba(153, 102, 255, 0.6)',
					                  'rgba(255, 159, 64, 0.6)'
					                  ]

				}]
			},
			options:chartOptions
		});
	};

	$scope.showCanvas = function(cleX, cleY, annee, CanvasID) {
		var Canvas = document.getElementById(CanvasID);
		Canvas.remove();
		$("#visualisationContainer").append("<canvas ng-hide='!booleenGrapheTableau' id='"+CanvasID+"'><canvas>");
		$scope.getChart(cleX,cleY,annee,CanvasID);
	};
	
	$scope.showCanvasDb = function(cleX, cleY, annee, CanvasID, lines) {
		var Canvas = document.getElementById(CanvasID);
		Canvas.remove();
		$("#visualisationContainer"+CanvasID).append("<canvas ng-hide='!booleenGrapheTableau' id='"+CanvasID+"'><canvas>");
		$scope.getChartDb(cleX,cleY,annee,CanvasID, lines);
	};

	$scope.afficherGrapheTableau = function() {
		if($scope.booleenGrapheTableau) { // on a un tableau donc on veut passer à un graphe
			$scope.labelButtonGraphtoTable = "Tableau";
			$scope.booleenGrapheTableau = false;
		}
		else { // on a un graphe donc on veut passer à un tableau
			$scope.labelButtonGraphtoTable = "Graphe";
			$scope.booleenGrapheTableau = true;
		}
	};
	
	$scope.afficherGrapheTableauDb = function(idWidg) {
		if($scope.listWidgets[idWidg].booleenGrapheTableau) { // on a un tableau donc on veut passer à un graphe
			$scope.listWidgets[idWidg].labelButtonGraphtoTable = "Tableau";
			$scope.listWidgets[idWidg].booleenGrapheTableau = false;
		}
		else { // on a un graphe donc on veut passer à un tableau
			$scope.listWidgets[idWidg].labelButtonGraphtoTable = "Graphe";
			$scope.listWidgets[idWidg].booleenGrapheTableau = true;
		}
	};

	// Lecture du fichier JSON sélectionné, récupération des paires clés-valeurs et analyse sur le type des headers (date, number ou string)
	$scope.getTextFile = function () {
		// console.log("scope.file : ", $scope.file);
		fileReader.readAsText($scope.file, $scope).then(function(result) {
			$scope.jsonSrc = result;
			var fileInput = document.getElementById('selectedFile');    
			$scope.jsonFileName = fileInput.files[0].name;
			$scope.keys = [];
			$scope.values = [];
			$scope.lignes = JSON.parse($scope.jsonSrc);

			header = $scope.lignes[0];
			$scope.type = null;
			$scope.types = [];
			angular.forEach(header, function(value, key) {
				$scope.keys.push(key);
				$scope.values.push(value);
				if (value.match(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/)){ //expression rÃ©guliÃ¨re pour les dates
					type = 'date';
				}

				else if (value.match(/^[\d ]+$/)){ // expression régulière correspondant à des digits en acceptant les espaces
					type = 'number';
				}
				else {
					type = 'string';  // par défaut c'est un string
				}
				$scope.types.push(type);
			});


			for (i in $scope.lignes) {

				for (j in $scope.lignes[i]) {

					$scope.lignes[i][j] = $scope.parseValue($scope.lignes[i][j]);
				}
			}

			$scope.search();

		});
	};

	$scope.uniqId = 2;

	// Fonction qui crée les options dans les balises select des axes supplémentaires
	$scope.generateOption = function(){
		var optionArr = [];
		optionArr.push('<option value="">Choisir Axe</option>');

		$.each($scope.lignes[0], function(key, val){
			optionArr.push('<option value="'+ key +'">'+ key +'</option>');
		});

		return optionArr.join('\n');
	};

	// Fonction d'ouverture d'un Widget
	$scope.openWidget = function(idW, widgName, nbCol, idUniq, arraySelecteds, dispLim,
			jsonFile, widgSection, jsonName, scopeKeys, jsonLines, val, typ, filteredIt,
			groupedIt, itPerPage, pagedIt, curPage, queryTab, sortOrder,
			reverseOrder, lbGrToTa, boolGrTa, selYear) {

		$scope.idWidget = idW;
		$scope.widgetName = widgName;
		$scope.colCount = nbCol;
		$scope.uniqId = idUniq;
		$scope.selecteds = arraySelecteds;
		$scope.display_limit1 = dispLim;
		$scope.sectionWidget = widgSection;
		$scope.jsonFileName = jsonName;
		$scope.filteredItems = filteredIt;
		$scope.groupedItems = groupedIt;
		$scope.itemsPerPage = itPerPage;
		$scope.pagedItems = pagedIt;
		$scope.currentPage = curPage;
		$scope.query = queryTab;
		$scope.sortingOrder = sortOrder;
		$scope.reverse = reverseOrder;

		$scope.jsonSrc = jsonFile;
		$scope.keys = scopeKeys;
		$scope.values = val;
		$scope.lignes = jsonLines;
		//$scope.lignes = JSON.parse($scope.jsonSrc);
		header = $scope.lignes[0];
		$scope.type = null;
		$scope.types = typ;
		$scope.labelButtonGraphtoTable = lbGrToTa;
		$scope.booleenGrapheTableau = boolGrTa;
		$scope.selectedYear = selYear;
		$scope.visuContainer = "visualisationContainer" + idW;

		$scope.search();
	};

	// Fonction lorsque l'on quitte le modal contenant un Widget
	$scope.closeWidget = function() {

		$scope.idWidget = 0;
		$scope.widgetName = "Nouveau Widget";
		$scope.colCount = 2;
		$scope.uniqId = 2;
		$scope.selectedX = 0;
		$scope.selectedY = 1;
		$scope.selectedZ1 = 2;
		$scope.selectedZ2 = 3;
		$scope.selectedZ3 = 4;
		$scope.selectedZ4 = 5;
		$scope.selectedZ5 = 6;
		$scope.selecteds = [$scope.selectedX, $scope.selectedY, $scope.selectedZ1, $scope.selectedZ2, $scope.selectedZ3, $scope.selectedZ4, $scope.selectedZ5];
		$scope.display_limit1 = 10;
		$scope.sectionWidget = "Ventes";
		$scope.jsonFileName = "";
		$scope.query = "";
		$scope.sortingOrder = "";
		$scope.reverse = false;
		$scope.filteredItems = [];
		$scope.groupedItems = [];
		$scope.itemsPerPage = 10;
		$scope.pagedItems = [];
		$scope.currentPage = 0;

		document.getElementById("selectedFile").value = "";
		$scope.jsonSrc = "";
		$scope.selectedJson = "";
		$scope.json = "";
		$scope.keys = [];
		$scope.values = [];
		//$scope.lignes = null;
		header = null;
		$scope.type = null;
		$scope.types = [];
		$scope.labelButtonGraphtoTable = "Graphe";
		$scope.booleenGrapheTableau = true;
		$scope.selectedYear = "";
		$scope.visuContainer = "visualisationContainer";
	};

	$scope.raiseNumber = function() {

		if ($scope.uniqId <= 6) {
			$scope.uniqId = $scope.uniqId + 1;
			$scope.colCount = $scope.colCount + 1;
			// scope.$apply();
		}
	};

	$scope.reduceNumber = function() {

		if ($scope.uniqId > 2) {
			$scope.uniqId = $scope.uniqId - 1;
			$scope.colCount = $scope.colCount - 1;
			// scope.$apply();

		}
	};
};
//$inject = ['$scope', '$filter'];

//Directive de sélection du fichier JSON par l'utilisateur
app.directive("ngFileSelect",function(){

	return {
		link: function($scope,el){

			el.bind("change", function(e){

				$scope.file = (e.srcElement || e.target).files[0];
				$scope.getFile();
			});

		}

	};
});

//Directive de lecture du fichier JSON sélectionné par l'utilisateur
app.directive("readText", function() {
	return {
		link: function($scope,el) {
			el.bind("change", function(e) {
				$scope.file = (e.srcElement || e.target).files[0];
				$scope.getTextFile();
			});
		}
	};
});

app.filter('bySection', function() {

	return function(listWidgets, sections) {

		var items = {
	            sections: sections,
	            out: []
	        };

		angular.forEach(listWidgets, function (value, key) {
			if (angular.equals(sections, value.sectionWidget) == true || angular.equals('Tous', sections) == true) {
                this.out.push(value);
            }
        }, items);
        return items.out;
	};
});
