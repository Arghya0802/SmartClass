let accessToken;
let refreshToken;
getCookie(document.cookie);
console.log(accessToken);

if(!accessToken)
{
  localStorage.setItem("response",JSON.stringify({ message : "Unauthorized Access" ,statusCode : 404}));
  document.location.href = "/error/error.html"
}

var statusCode;

fetch("api/v1/auth/verify",{
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
})
.then( res => {
  statusCode = res.status;
  return res.json();
})
.then(data => {
  if(data.success === false)
  {
    localStorage.setItem("response",JSON.stringify({ message : data.message ,statusCode}));
    window.location.href = "/error/error.html"
  }
})

fetch("api/v1/admin/", {
  headers :
  {
    'Authorization': `Bearer ${accessToken}`,
  }
}).then(res => {
  return res.json()
})
.then(data => {
  const {loggedInAdmin} = data;
  document.getElementById("name").innerText = loggedInAdmin.name;
  document.getElementById("designation").innerText = "Admin";
  document.getElementById("uniqueId").innerText = loggedInAdmin.uniqueId;
})

function addAdmin(){
    const uniqueId = document.getElementById("unique-id").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email-id").value;
    const password = document.getElementById("password").value;
    
    document.getElementById("unique-id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email-id").value = "";
    document.getElementById("password").value = "";

    const jsonObject = {
        uniqueId,
        name,
        email,
        password
    }
    fetch("/api/v1/admin/add-admin", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}


function assignHOD(){
    const uniqueId = document.getElementById("unique-id").value;
    document.getElementById("unique-id").value = "";

    const jsonObject = {
        uniqueId
    }
    console.log(jsonObject);

    fetch("api/v1/admin/assign-hod", {
        method : 'PATCH',
        headers : {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}

function removeHOD(){
    const uniqueId = document.getElementById("unique-id").value;
    document.getElementById("unique-id").value = "";

    const jsonObject = {
        uniqueId
    }
    fetch("api/v1/admin/remove-hod", {
        method : 'PATCH',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}


function addStudent(){
    const uniqueId = document.getElementById("unique-id").value;
    const departmentId = document.getElementById("department").value;

    document.getElementById("unique-id").value = "";
    document.getElementById("department").value = "";

    const jsonObject = {
        uniqueId,
        departmentId
    }
    fetch("/api/v1/admin/add-student", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)

}


function addDepartment(){
    const uniqueId = document.getElementById("department-id").value;
    const name = document.getElementById("department").value;

    console.log(uniqueId);
    console.log(name);
    
    document.getElementById("department-id").value = "";
    document.getElementById("department").value = "";

    const jsonObject = {
        uniqueId,
        name
    }

    console.log(jsonObject);

    fetch("/api/v1/admin/add-department", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        console.log(data);
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}


function addTeacher(){
    const uniqueId = document.getElementById("unique-id").value;
    const departmentId = document.getElementById("department").value;
    
    document.getElementById("unique-id").value = "";
    document.getElementById("department").value = "";

    const jsonObject = {
        uniqueId,
        departmentId
    }
    fetch("/api/v1/admin/add-teacher", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}

function getAllAdmin() {

    let html = "";
  
    fetch("forms/showadmins.html").then(response => {
      return response.text();
    }
    ).then(data => {
      html = data;
    })
  
    fetch("/api/v1/admin/all-admins",{
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
      if(data.success)
      {
        data.admins.forEach(admin => {
          html += "<tr>";
          html += "<td>" + admin.name + "</td>";
          html += "<td>" + admin.uniqueId + "</td>";
          html += "<td><button onclick=\"removeAdmin('" + admin._id + "')\"> Remove </button></td>"
          html += "</tr>";
        });
      }
      html +="</tbody>";
      html += "</table>";
      document.getElementById("display-window").innerHTML = html;
      document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";

        setTimeout(() => {
        document.getElementById("notification").innerText = "";
        },2000)
    })
  }
  
  function removeAdmin(adminId)
  {
    console.log(adminId)
    fetch("/api/v1/admin/remove-admin",{
      method : "DELETE",
      headers : {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    },
    body : JSON.stringify({adminId})
    }).then(res => res.json())
    .then(data => {
        document.getElementById("notification").innerText = data.message;
      if(data.success)
      {
        document.getElementById("notification").style.color = "green";
        getAllAdmin();
      }
      else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
        },2000)
  }


  function logout()
  {
    fetch("/api/v1/auth/logout", {
        headers : {
            'Authorization': `Bearer ${accessToken}`,
        },
    }).then(res => res.json())
    .then(data => {
        if(data.success)
        document.location.href = "/";
        else
        {
            document.getElementById("notification").innerText = data.message;
            setTimeout(() => {
            document.getElementById("notification").innerText = "";
            },2000)
        }
    })
  }

  function getCookie(allCookies)
  {
      const cookieArray = allCookies.split(';');
      const cookieObject = {};
      cookieArray.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookieObject[name] = value;
  });

    accessToken = cookieObject['accessToken'];
    refreshToken = cookieObject['refreshToken'];
  
  }