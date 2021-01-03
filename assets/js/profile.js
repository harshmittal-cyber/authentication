var form = document.getElementById("form");

var onclick = false;
function showform() {
  if (!onclick) {
    form.style.display = "block";
    onclick = true;
  } else {
    form.style.display = "none";
    onclick = false;
  }
}
