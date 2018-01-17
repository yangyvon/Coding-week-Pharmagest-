// Controller AngularJS
var JsonUploadController = function ($scope, $filter, $timeout, ngTableParams, fileReader) {
	
	// Nombre max de colonnes dans le tableau 2D
	$scope.colCount = 2;
	
	$scope.selectedX = 0;
	$scope.selectedY = 1;
	
	$scope.selecteds = [$scope.selectedX, $scope.selectedY, $scope.selectedZ1, $scope.selectedZ2, $scope.selectedZ3, $scope.selectedZ4, $scope.selectedZ5];
	
	// Liste des différentes sections dans l'OffiBoard
	$scope.listeSection = ["Ventes","Achats","Clients","Collectivites","Operateurs","Produits"];
	
	// Initialisation de la liste des Widgets contenus dans l'OffiBoard
	$scope.listWidgets = [];
	
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
	$scope.widgetAdd = function(jsonName, selectedX, selectedY, sectionWidg, nameWidg) {
		$scope.listWidgets.push({"nomWidget":nameWidg, "jsonName":jsonName, "selectX":selectedX, "selectY":selectedY, "sectionWidget":sectionWidg});
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
		
	// Nombre de lignes affichées dans le tableau (10 = valeur par défaut)
	$scope.display_limit1 = 10;

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

	$scope.uniqId = 2;
	
	function generateOption(){
		var optionArr = [];
		optionArr.push('<option value="">Choisir Axe</option>');
		
		$.each($scope.lignes[0], function(key, val){
			optionArr.push('<option value="'+ key +'">'+ key +'</option>');
		});
		
		return optionArr.join('\n');
	}
	
	$scope.ajoutCol = function() {
	
		$scope.colCount = $scope.colCount + 1;
	}
};

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

//Directive that returns an element which adds buttons on click which show an alert on click
app.directive("addbuttonsbutton", function(){
	return {
		restrict: "E",
		template: "<button addbuttons ng-show=\"jsonSrc\" id=\"ajoutAxe\">+</button>"
	}
});

//Directive for adding buttons on click that show an alert on click
app.directive("addbuttons", function($compile){
	return{
        link: function(scope, element, attrs){
		element.bind("click", function(){
			angular.element(document.getElementById('space-for-buttons')).append($compile("<select ng-model='selecteds["+scope.uniqId+"]' ng-options='keys.indexOf(key) as key for key in keys'></select>")(scope));
			// angular.element(document.getElementById('space-for-buttons')).append($compile("<span ng-show='types[selecteds[1]]'>Axe : {{keys[selecteds["+scope.uniqId+"]]}}</span>")(scope));
			angular.element(document.getElementById('space-for-buttons')).append($compile("<button ng-click='ajoutCol()'>Ajout</button>")(scope));
			scope.uniqId = scope.uniqId + 1;
		});
        }
	};
});