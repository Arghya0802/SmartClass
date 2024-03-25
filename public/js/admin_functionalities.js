let accessToken;
let refreshToken;
getCookie(document.cookie);
console.log(accessToken);

fetch("api/v1/admin/", {
  headers :
  {
    'Authorization': `Bearer ${accessToken}`,
  }
}).then(res => {
  return res.json()
})
.then(data => {
  const {admin} = data;
  document.getElementById("name").innerText = admin.name;
  document.getElementById("designation").innerText = "Admin";
  document.getElementById("uniqueId").innerText = admin.uniqueId;
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

    console.log(uniqueId);
    console.log(name);
    console.log(email);    
    console.log(password);
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
    console.log(uniqueId);
    const jsonObject = {
        uniqueId
    }
    fetch("/api/v1/admin/assign-hod", {
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

function removeHOD(){
    const uniqueId = document.getElementById("unique-id").value;
    document.getElementById("unique-id").value = "";
    console.log(uniqueId);
    const jsonObject = {
        uniqueId
    }
    fetch("/api/v1/admin/remove-hod", {
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

    console.log(uniqueId);
    console.log(departmentId);
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
    
    document.getElementById("department-id").value = "";
    document.getElementById("department").value = "";

    console.log(uniqueId);    
    console.log(name);
    const jsonObject = {
        uniqueId,
        name
    }
    fetch("/api/v1/admin/add-department", {
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


function addTeacher(){
    const uniqueId = document.getElementById("unique-id").value;
    const departmentId = document.getElementById("department").value;
    
    document.getElementById("unique-id").value = "";
    document.getElementById("department").value = "";

    console.log(uniqueId);
    console.log(departmentId);
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
        data.allAdmin.forEach(admin => {
          html += "<tr>";
          html += "<td>" + admin.name + "</td>";
          html += "<td>" + admin.uniqueId + "</td>";
          html += "<td><button onclick=\"removeAdmin('" + admin.uniqueId + "')\"> Remove </button></td>"
        });
        html += "</tr>";
        html +="</tbody>";
        html += "</table>";
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