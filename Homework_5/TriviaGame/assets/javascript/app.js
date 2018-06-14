var questionAnswers = {
    one: {
        answer: "Mitochondria",
        choiceOne: "Rhibosome",
        choiceTwo: "DNA",
        choiceThree: "Cytoplasm"
    },
    two: {
        answer: "Electrophile",
        choiceOne: "Plasma",
        choiceTwo: "Bacteria",
        choiceThree: "Gasses"
    },
    three: {
        answer: "Charles Darwin",
        choiceOne: "Isaac Newton",
        choiceTwo: "Einstein",
        choiceThree: "Galileo"
    },  
    four: {
        answer: "Pangea",
        choiceOne: "Madagascar",
        choiceTwo: "Tectonic",
        choiceThree: "Exodus"
    }, 
    five: {
        answer: "Photosynthesis",
        choiceOne: "Resperation",
        choiceTwo: "Fertilization",
        choiceThree: "Meiosis"
    }  
}

var user = {
    score: {
        correct: 0,
        incorrect: 0
    }
}

var userChoiceOne = "none"
var userChoiceTwo = "none"
var userChoiceThree = "none"
var userChoiceFour = "none"
var userChoiceFive = "none"

// // This code will run as soon as the page loads
// window.onload = function() {
    
//     stopwatch.start;
//   };
  
//   //  Variable that will hold our setInterval that runs the stopwatch
//   var intervalId;
  
//   // prevents the clock from being sped up unnecessarily
//   var clockRunning = false;
  
//   // Our stopwatch object
//   var stopwatch = {
  
//     time: 0,
//     //lap: 1,
  
//     reset: function() {
  
//       stopwatch.time = 60000;
//       //stopwatch.lap = 1;
  
//       // DONE: Change the "display" div to "01:00."
//       $("#display").text("01:00");
  
//       // DONE: Empty the "laps" div.
//       //$("#laps").text("");
//     },
//     start: function() {
  
//       // DONE: Use setInterval to start the count here and set the clock to running.
//       if (!clockRunning) {
//         intervalId = setInterval(stopwatch.count, 1000 --);
//         clockRunning = true;
//       }
//     },
//     stop: function() {
  
//       // DONE: Use clearInterval to stop the count here and set the clock to not be running.
//       clearInterval(intervalId);
//       clockRunning = false;
//     },
//     // recordLap: function() {
  
//     //   // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
//     //   //       and save the result in a variable.
//     //   var converted = stopwatch.timeConverter(stopwatch.time);
  
//     //   // DONE: Add the current lap and time to the "laps" div.
//     //   $("#laps").append("<p>Lap " + stopwatch.lap + " : " + converted + "</p>");
  
//     //   // DONE: Increment lap by 1. Remember, we can't use "this" here.
//     //   stopwatch.lap++;
//     // },
//     count: function() {
  
//       // DONE: increment time by 1, remember we cant use "this" here.
//       stopwatch.time--;
  
//       // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
//       //       and save the result in a variable.
//       var converted = stopwatch.timeConverter(stopwatch.time);
//       console.log(converted);
  
//       // DONE: Use the variable we just created to show the converted time in the "display" div.
//       $("#display").text(converted);
//     },
//     timeConverter: function(t) {
  
//       var minutes = Math.floor(t / 60);
//       var seconds = t - (minutes * 60);
  
//       if (seconds < 10) {
//         seconds = "0" + seconds;
//       }
  
//       if (minutes === 0) {
//         minutes = "00";
//       }
//       else if (minutes < 10) {
//         minutes = "0" + minutes;
//       }
  
//       return minutes + ":" + seconds;
//     }
//   };
  

//Question One

$(".answerOne").text(questionAnswers.one.answer)
$(".choiceOneOne").text(questionAnswers.one.choiceOne)
$(".choiceOneTwo").text(questionAnswers.one.choiceTwo)
$(".choiceOneThree").text(questionAnswers.one.choiceThree)

// Question Two

$(".answerTwo").text(questionAnswers.two.answer)
$(".choiceTwoOne").text(questionAnswers.two.choiceOne)
$(".choiceTwoTwo").text(questionAnswers.two.choiceTwo)
$(".choiceTwoThree").text(questionAnswers.two.choiceThree)

// Question Three

$(".answerThree").text(questionAnswers.three.answer)
$(".choiceThreeOne").text(questionAnswers.three.choiceOne)
$(".choiceThreeTwo").text(questionAnswers.three.choiceTwo)
$(".choiceThreeThree").text(questionAnswers.three.choiceThree)


// Question Four
$(".answerFour").text(questionAnswers.four.answer)
$(".choiceFourOne").text(questionAnswers.four.choiceOne)
$(".choiceFourTwo").text(questionAnswers.four.choiceTwo)
$(".choiceFourThree").text(questionAnswers.four.choiceThree)

//Question Five
$(".answerFive").text(questionAnswers.five.answer)
$(".choiceFiveOne").text(questionAnswers.five.choiceOne)
$(".choiceFiveTwo").text(questionAnswers.five.choiceTwo)
$(".choiceFiveThree").text(questionAnswers.five.choiceThree)


// 2
// 4
// 1
// 4
// 2




function submitTest() {
    var u1 = ($('input[name=inlineOptions1]:checked').val());
    var u2 = ($('input[name=inlineOptions2]:checked').val());
    var u3 = ($('input[name=inlineOptions3]:checked').val());
    var u4 = ($('input[name=inlineOptions4]:checked').val());
    var u5 = ($('input[name=inlineOptions5]:checked').val());

    //console.log(u1, u2, u3, u4, u5);

    if (u1 == "option2") {
        user.score.correct ++
    } else {
        user.score.incorrect ++
    };
    if (u2 == "option4") {
        user.score.correct ++
    } else  {
        user.score.incorrect ++
    }
    if (u3 == "option1") {
        user.score.correct ++
    } else {
        user.score.incorrect ++
    }
    if (u4 == "option4") {
        user.score.correct ++
    } else {
        user.score.incorrect ++
    }
    if (u5 == "option2") {
        user.score.correct ++
    } else  {
        user.score.incorrect ++
    }

    //stopwatch.stop;

    alert ("You had " + user.score.correct + " correct and " + user.score.incorrect + " incorrect.")

    user.score.correct = 0
    user.score.incorrect = 0

    //stopwatch.reset;


};




// if (u1 = "option2") {
//     user.score.correct ++
// } else {
//     user.score.incorrect ++
// };
// if (u2 = "option4") {
//     user.score.correct ++
// } else  {
//     user.score.incorrect ++
// }
// if (u3= "option1") {
//     user.score.correct ++
// } else {
//     user.score.incorrect ++
// }
// if (u4 = "option4") {
//     user.score.correct ++
// } else {
//     user.score.incorrect ++
// }
// if (u5 = "option2") {
//     user.score.correct ++
// } else  {
//     user.score.incorrect ++
// }


//console.log(user.score.correct)
//console.log(user.score.incorrect)

// alert ("You had " + user.score.correct + " correct and " + user.score.incorrect + " incorrect.")

