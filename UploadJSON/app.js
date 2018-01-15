
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
var JsonUploadController = function ($scope, fileReader) {
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