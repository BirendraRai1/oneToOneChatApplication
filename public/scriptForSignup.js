//code for checking unique username and email.
// also for verifying deatils.
$(function(){

  var socket = io('/signup');

  var userflag = emailflag = passwordflag = 0;

  //to check for unique username.
  $('#username').keyup(function(){
    var username = $('#username').val();
      socket.emit('checkUserName',username);
      socket.on('checkUserName1',function(data){
        if(data == 1){
          userflag = 1;
          $('#ik').show();
          $('#ir').hide();
          $('#error1').hide();
        }
        else{
          userflag = 0;
          $('#ik').hide();
          $('#ir').show();
          $('#error1').show().text("Username Already Exists. Please, Change.");
        }
      });
  });//end of check for unique username.

  //checking for email.
  $('#email').keyup(function(){

    var email = $('#email').val();
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos+2 || dotpos+2 >= email.length){
      emailflag = 0;
      $('#ik1').hide();
      $('#ir1').show();
      $('#error1').show().text("Please Enter Valid Email.");
    }
    else{
      socket.emit('checkEmail',email);
      socket.on('checkEmail',function(data){
        if(data == 1){
          emailflag = 1;
          $('#ik1').show();
          $('#ir1').hide();
          $('#error1').hide();
        }
        else{
          emailflag = 0;
          $('#ik1').hide();
          $('#ir1').show();
          $('#error1').show().text("Email Already Exists. Please, Change.");
        }
      });
    }
  }); //end of checking for email.

  //checking password.
  $('#password').keyup(function(){
    var pass = $('#password').val();
    if(pass.length < 5){
      passwordflag = 0;
      $('#ik2').hide();
      $('#ir2').show();
      $('#error1').show().text("Password Should Have Atleast 5 Characters.");
    }
    else{
      passwordflag = 1;
      $('#ik2').show();
      $('#ir2').hide();
      $('#error1').hide();
    }
  }); //end of checking password.

  //on form submit code.
  $('form').submit(function(){
    //validate action.
    if(userflag == 1 && emailflag == 1 && passwordflag == 1){
      return true;
    }
    else{
      $('#error1').show().text("Input Is Incorrect. Please, Change.");
      return false;
    }
  });

});//end of function.