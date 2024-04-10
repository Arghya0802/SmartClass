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

function addAssignmentClicked() {
  fetch("forms/teacherforms/addassignment.html").then(response => {
      return response.text();
  }
  ).then(html => {
      document.getElementById("display-window").innerHTML = html;
  })
}

function addResourceClicked() {
  fetch("forms/teacherforms/addresource.html").then(response => {
      return response.text();
  }
  ).then(html => {
      document.getElementById("display-window").innerHTML = html;
  })
}

function addNoticeClicked() {
  fetch("forms/hodforms/addnotice.html").then(response => {
      return response.text();
  }
  ).then(html => {
      document.getElementById("display-window").innerHTML = html;
  })
}