
function addDepartmentClicked() {
  fetch("forms/adminforms/adddepartment.html").then(response => {
      return response.text();
  }
  ).then(html => {
      document.getElementById("display-window").innerHTML = html;
  })
}

function addStudentClicked() {
  fetch("forms/adminforms/addstudent.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function addTeacherClicked() {
  fetch("forms/adminforms/addteacher.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function addAdminClicked() {
  fetch("forms/adminforms/addadmin.html").then(response => {
  return response.text();
}
).then(html => {
  document.getElementById("display-window").innerHTML = html;
})
}

function assignHODClicked() {
  fetch("forms/adminforms/asghod.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function removeHODClicked() {
  fetch("forms/adminforms/removehod.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}
