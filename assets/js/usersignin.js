{
  //For showing the password
  var click = false;
  function eyesplash() {
    if (!click == true) {
      $("#password").attr("type", "text");
      $("#eye-splash2").toggleClass("fa-eye-slash fa-eye");
      click = true;
    } else {
      $("#password").attr("type", "password");
      $("#eye-splash2").toggleClass("fa-eye fa-eye-slash");
      click = false;
    }
  }
}
