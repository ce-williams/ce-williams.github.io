var crystals = [
    {
        value: 0,
        color: "blue"
    },
    {
        value: 0,
        color: "green"
    },
    {
        value: 0,
        color: "white"
    },
    {
        value: 0,
        color: "yellow"
    }
];

var values = {
    goalValueVar: 0,
    user: {
        userTotalVar: 0,
        userWins: 0,
        userLosses: 0
    }
};




// if (goalValueVar)

function getRandomInt(min, max) {
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function startNewGame() {
    values.user.userTotalVar = 0;
    values.goalValueVar = getRandomInt(5, 15);
    for (i = 0; i < crystals.length; i++) {
        crystals[i].value = getRandomInt(3, 5);
    }


    $("#totalScore").html(values.user.userTotalVar);
    $("#numberToBeat").html(values.goalValueVar);
}



startNewGame();

function addValueToScore(color) {
    crystals.forEach(function (crystal) {
        if (color == crystal.color) {
            console.log(crystal);
            values.user.userTotalVar += crystal.value;
            $("#totalScore").html(values.user.userTotalVar);
            
            
            if (values.user.userTotalVar == values.goalValueVar) {
                values.user.userWins++;
                $(".wins:first").html(values.user.userWins)
                alert("You've won!")
                startNewGame();
            } else if (values.user.userTotalVar > values.goalValueVar) {
                values.user.userLosses++;
                $(".losses:first").html(values.user.userLosses)
                alert("You've lost!")
                startNewGame();
            }



        }
    })
}




$(".blue:first").on("click", function () {
    addValueToScore("blue");
});
// $(".green:first").addEventListener("click")
// $(".white:first").addEventListener("click")
// $(".yellow:first").addEventListener("click")




console.log(crystals);
console.log(values);

