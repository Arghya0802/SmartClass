
const { data } = JSON.parse(localStorage.getItem("response"));
localStorage.removeItem("response");

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

// Need Changes

function getAllAdmin() {
  let html = ' ';
  fetch("forms/showadmins.html").then(response => {
    return response.text();
  }
  ).then(initialhtml => {
    html += initialhtml;
  })
  fetch("/api/v1/admin/get-admin").then(response => response.json()).then(data => {
    if(data.success)
    {
      data.allAdmin.forEach(admin => {
        html += "<p>" + admin.name + " " + admin.uniqueId + " <button onclick=\"removeAdmin('" + admin.uniqueId + "')\"> Remove </button> </p>";
      });
      document.getElementById("display-window").innerHTML = html;
    }
  })
}

// Need Changes

// Need Changes

function removeAdmin(objectId)
{
  console.log(objectId)
  fetch("/api/v1/admin/remove-admin",{
    method : "DELETE",
    headers : {
      'Content-Type': 'application/json',
  },
  body : JSON.stringify({objectId})
  }).then(res => res.json())
  .then(data => {
    if(data.success)
    {
      getAllAdmin();
    }
  })
}

// Need Changes