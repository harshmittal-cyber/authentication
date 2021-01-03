{
  function editbtn() {
    $("#account").hide();
    $("#form").show();
    $("#img").css("cursor", "pointer");
    $("#img").click(function () {
      $("#image").click();
    });
  }

  function go() {
    $("#account").show();
    $("#form").hide();
    $("#img").css("cursor", "default");
    $("#img").off("click");
  }
}
