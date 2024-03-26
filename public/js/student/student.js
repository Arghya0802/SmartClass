function addSolutionClicked() {
  fetch("forms/studentforms/addSolution.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}
