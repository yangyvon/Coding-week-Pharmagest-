
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

    $scope.getValues = function(string) {
      
        var res = [];
        
        for (var i = 0 ; i < $scope.lignes.length ; i++) {    
          res[i] = $scope.lignes[i][string];
        }
        
        return res;
      };

  };
  
	$scope.users = [{"id":1,"first_name":"Philip","last_name":"Kim","email":"pkim0@mediafire.com","country":"Indonesia","ip_address":"29.107.35.8"},
                        {"id":2,"first_name":"Judith","last_name":"Austin","email":"jaustin1@mapquest.com","country":"China","ip_address":"173.65.94.30"},
                        {"id":3,"first_name":"Julie","last_name":"Wells","email":"jwells2@illinois.edu","country":"Finland","ip_address":"9.100.80.145"},
                        {"id":4,"first_name":"Gloria","last_name":"Greene","email":"ggreene3@blogs.com","country":"Indonesia","ip_address":"69.115.85.157"},
                        {"id":50,"first_name":"Andrea","last_name":"Greene","email":"agreene4@fda.gov","country":"Russia","ip_address":"128.72.13.52"}];
 
	$scope.usersTable = new ngTableParams(
		{
		page: 1,
        count: 10
        }, 
		{
        total: $scope.users.length, 
        getData: function ($defer, params) {
		$scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
		$scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
		$scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
		$defer.resolve($scope.data);
		}
        });
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