function addAssignmentClicked() {
  fetch("forms/teacherforms/addassignment.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}

function addResourceClicked() {
  fetch("forms/teacherforms/addresource.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}

function addAttendanceClicked() {
  fetch("forms/teacherforms/addattendance.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}
