if(!document.cookie)
{
  localStorage.setItem("response",JSON.stringify({ message : "You dont have access" ,statusCode : 404}));
  document.location.href = "/error.html"
}

function addDepartmentClicked() {
  fetch("forms/dept.html").then(response => {
      return response.text();
  }
  ).then(html => {
      document.getElementById("display-window").innerHTML = html;
  })
}

function addStudentClicked() {
  fetch("forms/student.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function addTeacherClicked() {
  fetch("forms/teacher.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function addAdminClicked() {
  fetch("forms/addadmin.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function addAdminClicked() {
  document.getElementById("display-window").innerHTML =
    "You Clicked assign HOD button";
}

function assignHODClicked() {
  fetch("forms/asghod.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}

function removeHODClicked() {
  fetch("forms/removehod.html").then(response => {
    return response.text();
}
).then(html => {
    document.getElementById("display-window").innerHTML = html;
})
}
