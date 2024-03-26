function addSolutionClicked() {
  fetch("forms/studentforms/addsoltuion.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}
