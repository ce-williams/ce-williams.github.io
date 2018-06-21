$(document).ready(function)

var topics = ["Michael", "Jim", "Dwight", "Pam", "Oscar", "Kevin"];



$("button").on("click", function () {
    var topic = $(this).attr("data-topic");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var results = response.data
        for (var i = 0; i < results.length; i++) {
            var topicDiv = $("<div>")
            var ratingP = $("<p>")
            ratingP.html(data[i].rating)
            var topicImage = $("<img>")
            topicImage.attr("src", data[i].images.fixed_height.url)
            topicImage.attr("alt", "Image from api")
            topicDiv.append(ratingP)
        }
    });
});

function renderButtons() {

    $("#buttons-view").empty();

    for (var i = 0; i < searches.length; i++) {

        var a = $("<button>");

        a.addClass("gif-btn");

        a.attr("data-name", searches[i]);
        // Providing the initial button text
        a.text(searches[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(a);
    }
}


// var keyLC = toLowerCase("DgI71RL9D74xpIehLMBbxFr5zun00MwO");
// console.log(keyLC);

// q = "type"
// limit = "10"
// rating = "pg"

//var myKey = "DgI71RL9D74xpIehLMBbxFr5zun00MwO"

// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
// xhr.done(function (data) { console.log("success got data", data); });
