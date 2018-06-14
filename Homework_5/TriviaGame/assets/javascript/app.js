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

    alert ("You had " + user.score.correct + " correct and " + user.score.incorrect + " incorrect.")

    user.score.correct = 0
    user.score.incorrect = 0


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

