
$(document).ready(function(){

    

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3hArzyGE9bs6mD1wcAnDxX8IlWo3ttus",
    authDomain: "trainschedule-e6d00.firebaseapp.com",
    databaseURL: "https://trainschedule-e6d00.firebaseio.com",
    projectId: "trainschedule-e6d00",
    storageBucket: "",
    messagingSenderId: "225259029409"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();

    // Initial values
    var trainNameInput
    var destinationInput
    var firstTrainTimeInput
    var frequencyInput


    $(".btn-primary").click(function submitForm (){
        
        event.preventDefault();

        var trainNameInput = $("#formGroupExampleInput1").val();
        var destinationInput = $("#formGroupExampleInput2").val();
        var firstTrainTimeInput = $("#formGroupExampleInput3").val();
        var frequencyInput = $("#formGroupExampleInput4").val();
        var markup = "<tr><td>" + trainNameInput + "</td><td>" + destinationInput + "</td><td>" + firstTrainTimeInput + "</td><td>" + frequencyInput + "</td><td>";
        $("table tbody").append(markup);

        database.ref().set({
            trainNameInput: nametrainNameInput,
            destinationInput: destinationInput,
            firstTrainTimeInput: firstTrainTimeInput,
            frequencyInput: frequencyInput
          });
    });

    // Firebase watcher + initial loader HINT: .on("value")
    database.ref().on("value", function(snapshot) {

  
        // Change the HTML to reflect
        $("#name-display").text(snapshot.val().name);
        $("#email-display").text(snapshot.val().email);
        $("#age-display").text(snapshot.val().age);
        $("#comment-display").text(snapshot.val().comment);
  
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });





});

