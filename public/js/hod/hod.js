function assignSubjectToTeacherClicked() {
  fetch("forms/hodforms/assignSubjectTeacher.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}

function addSubjectClicked() {
  fetch("forms/hodforms/addSubject.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}