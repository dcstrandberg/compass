var app = angular.module("discApp", []);
app.controller('discCtrl', function($scope, $http, $timeout){
    //Get the necessary info from the "database"
    /*$http.get("candorTest.json")
        .then(function(response) {
           //Assign the user object to name
           $scope.name = response.data;
    });*/
    $scope.name = {
        "name": "David",
        "msgList": []
    };
    $scope.sendMsg = function() {
        if ($scope.typedMsg == "") {return;}
        var newMsg = {
            "text": $scope.typedMsg,
            "datetime": new Date(),
            "msgClass": "sent"    
        };
        //After creating the new msg object, push it to the msgList array
        $scope.name.msgList.push( newMsg );
        //Clear the input field
        $scope.typedMsg = "";
        //Create a sample received message to test the CSS
        $timeout( function() {
            var receivedMsg = {
            "text": "Message Received",
            "datetime": new Date(),
            "msgClass": "received"    
            };
            $scope.name.msgList.push( receivedMsg ); 
        }, 2000);
    };
});//End of discCtrl

app.service('', function(typedMsg) {
    //Eventually have something to write the current text to the database
    
});