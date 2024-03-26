function assignSubjectToTeacherClicked() {
  fetch("forms/hodforms/assignSubjectTeacher.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
    });
}
