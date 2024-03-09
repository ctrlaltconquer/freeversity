
let card1 = document.getElementsByClassName("card1")[0];
card1.addEventListener("mouseover", function(){
    document.getElementsByClassName("round1")[0].style.animation = "roundUp 0.5s ease forwards";
})

card1.addEventListener("mouseout", function(){
    document.getElementsByClassName("round1")[0].style.animation = "roundDown 0.5s ease forwards";
})

let card2 = document.getElementsByClassName("card2")[0];
card2.addEventListener("mouseover", function(){
    document.getElementsByClassName("round2")[0].style.animation = "roundUp 0.5s ease forwards";
})

card2.addEventListener("mouseout", function(){
    document.getElementsByClassName("round2")[0].style.animation = "roundDown 0.5s ease forwards";
})

let card3 = document.getElementsByClassName("card3")[0];
card3.addEventListener("mouseover", function(){
    document.getElementsByClassName("round3")[0].style.animation = "roundUp 0.5s ease forwards";
})

card3.addEventListener("mouseout", function(){
    document.getElementsByClassName("round3")[0].style.animation = "roundDown 0.5s ease forwards";
})
