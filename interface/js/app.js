// Controller AngularJS
var JsonUploadController = function ($scope, $filter, $timeout, fileReader) {
	
	// Id du Widget courant
	$scope.idWidget = 0;

	// Label du bouton qui transitionne d'un graphe à un tableau
	$scope.labelButtonGraphtoTable="Graphe";
	
	// Booleen true -> tableau false -> graphe
	$scope.booleenGrapheTableau = true;
	
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

	// distinguer les sections
    $scope.flag="T";


    // Liste des axes
	$scope.selecteds = [$scope.selectedX, $scope.selectedY, $scope.selectedZ1, $scope.selectedZ2, $scope.selectedZ3, $scope.selectedZ4, $scope.selectedZ5];
	
	// Liste des différentes sections dans l'OffiBoard
	$scope.listeSection = ["Ventes","Achats","Clients","Collectivites","Operateurs","Produits"];
	
	// Section du Widget
	$scope.sectionWidget = "Ventes";

    // Liste des différentes sections dans l'OffiBoard
    $scope.listeSection2 = ["Tous","Ventes","Achats","Clients","Collectivites","Operateurs","Produits"];
    // Section du Widget2
    $scope.sectionWidget2 = "Tous";
	
	// Initialisation de la liste des Checkboxes sélectionnées par l'utilisateur dans le modal "Supprimer des Widgets"
	$scope.checkBoxId = [];

	//comparer la choix de section
    $scope.comparer =function (a) {


        if(a != "Tous"){
            $scope.flag = '';
        }else {
            $scope.flag= "T"
        }
        return  $scope.flag ;

    }


    // Supprime l'élément à l'indice $index de la liste checkBoxId
	$scope.remove1 = function($index){ 
		$scope.checkBoxId.splice($index, 1);     
	}
		
	// Supprime l'élément à l'indice $index de la liste listWidgets
	$scope.remove2 = function($index){ 
		$scope.listWidgets.splice($index, 1);     
	}
		
	// Ajoute un nouveau Widget dans la liste des Widgets
	$scope.widgetAdd = function(nameWidg, nbCol, idUniq, arraySelecteds, dispLim, jsonFile, sectionWidg, nameJson) {
		var newId = $scope.listWidgets.length;
		$scope.listWidgets.push({"idWidget":newId, "nomWidget":nameWidg, "jsonFile":jsonFile, "nbCol":nbCol, "idCol":idUniq, "Axes":arraySelecteds, "nbLignes":dispLim, "sectionWidget":sectionWidg, "jsonName":nameJson});
		
		$scope.closeWidget();
	}
		
	// Supprime de la liste des Widgets les Widgets sélectionnés par l'utilisateur dans le modal "Supprimer des Widgets"
	$scope.widgetDelete = function() {
			
		var nbSupprimes = 0;
		for (var i = 0 ; i < $scope.checkBoxId.length ; i++) {
				
			$scope.remove2($scope.checkBoxId[i]-nbSupprimes);
			nbSupprimes = nbSupprimes+1;
		}
			
		$scope.checkBoxId = [];
		
		for (var j = 0 ; j < $scope.listWidgets.length ; j++) {
		
			$scope.listWidgets[j]["idWidget"] = j;
		}
	}

    $scope.widgetMod =  function(nameWidg, nbCol, idUniq, arraySelecteds, dispLim, jsonFile, sectionWidg, nameJson) {
        var newWidget = {"idWidget":$scope.idWidget, "nomWidget":nameWidg, "jsonFile":jsonFile, "nbCol":nbCol, "idCol":idUniq, "Axes":arraySelecteds, "nbLignes":dispLim, "sectionWidget":sectionWidg, "jsonName":nameJson};

		var indexW = 0;
		
		for (var i = 0 ; i < $scope.listWidgets.length ; i++) {
			
			if (angular.equals($scope.listWidgets[i]["idWidget"], $scope.idWidget)) {
				
				//console.log("Found !");
				indexW = i;
			}
		}
		
        $scope.listWidgets.splice(indexW, 1, newWidget);
		
		$scope.closeWidget();
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
	
	$scope.propertyName = 'age';
	$scope.reverse = true;

	$scope.sortBy = function(propertyName) {
		//$scope.display_limit1 = $scope.lignes.length;
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};
	
	
	$scope.parseValue = function(val) {
		
		if (val.match(/^[\d ]+$/)) {
			
			return parseInt(val.split(' ').join(''),10);
		}
		
		else {
		
			return val;
		}
	}
		
	/*// Initialisation de l'horloge
	$scope.clock = "loading clock...";
	$scope.tickInterval = 1000;

	// Affichage de la date et de l'heure en temps réel
	$scope.tick = function () {
		$scope.clock = Date.now();
		$timeout($scope.tick, $scope.tickInterval);
	}
	$timeout($scope.tick, $scope.tickInterval);
	*/
	// Liste des mois de l'année (pour l'affichage du tableau mois par mois)
	$scope.getMonthsNames = function() {
		 var monthsNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
		 return monthsNames;
	}

	// Lecture du fichier JSON sélectionné, récupération des paires clés-valeurs et analyse sur le type des headers (date, number ou string)
	$scope.getTextFile = function () {
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
			
			
			for (i in $scope.lignes) {
				
				for (j in $scope.lignes[i]) {
					
					$scope.lignes[i][j] = $scope.parseValue($scope.lignes[i][j]);
					//console.log($scope.lignes[i][j]);
				}
			}
			
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
					//var processed = input.replace(/ /g, '');
					//var output = parseInt(processed, 10);
					var output = parseInt(input, 10);
					months[date.getMonth()] += +output; //Fait la somme par mois
				}
			}
			return(months);
		};


		//Fonction qui construit le graphe
	$scope.getChart = function(cleX,cleY,annee) {
      var Canvas = $("#ChartCanvas");
      var chartOptions = {
      animation:{
      	duration:1000
      },
      responsive:true,
      title:{
        display:true,
        position:'top',
        text: cleY+' par mois pour l\'année '+annee 
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
		//Fonction qui construit le graphe
	$scope.getChart2 = function(cleX,cleY,annee) {
      var Canvas = $("#ChartCanvas2");
      var chartOptions = {
      animation:{
      	duration:1000
      },
      responsive:true,
      title:{
        display:true,
        position:'top',
        text: cleY+' par mois pour l\'année '+annee 
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
 	$scope.showCanvas = function(cleX,cleY,annee){
	  var Canvas= $("#ChartCanvas");
	  Canvas.remove(); 
	  $("#visualisationContainer").append("<canvas ng-hide='!booleenGrapheTableau' id='ChartCanvas'><canvas>");
	  $scope.getChart(cleX,cleY,annee);
	};
	$scope.showCanvas2 = function(cleX,cleY,annee){
	  var Canvas= $("#ChartCanvas2");
	  Canvas.remove(); 
	  $("#visualisationContainer2").append("<canvas ng-hide='!booleenGrapheTableau' id='ChartCanvas2'><canvas>");
	  $scope.getChart2(cleX,cleY,annee);
	};
	$scope.afficherGrapheTableau=function(){
		if($scope.booleenGrapheTableau){ //on a un tableau donc on veut passer à un graphe
			$scope.labelButtonGraphtoTable="Tableau";
			$scope.booleenGrapheTableau=false;
		}else{//on a un graphe donc on veut passer à un tableau
			$scope.labelButtonGraphtoTable="Graphe";
			$scope.booleenGrapheTableau=true;
		}
	};
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
	}
	
	// Fonction d'ouverture d'un Widget
	$scope.openWidget = function(idW, widgName, nbCol, idUniq, arraySelecteds, dispLim, jsonFile, widgSection, jsonName) {
		
		$scope.idWidget = idW;
		$scope.widgetName = widgName;
		$scope.colCount = nbCol;
		$scope.uniqId = idUniq;
		$scope.selecteds = arraySelecteds;
		$scope.display_limit1 = dispLim;
		$scope.sectionWidget = widgSection;
		$scope.jsonFileName = jsonName;
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
	}
	
	// Fonction lorsque l'on quitte le modal contenant un Widget
	$scope.closeWidget = function() {
		
		$scope.idWidget = 0;
		$scope.widgetName = "Nouveau Widget " + ($scope.listWidgets.length+1);
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
		$scope.checkBoxId = [];
		
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
				scope.$apply();
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
				scope.$apply();

			}
		});
        }
	};
});