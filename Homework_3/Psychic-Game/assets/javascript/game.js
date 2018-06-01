var alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
var attempt = 0;


window.addEventListener("keydown", function(event){
    attempt++;
    console.log(attempt);
    console.log(event.key);
})


// event listener on the window (page)

console.log(attempt)