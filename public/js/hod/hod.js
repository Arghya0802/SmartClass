function assignSubjectToTeacherClicked() {
  fetch("forms/hodforms/assignsubjecttoteacher.html")
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
