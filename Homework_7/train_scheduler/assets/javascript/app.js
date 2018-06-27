
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

    $(".btn-primary").click(function submitForm (){
        var trainNameInput = $("#formGroupExampleInput1").val();
        var destinationInput = $("#formGroupExampleInput2").val();
        var firstTrainTimeInput = $("#formGroupExampleInput3").val();
        var frequencyInput = $("#formGroupExampleInput4").val();
        var markup = "<tr><td>" + trainNameInput + "</td><td>" + destinationInput + "</td><td>" + firstTrainTimeInput + "</td><td>" + frequencyInput + "</td><td>";
        $("table tbody").append(markup);
    });





});

