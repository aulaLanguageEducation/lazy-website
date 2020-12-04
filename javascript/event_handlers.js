//var currentActiveRoomName = "";

/* ==================================================*/
/* ========= INPUT BUTTON EVENT HANDLER =============*/
/* ==================================================*/

/**
* Bind keypress event to input message.
* It handles event when user press "Enter" button.
*/
document.querySelector('#inp-msg').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
    	//Send message to current room.
    	if(window.active_room_name != ""){
    		sendMessageToRoom();
    	}else{
    		alert("Please select contact/room.");
    	}
    }
});

/**
 * Bind even "Click" to button "Send".
 */
//var btnSend = document.getElementById("btn_send");
//btnSend.addEventListener('click', function (e) {
	//console.log("send pressed")
	//Send message to current room.
//  	if(currentActiveRoomName != ""){
//		sendMessageToRoom();
//	}else{
//		alert("Please select contact/room.");
//	}
//});

var btnSend = document.getElementById("btn_send");
btnSend.addEventListener('click', function (e) {
	//console.log("send pressed")
	//Send message to current room.
	sendMessageToRoom();

});



var btnCreateRoom = document.getElementById("btn_create_room");
btnCreateRoom.addEventListener('click', function (e) {
	//Send message to current room.
	createRoom();
	setTimeout(send_trigger_room_infor,200);
});

document.querySelector('#inp_create_room').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
    	//Create a new room when user press enter at input room name.
    	createRoom();
    	setTimeout(send_trigger_room_infor,200);
    }
});

/* ===================================================*/
/* ========= CONTACT BUTTON EVENT HANDLERS ===========*/
/* ===================================================*/
/**
 * Bind events to all child-elements inside div.main-left (current active room button)
 */
var parentContactDiv = document.querySelector('div.main-left');
for (var i = 0; i < parentContactDiv.children.length; i++) {
    var childElement = parentContactDiv.children[i];
    childElement.addEventListener('click', switchActiveContact, false);
}


function active_room_display(roomid)
{
	var roomElem = document.getElementById(roomid);

	if(roomElem != null){
		//set_active_room(roomid)
		active_room_name = roomid;
		// Clear all .active class
		var parent = document.querySelector('div.main-left');
		for (var i = 0; i < parent.children.length; i++) {
			var child = parent.children[i];
			child.classList.remove("active");
		}

		roomElem.classList.add("active");

		    //Clean message in message area.
		   var parentMsgArea = document.getElementById("msg-area");
		    while (parentMsgArea.firstChild){
			  parentMsgArea.removeChild(parentMsgArea.firstChild);
		   }

			console.log("enter to room: "+roomid);
		}
}


function switchActiveContact(e) {
	active_private_id = null;
	var element = e.target;
	// Get room name from element ID
	var roomName = e.target.id;
	// Change active room to selected room.
	//currentActiveRoomName = roomName;
	active_room_name = roomName;
	// Clear all .active class
	var parent = document.querySelector('div.main-left');
	for (var i = 0; i < parent.children.length; i++) {
		var child = parent.children[i];
		child.classList.remove("active");
	}
	e.target.classList.add("active");
	
	//Clear all .active class in user list
	var parentUserList = document.getElementById("user_list");
	for (var i = 0; i < parentUserList.children.length; i++) {
		var child = parentUserList.children[i];
		child.classList.remove("active");
	}
    
	//Clean message in message area.
	var parentMsgArea = document.getElementById("msg-area");
	while (parentMsgArea.firstChild){
		parentMsgArea.removeChild(parentMsgArea.firstChild);
	}

	console.log("enter to room: "+roomName);
	// find or create connection
	var c_obj = find_comm_byRoom(roomName);
	if(c_obj == null){
		create_new_connection(roomName);

		
	}
	else{
		displayHistoryMessages(roomName);  
		
	}
	
    var labelSelectedRoom = document.getElementById("label_selected_room");
    labelSelectedRoom.innerText = "Member in " + roomName;
    
    update_user_list(roomName);
	switchDivArea("room");
}


function switchActiveUser(e) {
	var element = e.target;
	// Get user id from element ID
	var userId = e.target.id;
	active_private_id = userId;
	console.log(active_private_id);
	// Clear all .active class in user list
	var parentUserList = document.getElementById("user_list");
	for (var i = 0; i < parentUserList.children.length; i++) {
		var child = parentUserList.children[i];
		child.classList.remove("active");
	}
	//Set active private message user.
	e.target.classList.add("active");
    
	//Inactive the active room
	var parent = document.querySelector('div.main-left');
	for (var i = 0; i < parent.children.length; i++) {
		var child = parent.children[i];
		child.classList.remove("active");
	}

	console.log("private chat to user id: "+userId);
	switchDivArea("user");
	//Append message to private message area.
	var divTextSelectUser = createDivNoticeSelectPrivateMsg();
	var divMsgArea = document.getElementById(id_private_message_area);
	divMsgArea.appendChild(divTextSelectUser);
}

/**
 * Clear css named "active" from previous active room to make it inactive
 * and add "active" to current selected button.
 */
function switchDivArea(target){

	var divPrivateMsgArea = document.querySelector('div.main-private-message');
	var divMsgArea = document.getElementById("msg-area");
	if(target == "room"){
		divPrivateMsgArea.style.display = 'none';
		divMsgArea.style.display = 'block';
		active_private_id = null;
	}else{
		divPrivateMsgArea.style.display = 'block';
		divMsgArea.style.display = 'none';
	}
}