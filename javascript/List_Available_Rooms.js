
/////////////////////////////////////////////////////

////////////////////////////////////////////
/////////////// questions //////////////////

// What if a new room opens up?

// the order of items in an object is not stable
// should i display rooms alphabetically?

///////////////////////////////////////////

/////////////////////////////////////////
/////// call backs for rooms ///////////
///////////////////////////////////////

/**
 * Callback function from on_connect in SillyClient.
 * @param rooms
 * @returns None
 */
function show_room(rooms){ 
    
    parentOfRooms = document.getElementById("roomsGoHere")
    tempRoomsList = [];
    
    for (var myRoom in rooms) {

        //i noticed that when we chlick a new
        // room we just keep adding new dom objects
        // which are just repeats of precious rooms
        // so this checks that the room element
        // does not already exist

        var myEle = document.getElementById(myRoom);
        if(!myEle){
            temp = document.createElement("div");
            temp.setAttribute("id", myRoom);
            temp.setAttribute("class", "contact");
            //temp.setAttribute("onclick", "RoomClick(this.id)");
            temp.addEventListener('click', switchActiveContact, false);
            temp.setAttribute("onmouseover", "");
            temp.setAttribute("style", "cursor: pointer;");
            temp.innerText = myRoom;
        // tempRoomsList.push((temp, myRoom));
            parentOfRooms.appendChild(temp);
        }

        
        
    }

}
/*
* Create a div object for displaying send message by current client.
* @param msg
* @returns div object
*/
function createDivSendMessageWithYoutube(msg){

    messageIsYouTube = IsYouTube(msg)

    if (messageIsYouTube){

        //https://stackoverflow.com/questions/51316379/this-video-is-unavailable-when-putting-music-videos-in-iframe

        // NOTE MUSIC VIEDOS DONT WORK...
        //I found a fix actually. For some reason,
        // music videos need a web server in order to
        // play. So I just did a simple http server by 
        //using python - m http.server 80 and it worked. I 
        //don't know why it would need that, so if anybody
        // could explain that would be great – tytyty Jul 14 '18 at 15:01 

        var newDiv = document.createElement("div"); 
        newDiv.classList.add("msg-area-disptext-send");	
        var newDivInner = document.createElement("div"); 
        newDivInner.classList.add("speech-bubble-send");
        newDiv.appendChild(newDivInner);

        var newIFrame = document.createElement("iframe")
        newIFrame.classList.add("t-video");

        // turns out you can't just embed the 
        // url directly as youtube block it
        // it needs to be in the form:
        //"https://www.youtube.com/embed/"+video_id

        // find video ID
        var video_id = msg.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
        }

        //create embedded url
        newMsg = "https://www.youtube.com/embed/"+video_id
        
        // add to frame
        newIFrame.src = newMsg;
        newIFrame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        newDivInner.appendChild(newIFrame)


        return newDiv;
    }else{
    	return createDivSendMessage(msg);
  
    }
}



function IsYouTube(msg){

    //this function checks if the message is a youtube 
    // URL and returns a bool answering the question:
    //Is this a youtube url

    //check message against youtube url regex
    var myregexp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
    var found = msg.match(myregexp)

    //if a match is found return true, else false
    if (found != null){
        return true
    }else{
        return false
    }
}

/**
 * Create new div element for respond 
 * @param msg
 * @returns
 */
function createDivReceiveMessageWithYoutube(msg){

    var useridRegex = /^(\d*\w*)*:/

    var msgWithoutID = msg.replace(useridRegex,"");


    var userID = msg.substring(0, msg.indexOf(":")+1)

    //also remove inital space if one exists
    if (msgWithoutID[0] == " "){
        msgWithoutID = msgWithoutID.substring(1,msgWithoutID.length)
    }


    messageIsYouTube = IsYouTube(msgWithoutID)


    if (messageIsYouTube){

        //https://stackoverflow.com/questions/51316379/this-video-is-unavailable-when-putting-music-videos-in-iframe

        // NOTE MUSIC VIEDOS DONT WORK...
        //I found a fix actually. For some reason,
        // music videos need a web server in order to
        // play. So I just did a simple http server by 
        //using python - m http.server 80 and it worked. I 
        //don't know why it would need that, so if anybody
        // could explain that would be great – tytyty Jul 14 '18 at 15:01 

        var newDiv = document.createElement("div"); 
        newDiv.classList.add("msg-area-disptext-response");	

        var newDivInner = document.createElement("div"); 
        newDivInner.classList.add("speech-bubble-response");
        newDiv.appendChild(newDivInner);

        var newDivUser = document.createElement("div");
        newDivUser.innerHTML = userID;
        newDivInner.appendChild(newDivUser);

        var newIFrame = document.createElement("iframe")
        newIFrame.classList.add("t-video");

        // turns out you can't just embed the 
        // url directly as youtube block it
        // it needs to be in the form:
        //"https://www.youtube.com/embed/"+video_id

        // find video ID
        var video_id = msgWithoutID.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
        }

        //create embedded url
        newMsg = "https://www.youtube.com/embed/"+video_id
        
        // add to frame
        newIFrame.src = newMsg;
        newIFrame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        newDivInner.appendChild(newIFrame)

        return newDiv

    }else{

        var divReceiveMsg = document.createElement("div"); 
        //Add 2 css to div
        divReceiveMsg.classList.add("msg-area-disptext-response");
        divReceiveMsg.classList.add("speech-bubble-response");
        divReceiveMsg.innerHTML = msg;
        //return divReceiveMsg;

        return divReceiveMsg
    }






}
