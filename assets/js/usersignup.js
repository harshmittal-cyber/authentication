{
  //if user focus on password input then show password instructions
  function passinfo() {
    $("#message").css("display", "block");
  }
  //if user click outside the input field then disappear the message
  function blurinfo() {
    $("#message").css("display", "none");
  }

  //for password field
  var click = false;
  function eyesplash() {
    if (!click == true) {
      $("#password").attr("type", "text");
      $("#eye-splash").toggleClass("fa-eye-slash fa-eye");
      click = true;
    } else {
      $("#password").attr("type", "password");
      $("#eye-splash").toggleClass("fa-eye fa-eye-slash");
      click = false;
    }
  }

  //for confirm password field
  var click1 = false;
  function eyesplash1() {
    if (!click1 == true) {
      $("#confirm_password").attr("type", "text");
      $("#eye-splash1").toggleClass("fa-eye-slash fa-eye");
      click1 = true;
    } else {
      $("#confirm_password").attr("type", "password");
      $("#eye-splash1").toggleClass("fa-eye fa-eye-slash");
      click1 = false;
    }
  }
}
