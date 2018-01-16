var JsonUploadController = function ($scope, $filter, ngTableParams, fileReader) {
	$scope.getMonthsNames = function() {
     var monthsNames= ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
     return monthsNames;
    }
	
	$scope.display_limit1 = 0;
	$scope.display_limit2 = 10;
 
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });

   $scope.getTextFile = function () {
    $scope.progress = 0;
    fileReader.readAsText($scope.file, $scope).then(function(result) {
      $scope.jsonSrc = result;
          $scope.keys = [];
          $scope.values = [];
          $scope.lignes=JSON.parse($scope.jsonSrc);
          header=$scope.lignes[0];
          $scope.type=null;
          $scope.types=[];
          angular.forEach(header, function(value, key) {
            $scope.keys.push(key);
            $scope.values.push(value);
            if (value.match(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/)){ //expression régulière pour les dates
              type='date';
            }

            else if (value.match(/^[\d ]+$/)){ //expression régulière correspondant à des digits en acceptant les espaces
              type='number';
            }
            else {
              type='string';  //par défaut c'est un string
            }
            $scope.types.push(type);
          })
    });

    $scope.getValues = function(string) {
      
        var res = [];
        
        for (var i = 0 ; i < $scope.lignes.length ; i++) {    
          res[i] = $scope.lignes[i][string];
        }
        
        return res;
      };
    $scope.sumValuesByMonth = function(cleDate,cleY,annee) {
      var months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var date;
      for (var i = 0; i < $scope.lignes.length; i++) {
        date = new Date($scope.lignes[i][cleDate]);
      if (date.getFullYear() == annee) {
        var input = $scope.lignes[i][cleY]; //Pour gérer les espaces dans les chaines de caractères issues de l'offiReport
        var processed = input.replace(/ /g, '');
        var output = parseInt(processed, 10);
        //Fait la somme par mois
        months[date.getMonth()] += +output;
      }
    }
    //console.log(months);
    return(months);
  };

  };
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

app.directive('scrollPosition', function ($window) {
  return function (scope, element, attrs) {      
    var w = element[0];
    //var w = $window;
    angular.element(w).bind('scroll', function () {                  
      scope.$apply(function () {                
        if (w.scrollTop + w.offsetHeight >= w.scrollHeight) {          
          scope.display_limit = scope.display_limit + 50;
        }
      });
    });
  }
});