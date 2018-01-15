
var ImageUploadController = function ($scope, fileReader) {
     console.log(fileReader)
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
	
	$scope.resXY = [];
     console.log(fileReader)
 
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
	
	$scope.display_limit = 5;
	
	$scope.usersTable = new ngTableParams(
		{
		page: 1,
        count: 10
        }, 
		{
        total: $scope.resXY.length, 
        getData: function ($defer, params) {
		$scope.data = params.sorting() ? $filter('orderBy')($scope.resXY, params.orderBy()) : $scope.resXY;
		$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
		$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
		$defer.resolve($scope.data);
		}
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
		console.log($scope.resXY);
      };

  };
};

// var JsonController=function($scope,$http){
//   //Ici remplacer $scope.acteurs par le json input
//   $scope.acteurs ={};

//   $http.get('acteurs.json').success(function (data){
//     $scope.acteurs = data;
//     headers = /*data.*/data[0];
//           $scope.keys = [];
//           $scope.values = [];
//           angular.forEach(headers, function(value, key) {
//             $scope.keys.push(key);
//             $scope.values.push(value);
//           })
//   });
//   $scope.getTotalActeurs = function(){
//         return $scope.acteurs.length;    
//     }

//   $scope.getJson = function(){
//         return $scope.acteurs;
//   }

    

//};
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