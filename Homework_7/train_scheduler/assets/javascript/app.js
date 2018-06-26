$(document).ready(function(){
    $(".btn-primary").on("click", function submitForm (){
        var trainNameInput = $("#formGroupExampleInput1").val();
        var destinationInput = $("#formGroupExampleInput2").val();
        var firstTrainTimeInput = $("#formGroupExampleInput3").val();
        var frequencyInput = $("#formGroupExampleInput4").val();
        $("table").prepend(trainNameInput, destinationInput, firstTrainTimeInput, frequencyInput);
    
    });


});

