var JsonUploadController = function ($scope, $filter, ngTableParams, fileReader) {
	$scope.getMonthsNames = function() {
     var monthsNames= ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
     return monthsNames;
    }
	
	$scope.display_limit1 = 10;
 
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

  var uniqId = 1;
  var selectedOptionDataList = new Array();

function regenerateSelectbox(){
    $('select.dyn-select').each(function(){
        var _selector = $(this);
        var _curVal = _selector.val();
        
        _selector.html(generateOption());
        if(_curVal == ""){
            _selector.append('<option value="'+ _curVal +'">select</option>');
        }else{
            _selector.append('<option value="'+ _curVal +'">'+ _curVal +'</option>');
        }
        _selector.val(_curVal);
    })
}

function checkOptionExistences(listOptionVal){
    var _found = false;
    
    $.each(selectedOptionDataList, function(inn, vnn){  
        if(vnn.selectboxoption == listOptionVal){
            _found = true;
        }
    });
    
    return _found;
}

function generateOption(){
    var optionArr = new Array();
    optionArr.push('<option value="">Choisir Axe</option>');
    
    $.each($scope.lignes[0], function(key, val){
        if(!checkOptionExistences(key)){
          optionArr.push('<option value="'+ key +'">'+ key +'</option>');
        }
    });
    
    return optionArr.join('\n');
}

function removeSelectedOptionFromList(param){
    var tmpArrList = selectedOptionDataList;
    selectedOptionDataList = new Array();
    
    $.each(tmpArrList, function(i, v){
        if(param.selectboxid != v.selectboxid){
            selectedOptionDataList.push({'selectboxid':v.selectboxid, 'selectboxoption':v.selectboxoption});
        }
    });
}

function selectedOptionList(param){
    var _found = false;
    $.each(selectedOptionDataList, function(i, v){
        if(param.selectboxid == v.selectboxid){
            _found = true;
            v.selectboxoption = param.selectboxoption;
        }
    });
    
    if(!_found){
        selectedOptionDataList.push({'selectboxid':param.selectboxid, 'selectboxoption':param.selectboxoption});
    }
}

$('#ajoutAxe').click(function(){
    if(selectedOptionDataList.length == Object.keys($scope.lignes[0]).length){
        alert('Plus d axe disponible !');
    }else{
      $('div#axesY').append('<select class="dyn-select" id="select-'+ uniqId +'">'+ generateOption() +'</select>');
      uniqId++;
    }
});

$(document).on('change', 'select.dyn-select', function(){
    var _selector = $(this);
    if(_selector.val() == ""){
        removeSelectedOptionFromList({'selectboxid':_selector.attr('id')});
    }else{
        selectedOptionList({'selectboxid':_selector.attr('id'), 'selectboxoption':_selector.val()});
    }
    
    regenerateSelectbox();
});
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