(function(module){

myApp.controller('jsonCtrl', function($scope, $http){
	//A remplacer par la fonction upload.success 
    //$http.get('employees.json').success(function (data){
	//	$scope.employees = data;
	//});
    $scope.employees=[
                { 'prenom': 'Anne-Claire', 'nom':'HEURTEL', 'statut': 'Encadrant universitaire', 'email':'anne-claire.heurtel@telecomnancy.eu', 'naissance':'01/01/1111'},
                { 'prenom': 'Jean-Christophe', 'nom':'JULIEN', 'statut': 'Encadrant industriel', 'email':'jean-christophe.julien@pharmagest.com','naissance':'01/01/1111'},
                { 'prenom': 'Lamia', 'nom':'MESSOUS', 'statut': 'Encadrant industriel', 'email':'lamia.messous@pharmagest.com','naissance':'01/01/1111'},
                { 'prenom': 'Quentin', 'nom':'DA SILVA', 'statut': 'Etudiant', 'email':'quentin.da-silva@telecomnancy.net', 'naissance':'20/03/1995'},
                { 'prenom': 'Yang', 'nom':'HU', 'statut': 'Etudiant', 'email':'yang.hu@telecomnancy.net','naissance':'01/01/1111'},
                { 'prenom': 'Dorian', 'nom':'MOREL-SAPENE', 'statut': 'Etudiant', 'email':'dorian.morel-sapene@telecomnancy.net','naissance':'01/01/1111'}
            ];
    
    $scope.getTotalEmployees    =   function(){
        return $scope.employees.length;    
    }
        
});

function testCtrl($scope){
  $scope.names = [
    {name:"Ramesh"},
    {name:"Vinod"},
    {name:"Ateendra"}
    ];
    
   $scope.addName = function(){
      $scope.names.push({ name:$scope.myName });
   }
   
    $scope.reversedMessage  =   function(){
        return $scope.myName.split("").reverse().join("");
    }
    
}
}(angular.module("TestUploadFile")));