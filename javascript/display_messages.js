var id_private_message_area = "private-msg-area";
/**
 * Init page
 */
function init_render(){
	//Display logged in user name.
	login_user_name = localStorage.getItem("loggin_user_name");
	localStorage.removeItem("loggin_user_name");
	console.log("client name: ",login_user_name);
	var divLogginUser = document.getElementById("current_user_name");
	divLogginUser.innerText = login_user_name;
	
	var divPrivateMsgArea = document.querySelector('div.main-private-message');
	divPrivateMsgArea.style.display = 'none';
}

/**
 * Send message to current selected room
 */
function sendMessageToRoom() {
	var inpMsg = document.getElementById("inp-msg");
	var msg = inpMsg.value;
	if (msg.trim() != ""){
		if(active_private_id == null){
			var msg_obj = {"type": "normal", "text": null, "original_id":null}
			msg_obj.text = msg;
			var c_obj = find_comm_byRoom(active_room_name);
			c_obj.Silly.sendMessage(JSON.stringify(msg_obj));
			insert_new_msg(active_room_name,c_obj.Silly.userid,msg);
			displayMessageSend("msg-area",msg);
			//scrollToBottom("msg-area");
		}else{
			send_private_msg(active_private_id, msg);
			displayMessageSend(id_private_message_area, msg);
			//scrollToBottom("main-private-message", msg);
		}

		inpMsg.value = "";
		
	}
}


/**
 * Clear
 * 
 * @param historyMessages
 * @returns
 */
function displayMessageSend(displayArea, inpMsg){

   //divMsgSend = createDivSendMessage(inpMsg);
   //var targetDiv = document.getElementById(displayArea);
   //targetDiv.appendChild(divMsgSend);

   divMsgSend = createDivSendMessageWithYoutube(inpMsg);
   //document.getElementById("msg-area").appendChild(divMsgSend);
   var targetDiv = document.getElementById(displayArea);
   targetDiv.appendChild(divMsgSend);

   // Clear message after sending.
   inpMsg.value = "";
   // Scroll message to bottom
   scrollToBottom(displayArea);
}

/**
 * Clear all div under msg-area div.
 * Append all message in history message to div msg-area 
 * @param historyMessages
 * @returns
 */
function displayHistoryMessages(room_id){
    console.log("display history message");
   var divMsgArea = document.getElementById("msg-area");
   var c_obj = find_comm_byRoom(room_id);
   var myId  = c_obj.Silly.userid;
   // all of history messages 
	var room_obj = get_room_obj(room_id);
	if (room_obj != null) {
		for (var i = 0; i < room_obj.msg_list.length; i++) {
			//Check current user message and message owner ID.
			//If message in history sent by current user, the balloon message is green 
			//otherwise grey.
			if (room_obj.msg_list[i].user_id == myId) {
				// My message
				newDiv = createDivSendMessageWithYoutube(room_obj.msg_list[i].message);
			} else {
				// Other people's message
				newDiv = createDivReceiveMessageWithYoutube(room_obj.msg_list[i].user_id + ":"+room_obj.msg_list[i].message);
			}
			divMsgArea.appendChild(newDiv);
		}

		scrollToBottom("msg-area");
	} 
}

//function show_current_message(show_id,show_text){
//	if(currentActiveRoomName != ""){
//	   var divMsgArea = document.getElementById("msg-area");
//		// Other people's message
//		newDiv = createDivReceiveMessage(show_id+": "+show_text);
//		divMsgArea.appendChild(newDiv);
//		scrollToBottom("msg-area");
//	}
//}

function show_current_message(show_id,show_text){

		console.log("enter show_current_message");
	  	 var divMsgArea = document.getElementById("msg-area");
		// Other people's message
		var newDiv = createDivReceiveMessageWithYoutube(UserInfor[show_id]+": "+show_text);
		divMsgArea.appendChild(newDiv);
		scrollToBottom("msg-area");

}

function show_private_msg(show_id,show_text){

	console.log("enter show_current_message");
  	var divMsgArea = document.getElementById(id_private_message_area);
	// Other people's message
	var newDiv = createDivReceiveMessage(UserInfor[show_id]+": "+show_text);
	divMsgArea.appendChild(newDiv);
	scrollToBottom(id_private_message_area);

}

/**
 * Create new div element for respond 
 * @param msg
 * @returns
 */
function createDivReceiveMessage(msg){
	console.log(msg);
	   var divReceiveMsg = document.createElement("div"); 
	   //Add 2 css to div
	   divReceiveMsg.classList.add("msg-area-disptext-response");
	   divReceiveMsg.classList.add("speech-bubble-response");
	   divReceiveMsg.innerHTML = msg;
	   return divReceiveMsg;
}

/**
 * Create a div object for displaying send message by current client.
 * @param msg
 * @returns div object
 */
function createDivSendMessage(msg){
	   var newDiv = document.createElement("div"); 
	   newDiv.classList.add("msg-area-disptext-send");	
	   var newDivInner = document.createElement("div"); 
	   newDivInner.classList.add("speech-bubble-send");
	   newDivInner.innerHTML =  msg;
	   newDiv.appendChild(newDivInner);
	   return newDiv;

}

function createDivContact(roomName){
	//<div id="TESTROOM1" class="contact">TEST ROOM1</div>
	   var newDiv = document.createElement("div"); 
	   newDiv.id = roomName;	 
	   newDiv.classList.add("contact");
	   newDiv.innerText =  roomName;
	   return newDiv;
}

function createDivRoomUser(userId, userName){
	//<div class="contact_user">user1</div>

	   var newDiv = document.createElement("div"); 
	   newDiv.id = userId;	 
	   newDiv.classList.add("contact_user");
	   if(UserInfor[userId] == null){
		   userName = "Other App User";
	   }
	   newDiv.innerText = userName;
	   newDiv.addEventListener('click', switchActiveUser, false);
	   return newDiv;
}

/**
 * Create div for noticing user that user select to send private message.
 * @param userId
 * @param userName
 * @returns
 */
function createDivNoticeSelectPrivateMsg(){
	//<div class="contact_user">user1</div>
	   var newDiv = document.createElement("div");  
	   newDiv.classList.add("private_message_change_user_notice");
	   newDiv.innerText = "Now can send private message to "+UserInfor[active_private_id];
	   return newDiv;
}



/**
 * Scroll message area to bottom.
 */
function scrollToBottom(id){
   var div = document.getElementById(id);
   div.scrollTop = div.scrollHeight - div.clientHeight;
}

/**
 * Create a new room.
 */
function createRoom(){
	var inpCreateRoom = document.getElementById("inp_create_room");
	newRoomName = inpCreateRoom.value;
	if(newRoomName != ""){
		//When room is connect, on_connect is invoked and room list is refreshed.
		create_new_connection(newRoomName);		
		var contactDiv = document.getElementById("roomsGoHere");
		newDivContact = createDivContact(newRoomName);
		newDivContact.addEventListener('click', switchActiveContact, false);
		contactDiv.appendChild(newDivContact);
		// Clear text in input textbox.
		inpCreateRoom.value = "";
	}else{
		alert("Please enter room name");
	}
}

function enterChat(){
	var inpUsername = document.getElementById("inp_username");
	this.Silly.UserName = inpUsername.value
	window.location = "../html/index.html";
}

function removeAllChildrenElement(parentId){
	//Clean message in message area.
	var parentMsgArea = document.getElementById(parentId);
	while (parentMsgArea.firstChild){
		parentMsgArea.removeChild(parentMsgArea.firstChild);
	}
}

/**
 * Display users in a room
 * @param arrUsersIdName
 * @returns
 */
function show_user_list(clients_list){

    var divUserList = document.getElementById("user_list");
    // Remove all children element under "user_list" div.
    removeAllChildrenElement("user_list");
    // Add user in room.    
    for(var i = 0; i < clients_list.length; i++){
//  	  if(UserInfor[clients_list[i]] != null){
		console.log("---user_id:%s, user_name: %s", clients_list[i],UserInfor[clients_list[i]]);
		var divUser = createDivRoomUser(clients_list[i], UserInfor[clients_list[i]]);
		divUserList.appendChild(divUser);
//  	  }
	}
    
    if(active_private_id != null){
    	var divSelectedPrivateUser = document.getElementById(active_private_id);
    	divSelectedPrivateUser.classList.add("active");
    }
}



