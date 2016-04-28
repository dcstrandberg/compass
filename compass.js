var app = angular.module('distApp', []);
app.controller('distCtrl', function($scope, $http, distService) {
//Include distService custom service
    //$scope.HOMELAT = 44.940601;
    //$scope.HOMELONG = -93.156662;
    
    //Initialize the classes for the buttons and the inital <h1>
    $scope.onClass = "inactive";
    $scope.offClass = "active";
    $scope.distance = "...";
    
    //Define geolocation settings
    this.distSettings = {
        enableHighAccuracy: false,
        timeout: 4000,
        maximumAge: 0
    };

    /*Eventually we'll get the locations from a JSON database
    $http.get("geolocation.json")
    .then(function(response){
       $scope.objList = response.data; 
    });*/
    
    //First a function for when the off button's pressed
    $scope.off = function(){
        //When Off is pressed, clear the watcher and reset the HTML
        navigator.geolocation.clearWatch( $scope.watchID );
    
        //Write "..." to the view and change the classes
        $scope.distance = "...";
        $scope.onClass = "inactive";
        $scope.offClass = "active";
    };
    //Now the on button
    $scope.on = function(){

        //Now that we've defined the callback functions, get the location
        if (navigator.geolocation) {
            //watchPosition returns an ID for clearing it later
            $scope.watchID = navigator.geolocation.watchPosition(
                //anonymous callback function to trigger a view change
                function(locObj) {
                    $scope.$apply(function() {
                        $scope.distance = distService.getDist(locObj);
                    });        
                }, function(err) { //Do the same if there's an error
                    $scope.$apply(function() {
                        $scope.distance = distService.onError(err);
                    });
                }, this.distSettings);            
        } else {
            $scope.distance = "Error!";
        }

        //Also switch the button classes
        $scope.onClass = "active";
        $scope.offClass = "inactive";
        return;
    };
    //Callback function for displaying the distance using geolocation object
    $scope.showDist = function(locObj){
        if (distService.error == 0){
            $scope.distance = "blahblahblah";//distService.getDist(locObj);
        } else {
            $scope.distance = distService.error;
        }
    };    

});//End of distCtrl controller 

//Declare a custom service
app.service('distService', function() {
    //this.error = 0; //If there's an error from the watchLocation function the error method will change this to 1
    //this.distance = "...";
    this.getDist = function(locObj){ //enclosed function to accept the geolocation object and update the display accordingly
        const EARTHRADIUS = 6371000; //Meters
        const HOMELAT = 44.940601, HOMELONG = -93.156662;
        var dist, lat0, long0;  
                     
        //Get the location coordinates
        lat0 = locObj.coords.latitude;
        long0 = locObj.coords.longitude;
        
        //Get the differences in lat and long and convert to radians
        var deltaLat = (HOMELAT - lat0) * Math.PI / 180;
        var deltaLong = (HOMELONG - long0) * Math.PI / 180;
        
        var a = 
            0.5 - Math.cos(deltaLat)/2 + 
            Math.cos(lat0 * Math.PI / 180) * Math.cos(HOMELAT * Math.PI / 180) * 
            (1 - Math.cos(deltaLong))/2;
        //Round the distance to 1 decimal point
        var dist = 
            (EARTHRADIUS * 2 * Math.asin( Math.sqrt(a) ) ).toFixed(1);
        //Add the units
        return dist + " m";
    };
        
    //Include the error function here too
    this.onError = function(err) {
        return "Error(" + err.code + "): " + err.message;
    };        
         
});//End of distService custom service

