const { data } = JSON.parse(localStorage.getItem("response"));
const { designation, loggedInAdmin } = data;
const { name, uniqueId } = loggedInAdmin;
document.getElementById("name").innerText = name;
document.getElementById("designation").innerText = designation;
document.getElementById("uniqueId").innerText = uniqueId;

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
