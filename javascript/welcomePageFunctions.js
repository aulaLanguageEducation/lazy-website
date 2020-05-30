// stuff for welcomepage


var btnEnter = document.getElementById("btn_enter");
btnEnter.addEventListener('click', function (e) {
    //Send message to current room.
    var inpUsername = document.getElementById("inp_username");
    cleanText = inpUsername.value.replace(/(\r\n|\n|\r)/gm, "");
    if (cleanText != "") {
        enterChat(cleanText);
    }else{
        alert("Please enter a username")
    }
});



document.querySelector('#inp_username').addEventListener('keypress', function (e) {
    var inpUsername = document.getElementById("inp_username");
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        //Create a new room when user press enter at input room name.
        cleanText = inpUsername.value.replace(/(\r\n|\n|\r)/gm, "");
        if (cleanText != "") {
            enterChat(cleanText);
        }else{
            alert("Please enter a username")
        }
    }
});



function enterChat(cleanText){
	//var inpUsername = document.getElementById("inp_username");
	console.log("username = "+cleanText)
	localStorage.setItem("loggin_user_name", cleanText);
    // link to main page
    window.location.href = '../html/index.html' //one level up

}
