
function addAssignmentClicked() {
  fetch("forms/teacherforms/addassignment.html").then(response => {
      return response.text();
  }
  ).then(html => {
      document.getElementById("display-window").innerHTML = html;
  })
}