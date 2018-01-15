
var ImageUploadController = function ($scope, fileReader) {
    //console.log(fileReader)
    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });
 
};
var JsonUploadController = function ($scope, $filter, ngTableParams, fileReader) {
	
    //console.log(fileReader)
	
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
          header=$scope.lignes[0]
          angular.forEach(header, function(value, key) {
            $scope.keys.push(key);
            $scope.values.push(value);
          })
    });

    $scope.getValues = function(string) {
      
        var res = [];
        
        for (var i = 0 ; i < $scope.lignes.length ; i++) {    
          res[i] = $scope.lignes[i][string];
        }
        
        return res;
      };
	  
	$scope.getValues2 = function(string1, string2) {
      
        var res = [];
        
        for (var i = 0 ; i < $scope.lignes.length ; i++) {    
          res.push({id:$scope.lignes[i][string1],val:$scope.lignes[i][string2]}); 
        }
		
		$scope.resXY = res;
		//console.log($scope.resXY);
		
		$scope.usersTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                total: $scope.resXY.length, 
                getData: function ($defer, params) {
                    $scope.data = $scope.resXY.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve($scope.data);
                }
            });
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