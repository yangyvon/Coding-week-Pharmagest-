// Controller AngularJS
var JsonUploadController = function ($scope, $filter, $timeout, ngTableParams, fileReader) {
	
	// Initialisation de la liste des Widgets contenus dans l'OffiBoard
	$scope.listWidgets = [];
	
	// Nom du Widget par défaut
	$scope.widgetName = "Nouveau Widget";
	
	// Nombre de colonnes dans le tableau 2D (2 colonnes par défaut)
	$scope.colCount = 2;
	
	// Nombre de lignes affichées dans le tableau (10 lignes par défaut)
	$scope.display_limit1 = 10;
	
	// Initialisation des axes
	$scope.selectedX = 0;
	$scope.selectedY = 1;
	$scope.selectedZ1 = 2;
	$scope.selectedZ2 = 3;
	$scope.selectedZ3 = 4;
	$scope.selectedZ4 = 5;
	$scope.selectedZ5 = 6;
	
	// Identifiant des axes supplémentaires (de 2 à 6)
	$scope.uniqId = 2;
	
	// Liste des axes
	$scope.selecteds = [$scope.selectedX, $scope.selectedY, $scope.selectedZ1, $scope.selectedZ2, $scope.selectedZ3, $scope.selectedZ4, $scope.selectedZ5];
	
	// Liste des différentes sections dans l'OffiBoard
	$scope.listeSection = ["Ventes","Achats","Clients","Collectivites","Operateurs","Produits"];
	
	// Section du Widget
	$scope.sectionWidget = "Ventes";
	
	// Initialisation de la liste des Checkboxes sélectionnées par l'utilisateur dans le modal "Supprimer des Widgets"
	$scope.checkBoxId = [];
	
	// Supprime l'élément à l'indice $index de la liste checkBoxId
	$scope.remove1 = function($index){ 
		$scope.checkBoxId.splice($index, 1);     
	}
		
	// Supprime l'élément à l'indice $index de la liste listWidgets
	$scope.remove2 = function($index){ 
		$scope.listWidgets.splice($index, 1);     
	}
		
	// Ajoute un nouveau Widget dans la liste des Widgets
	$scope.widgetAdd = function(nameWidg, nbCol, idUniq, arraySelecteds, dispLim, jsonFile, sectionWidg) {
		$scope.listWidgets.push({"nomWidget":nameWidg, "jsonFile":jsonFile, "nbCol":nbCol, "idCol":idUniq, "Axes":arraySelecteds, "nbLignes":dispLim, "sectionWidget":sectionWidg});
	}
		
	// Supprime de la liste des Widgets les Widgets sélectionnés par l'utilisateur dans le modal "Supprimer des Widgets"
	$scope.widgetDelete = function() {
			
		var nbSupprimes = 0;
		for (var i = 0 ; i < $scope.checkBoxId.length ; i++) {
				
			$scope.remove2($scope.checkBoxId[i]-nbSupprimes);
			nbSupprimes = nbSupprimes+1;
		}
			
		$scope.checkBoxId = [];
	}
		
	// Ajoute ou enlève le numéro de la checkbox de la liste checkBoxId lors d'un clic utilisateur
	$scope.checkBoxClick = function(nb) {
			
		if(($scope.checkBoxId).indexOf(nb) < 0) {
			$scope.checkBoxId.push(nb);
		}
			
		else {
			$scope.remove1(nb);
		}
	}
		
	// Initialisation de l'horloge
	$scope.clock = "loading clock...";
	$scope.tickInterval = 1000;

	// Affichage de la date et de l'heure en temps réel
	var tick = function () {
		$scope.clock = Date.now();
		$timeout(tick, $scope.tickInterval);
	}
	$timeout(tick, $scope.tickInterval);
	
	// Liste des mois de l'année (pour l'affichage du tableau mois par mois)
	$scope.getMonthsNames = function() {
		 var monthsNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
		 return monthsNames;
	}

	// Lecture du fichier JSON sélectionné, récupération des paires clés-valeurs et analyse sur le type des headers (date, number ou string)
	$scope.getTextFile = function () {
		fileReader.readAsText($scope.file, $scope).then(function(result) {
			$scope.jsonSrc = result;
			$scope.keys = [];
			$scope.values = [];
			$scope.lignes = JSON.parse($scope.jsonSrc);
			header = $scope.lignes[0];
			$scope.type = null;
			$scope.types = [];
			angular.forEach(header, function(value, key) {
				$scope.keys.push(key);
				$scope.values.push(value);
				if (value.match(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/)){ //expression régulière pour les dates
					type = 'date';
				}

				else if (value.match(/^[\d ]+$/)){ //expression régulière correspondant à des digits en acceptant les espaces
					type = 'number';
				}
				else {
					type = 'string';  //par défaut c'est un string
				}
				$scope.types.push(type);
			})
		});

		// Valeurs associées au header string
		$scope.getValues = function(string) {
		  
			var res = [];
				
			for (var i = 0 ; i < $scope.lignes.length ; i++) {
				res[i] = $scope.lignes[i][string];
			}
			
			return res;
		};
		
		// Somme les valeurs en fonction du mois
		$scope.sumValuesByMonth = function(cleDate, cleY, annee) {
			var months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var date;
			for (var i = 0; i < $scope.lignes.length; i++) {
				date = new Date($scope.lignes[i][cleDate]);
				if (date.getFullYear() == annee) {
					var input = $scope.lignes[i][cleY]; //Pour gérer les espaces dans les chaines de caractères issues de l'offiReport
					var processed = input.replace(/ /g, '');
					var output = parseInt(processed, 10);
					months[date.getMonth()] += +output; //Fait la somme par mois
				}
			}
			return(months);
		};

	};
	
	// Fonction qui crée les options dans les balises select des axes supplémentaires
	$scope.generateOption = function(){
		var optionArr = [];
		optionArr.push('<option value="">Choisir Axe</option>');
		
		$.each($scope.lignes[0], function(key, val){
			optionArr.push('<option value="'+ key +'">'+ key +'</option>');
		});
		
		return optionArr.join('\n');
	}
	
	// Fonction d'ouverture d'un Widget
	$scope.openWidget = function(widgName, nbCol, idUniq, arraySelecteds, dispLim, jsonFile, widgSection) {
		
		$scope.widgetName = widgName;
		$scope.colCount = nbCol;
		$scope.uniqId = idUniq;
		$scope.selecteds = arraySelecteds;
		$scope.display_limit1 = dispLim;
		$scope.sectionWidget = widgSection;
		$scope.checkBoxId = [];
		
		$scope.jsonSrc = jsonFile;
		$scope.keys = [];
		$scope.values = [];
		$scope.lignes = JSON.parse($scope.jsonSrc);
		header = $scope.lignes[0];
		$scope.type = null;
		$scope.types = [];
		angular.forEach(header, function(value, key) {
			$scope.keys.push(key);
			$scope.values.push(value);
			if (value.match(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/)){
				type = 'date';
			}

			else if (value.match(/^[\d ]+$/)){
				type = 'number';
			}
			else {
				type = 'string';
			}
			$scope.types.push(type);
		})
		
		for (var j = 2 ; j < $scope.uniqId ; j++) {
			var myEl = angular.element(document.querySelector("#space-for-buttons"));
			var options = [];
			for (key in $scope.keys) {
				
				options.push($scope.keys.indexOf(key));
			}
			myEl.append("<select id='divselecteds["+j+"]' ng-model='selecteds["+j+"]' ng-options='opt in options'></select>");
		}
	}
};

// Directive de sélection du fichier JSON par l'utilisateur
app.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
      
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
      
    }
    
  }
});

// Directive de lecture du fichier JSON sélectionné par l'utilisateur
app.directive("readText", function() {
  return {
    link: function($scope,el) {
      el.bind("change", function(e) {
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getTextFile();
      });
    }
  }
});

// Directive pour les boutons + et - des axes supplémentaires dans le tableau
app.directive("addbuttonsbutton", function(){
	return {
		restrict: "E",
		template: "<button addbuttons ng-show=\"jsonSrc\">+</button><button removebuttons ng-show=\"jsonSrc\">-</button>"
	}
});

// Directive pour l'ajout d'un axe supplémentaire dans le tableau
app.directive("addbuttons", function($compile){
	return{
        link: function(scope, element, attrs){
		element.bind("click", function(){
			if (scope.uniqId <= 6) {
				angular.element(document.getElementById('space-for-buttons')).append($compile("<select id='divselecteds["+scope.uniqId+"]' ng-model='selecteds["+scope.uniqId+"]' ng-options='keys.indexOf(key) as key for key in keys'></select>")(scope));
				scope.uniqId = scope.uniqId + 1;
				scope.colCount = scope.colCount + 1;
			}
		});
        }
	};
});

// Directive pour la suppression d'un axe supplémentaire dans le tableau
app.directive("removebuttons", function($compile){
	return{
        link: function(scope, element, attrs){
		element.bind("click", function(){
			if (scope.uniqId > 2) {
				var i = scope.uniqId - 1;
				angular.element(document.getElementById("divselecteds["+i+"]")).remove();
				scope.uniqId = scope.uniqId - 1;
				scope.colCount = scope.colCount - 1;
			}
		});
        }
	};
});