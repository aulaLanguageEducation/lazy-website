var login_user_name = "";
var active_room_name = null;
var active_private_id = null;
var communication_array = [];
var master_room_id = "MIIS_ROOM";
var server_addr = "tamats.com:55000";
var UserInfor = {};


window.onload = function(){  

	var comm_obj = new communication_class();
	comm_obj.Silly.roomid = master_room_id;
	active_room_name = master_room_id;
	comm_obj.Silly.connect(server_addr, master_room_id);
	communication_array.push(comm_obj);
	init_render();

}

//this class for connection with server. Each room should create a object and call connect
function communication_class()
{
	this.Silly = new SillyClient();

	this.Silly.on_connect = resp_on_connect;
	this.Silly.on_ready = resp_on_ready;
	this.Silly.on_room_info = resp_on_room_info;
	this.Silly.on_message = resp_on_message;
	this.Silly.on_user_connected = resp_on_user_connected;
	this.Silly.on_user_disconnected = resp_on_user_disconnected;
	this.Silly.on_close = resp_on_close;
	this.Silly.on_error = resp_on_error;
	
	this.Silly.roomid = null; //add roomid member to SillyClient instants object
	this.Silly.userid = null; //add userid member to SillyClient instants object
	this.Silly.master = 0; //add master member to SillyClient instants object
	
}




function create_new_connection(room_id)
{	
	var new_obj = new communication_class();
	new_obj.Silly.roomid = room_id;
	new_obj.Silly.connect(server_addr, room_id);
	communication_array.push(new_obj);

	return new_obj;
	
}


function get_communication_array()
{
	return communication_array;
}

function find_comm_byRoom(roomid)
{
	for(var i = 0; i < communication_array.length; i++){
		if(communication_array[i].Silly.roomid == roomid){
			return communication_array[i];
		}
	}

	return null;
	
}

//var myserver = new SillyClient();
//myserver.connect( "tamats.com:55000", "CHAT1");


//These variables and  classes are used to save history messages
var history_array = [];
function record_msg(user_id,message)
{
	this.user_id = user_id;
	this.message = message;
}
function room_record(room_n)
{
	this.room_id = room_n;
	this.msg_list = [];
}


/*tools function*/
//get room object from history_array
function get_room_obj(roomid)
{
	console.log("enter get_room_obj, roomid = %s", roomid);
	
	for(var i = 0; i < history_array.length; i++){
		console.log("history_array[i].room_id = %s",history_array[i].room_id)
		if(history_array[i].room_id == roomid){
			//console.log(history_array[i]);
			return history_array[i];
		}
	}
	return null;
}

//insert a new message into history_array
function insert_new_msg(roomid,author_id,msg)
{
	var room_obj = null;
	//find  room object
	room_obj = get_room_obj(roomid);
	
	//not find then  create
	if(room_obj == null){
		room_obj = new room_record(roomid);
		history_array.push(room_obj);
	}
	
	//create a record
	var new_record=new record_msg(author_id,msg);
	room_obj.msg_list.push(new_record);
	
}

//check whether user_id is master(smallest) in user_list
//type of user_id is number, user_list is a number array 
function check_master_user(user_id,user_list)
{
	// todo
	//console.log("typeof(user_id) = %s",typeof(user_id))
	for(var i = 0; i < user_list.length; i++){
		//console.log("user_id = %d, user_list[i]=%d",user_id,user_list[i]);
		if(user_list[i] < user_id){
			return 0;
		}
	}
	// no one smaller than user_id, user_id is masters
	return 1;
}

/*Following  fucntion is callback function*/
function resp_on_connect(){
	console.log("connect to "+server_addr); 
	//connected
	
};

var g_save_room = "";
function trigger_room_infor(S_obj)
{

	g_save_room = S_obj.roomid; 
	S_obj.getRoomInfo( S_obj.roomid, function(room_info) {
		console.log("inner getRoomInfo callback function: ") ;
		console.log(room_info);
		//console.log(JSON.stringify(room_info)) ;

		//show user list
		show_user_list(room_info.clients);

		
		//check Whether I will be master user;
		var c_obj = find_comm_byRoom(g_save_room);
		if(c_obj != null){
			c_obj.Silly.master = check_master_user(parseInt(c_obj.Silly.userid),room_info.clients);
		}
		else{
			console.log("problem: c_obj is null");
		}
		
	} );
}


function update_user_list(room_id)
{
	var c_obj = find_comm_byRoom(room_id);
	if(c_obj!= null){
		trigger_room_infor(c_obj.Silly);
	}
	else{
		console.log("update_user_list, problem: c_obj is null");
	}
}

function update_room_list(S_obj)
{


	//get report
	// in the function get all room info and to call the show function
	console.log("enter update_room_list");
	S_obj.getReport( function(report) {
		//show the room list
		//call the show room functon
		console.log(report);
		//console.log(JSON.stringify(report));
		show_room(report.rooms);

		
	} );


}



function send_private_msg(userID, msg_content)
{
	var c_obj = find_comm_byRoom(master_room_id);
	if(c_obj != null){
		var msg_obj = {"type": "private", "text": null};
		msg_obj.text = msg_content;
		
		c_obj.Silly.sendMessage(JSON.stringify(msg_obj), userID);
	}
	else{
		console.log("send_private_msg,problem: c_obj is null");
	}
	
}
	
function send_trigger_room_infor()
{	console.log(" enter send_trigger_room_infor");
	var c_obj = find_comm_byRoom(master_room_id);
	if(c_obj != null){
		var msg_obj = {"type": "trigger"};
		console.log(" enter send_trigger_room_infor2");
		c_obj.Silly.sendMessage(JSON.stringify(msg_obj));
	}
	else{
		console.log("send_trigger_room_infor,problem: c_obj is null");
	}
}

//this method is called when the server gives the user his ID (ready to start transmiting)
function resp_on_ready(id){
  //user has an ID
  	console.log("user id is %s",id); 
  	this.userid = id;

	console.log("typeof(this.userid) = %s",typeof(this.userid))

	console.log("this.userid = %d",this.userid)

	if(this.roomid == master_room_id){
		//get report
		// in the function get all room info and to call the show function
		update_room_list(this);

	}

	UserInfor[id] = login_user_name;
	//send username infor to the chatroom
	var msg_obj = {"type": "user_infor", "user_id": null, "user_name":null};
	msg_obj.user_id = id;
	msg_obj.user_name = login_user_name;
	this.sendMessage(JSON.stringify(msg_obj));
	
	setTimeout(active_room_display,250,active_room_name);
	if(active_room_name != null){
		setTimeout(trigger_room_infor,200,this);
	}
	setTimeout(trigger_room_infor,280,this);
	//this.getRoomInfo( this.roomid, function(room_info) {console.log("inner getRoomInfo callback function ") ;console.log(JSON.stringify(room_info)) ;} );
	
	
};

//this method is called when we receive the info about the current state of the room (clients connected)
function resp_on_room_info(info){
  	//to know which users are inside
  	console.log("on_room_info is %s",JSON.stringify(info)); 
		
	this.master = check_master_user(parseInt(this.userid),info.clients);
	console.log("master is %d",this.master);
  
};


//this methods receives messages from other users (author_id is an unique identifier per user)
function resp_on_message( author_id, msg ){
	  //data received
	  var str = "";
	  var show_text = "";
	  var show_id = "";
	  
	  console.log("author_id id is %s,said :",author_id,msg); 
	  var  msg_obj = JSON.parse(msg);
	  if("normal" == msg_obj.type){
	  	show_id = author_id;
		show_text = msg_obj.text;

		insert_new_msg(this.roomid, show_id,show_text);
	 	// console.log("this.roomid %s, active_room_name = %s", this.roomid,active_room_name)
	  	if(this.roomid == active_room_name){
	  		console.log("show : %s",show_text);
	  		show_current_message(show_id,show_text);
	  	}
	  }
	  else if("history" == msg_obj.type){
		show_id = msg_obj.original_id;
		show_text = msg_obj.text;
		
		 insert_new_msg(this.roomid, show_id,show_text);
		 // console.log("this.roomid %s, active_room_name = %s", this.roomid,active_room_name)
		 if(this.roomid == active_room_name){
		  	console.log("show : %s",show_text);
		  	show_current_message(show_id,show_text);
		}
	  }
	  else if("user_infor" == msg_obj.type){
	  	//save user name infor
	  	if(UserInfor[msg_obj.user_id] == null){
			UserInfor[msg_obj.user_id] = msg_obj.user_name;
		}
		return;
	  }
	  else if("private" == msg_obj.type){
	  	
	  	show_private_msg(author_id,msg_obj.text)
	  }
	  else if("trigger" == msg_obj.type){
		  console.log(" test 3");
	  	update_room_list(this);
	  }
	  	
	 
}

function send_history(S_obj,user_id)
{

	
	//send all of history messages to the new user_id
	var room_obj = get_room_obj(S_obj.roomid);
	if(room_obj != null){
		console.log("room_obj != null")
		for(var i=0; i<room_obj.msg_list.length; i++){
			var msg_obj = {"type": "history", "text": null, "original_id":null}
			msg_obj.text = room_obj.msg_list[i].message;
			msg_obj.original_id = room_obj.msg_list[i].user_id;
			S_obj.sendMessage(JSON.stringify(msg_obj), user_id);
			console.log("send %s history: %s ", user_id,JSON.stringify(msg_obj));
		}
	}

}

//this methods is called when a new user is connected when you in the room 
function resp_on_user_connected( user_id ){
	//new user!
	  console.log("new user %s enter",user_id); 

	setTimeout(update_room_list, 200,this);
	setTimeout(trigger_room_infor,300,this);


	if(this.master == 1){
		//send user_infor
		for(var id_key in UserInfor){
			var user_msg_obj = {"type": "user_infor", "user_id": null, "user_name":null};
			user_msg_obj.user_id = id_key;
			user_msg_obj.user_name = UserInfor[id_key];
			this.sendMessage(JSON.stringify(user_msg_obj), user_id);
			console.log("send %s userInfor: %s ", user_id,JSON.stringify(user_msg_obj));
			
		}
		
		setTimeout(send_history,400,this,user_id);
	}
	
}

//this methods is called when a user leaves the room
function resp_on_user_disconnected( user_id ){
	//user is gone
	 console.log(" user %d leaver",user_id); 
	//update master user in room when a user leave room
	//this.getRoomInfo( this.roomid, function(room_info) {console.log("inner getRoomInfo callback function ") ;} );
	trigger_room_infor(this);
}

//this methods is called when the server gets closed (it shutdowns)
function resp_on_close(){
  //server closed
};

//this method is called when coulndt connect to the server
function resp_on_error(err){
};
