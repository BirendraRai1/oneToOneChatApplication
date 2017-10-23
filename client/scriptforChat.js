$ (function(){

  var socket = io('/chat');

  var username = $('#user').val();
  var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
  var messageCount = 0; //counting total number of messages displayed.
  var oldInitDone = 0; //it is 0 when initialseOldChat is not executed and 1 if executed.
  var roomId;//variable for setting room.
  var toUser;

  //passing data on connection.
  socket.on('connect',function(){
    socket.emit('set-user-data',username);
    // setTimeout(function() { alert(username+" logged In"); }, 500);

    socket.on('broadcast',function(data){
      document.getElementById("hell0").innerHTML += '<li>'+ data.description +'</li>';
      $(function() {
          var wtf    = $('#hell0');
          var height = wtf[0].scrollHeight;
          wtf.scrollTop(height);
      });
    });

  });//end of connect event.



  //receiving onlineStack.
  socket.on('onlineStack',function(stack){
    $('#list').empty();
    var totalOnline = 0;
    for (var user in stack){
      //setting txt1. shows users button.
      if(user == username){
        var txt1 = $('<button></button>').text(user).css({"font-size":"18px"});
      }
      else{
        var txt1 = $('<button id="ubtn"></button>').text(user).css({"font-size":"18px"});
      }
      //setting txt2. shows online status.
      if(stack[user] == "Online"){
        totalOnline++;
        var txt2 = $('<span></span>').text(stack[user]).css({"color":"green","font-size":"18px"});

      }
      else{
        var txt2 = $('<span></span>').text(stack[user]).css({"color":"blue","font-size":"18px"});
      }
      //listing all users.
      $('#list').append($('<li>').append(txt1,txt2));
      $('#list').append($('<br>'));
      $('#totalOnline').text(totalOnline);
    }//end of for.
   $('#scrl1').scrollTop($('#scrl1').prop("scrollHeight"));
  }); //end of receiving onlineStack event.


  //on button click function.
  $(document).on("click","#ubtn",function(){

    //empty messages.
    $('#messages').empty();
    $('#typing').text("");
    messageCount = 0;
    noChat = 0;
    oldInitDone = 0;

    //assigning friends name to whom messages will send
    toUser = $(this).text();

    //showing and hiding relevant information.
    $('#frndName').text(toUser);
    $('#initMsg').hide();
    $('#chatForm').show(); //showing chat form.
    $('#sendBtn').hide(); //hiding send button to prevent sending of empty messages.

    //assigning two names for room. which helps in one-to-one chat.
      var currentRoom = username+"-"+toUser;
      var reverseRoom = toUser+"-"+username;
    

    //event to set room and join.
    socket.emit('initialseRoom',{firstRoom:currentRoom,secondRoom:reverseRoom});

  }); //end of on button click event.

  //event for setting roomId.
  socket.on('initialseRoom',function(room){
    //empty messages.
    $('#messages').empty();
    $('#typing').text("");
    messageCount = 0;
    noChat = 0;
    oldInitDone = 0;
    //assigning room id to roomId variable. which helps in one-to-one and group chat.
    roomId = room;
    console.log("roomId : "+roomId);
    //event to get chat history on button click or as room is set.
    socket.emit('initialseOldChat',{room:roomId,username:username,messageCount:messageCount});

  }); //end of initialseRoom event.

  //on scroll load more old-chats.
  $('#scrl2').scroll(function(){

    if($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
      $('#loading').show();
      socket.emit('old-chats',{room:roomId,username:username,messageCount:messageCount});
    }

  }); // end of scroll event.

  //listening old-chats event.
  socket.on('old-chats',function(data){

    if(data.room == roomId){
      oldInitDone = 1; //setting value to implies that old-chats first event is done.
      if(data.result.length != 0){
        $('#noChat').hide(); //hiding no more chats message.
        for (var i = 0;i < data.result.length;i++) {
          //styling of chat message.
          var chatDate = moment(data.result[i].createdOn).format("MMMM Do YYYY, hh:mm:ss a");
          var txt1 = $('<span></span>').text(data.result[i].sender+" : ").css({"color":"#006080"});
          var txt2 = $('<span></span>').text(chatDate).css({"float":"right","color":"#a6a6a6","font-size":"16px"});
          var txt3 = $('<p></p>').append(txt1,txt2);
          var txt4 = $('<p></p>').text(data.result[i].message).css({"color":"#000000"});
          //showing chat in chat box.
          $('#messages').prepend($('<li>').append(txt3,txt4));
          messageCount++;

        }//end of for.
        console.log(messageCount);
      }
      else {
        $('#noChat').show(); //displaying no more chats message.
        noChat = 1; //to prevent unnecessary scroll event.
      }
      //hiding loading bar.
      $('#loading').hide();

      //setting scrollbar position while first 5 chats loads.
      if(messageCount <= 5){
        $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
      }
    }//end of outer if.

  }); // end of listening old-chats event.

  // keyup handler.
  $('#myMsg').keyup(function(){
    if($('#myMsg').val()){
      $('#sendBtn').show(); //showing send button.
      socket.emit('typing');
    }
    else{
      $('#sendBtn').hide(); //hiding send button to prevent sending empty messages.
    }
  }); //end of keyup handler.

  //receiving typing message.
  socket.on('typing',function(message){
    var setTime;
    //clearing previous setTimeout function.
    clearTimeout(setTime);
    //showing typing message.
    $('#typing').text(message);
    //showing typing message only for few seconds.
    setTime = setTimeout(function(){
      $('#typing').text("");
    },3500);
  }); //end of typing event.

  //sending message.
  $('form').submit(function(){
    socket.emit('chat-message',{message:$('#myMsg').val(),receiver:toUser,date:Date.now()});
    $('#myMsg').val("");
    $('#sendBtn').hide();
    return false;
  }); //end of sending message.

  //receiving messages.
  socket.on('chat-message',function(data){
    //styling of chat message.
    var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");
    var txt1 = $('<span></span>').text(data.sender+" : ").css({"color":"#006080"});
    var txt2 = $('<span></span>').text(chatDate).css({"float":"right","color":"#a6a6a6","font-size":"16px"});
    var txt3 = $('<p></p>').append(txt1,txt2);
    var txt4 = $('<p></p>').text(data.message).css({"color":"#000000"});
    //showing chat in chat box.
    $('#messages').append($('<li>').append(txt3,txt4));
      messageCount++;
      console.log(messageCount);
      $('#typing').text("");
      $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
  }); //end of receiving messages.

  //on disconnect event.
  //passing data on connection.
  socket.on('disconnect',function(){


    //showing and hiding relevant information.
    $('#list').empty();
    $('#messages').empty();
    $('#typing').text("");
    $('#frndName').text("Disconnected..");
    $('#loading').hide();
    $('#noChat').hide();
    $('#initMsg').show().text("...Please, Refresh Your Page...");
    $('#chatForm').hide();
    messageCount = 0;
    noChat = 0;
  });//end of connect event.



});//end of function.