let accessToken;
let refreshToken;
getCookie(document.cookie);
console.log(accessToken);
let teacherId;

if (!accessToken) {
  localStorage.setItem(
    "response",
    JSON.stringify({ message: "Unauthorized Access", statusCode: 404 })
  );
  document.location.href = "/error/error.html";
}

var statusCode;

fetch("api/v1/auth/verify", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((res) => {
    statusCode = res.status;
    return res.json();
  })
  .then((data) => {
    if (data.success === false || data.designation!=="teacher") {
      localStorage.setItem(
        "response",
        JSON.stringify({ message: data.message, statusCode })
      );
      window.location.href = "/error/error.html";
    }
  });

fetch("api/v1/teacher/", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const { loggedInTeacher } = data;
    document.getElementById("name").innerText = loggedInTeacher.name;
    document.getElementById("designation").innerText = loggedInTeacher.designation;
    document.getElementById("uniqueId").innerText = loggedInTeacher.uniqueId;
    teacherId = loggedInTeacher.uniqueId;

    // setTimeout(()=>{
    //     logout();
    // },data.session)
  });

// Backend Functionalities are starts here

function addAssignment() {
  //Testing functionality
  document.getElementById("notification").innerText =
    "Hi there You have clicked Add";
}

function addResource() {
  const subjectId = document.getElementById("subject-id").value;
  const title = document.getElementById("title").value;

  document.getElementById("subject-id").value = "";
  document.getElementById("title").value = "";

  const jsonObject = {
    subjectId,
    title,
  };
  fetch("/api/v1/teacher/resources/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(jsonObject),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success)
        document.getElementById("notification").style.color = "green";
      else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 2000);
}


function getAllResources(teacherId) {

  let html = "";

  fetch("forms/teacherforms/showresources.html").then(response => {
    return response.text();
  }
  ).then(data => {
    html = data;
  })

  fetch("/api/v1/resource/"+teacherId,{
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      }
  })
  .then(response => response.json())
  .then(data => {
    if(data.success)
    {
      data.resources.forEach(resource => {
        html += "<tr>";
        html += "<td>" + resource.name + "</td>";
        html += "<td>" + resource.name + "</td>";
        html += "<td><button onclick=\"removeResource('" + resource._id + "')\"> Remove </button></td>"
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


function removeResource(resourceId)
{
  console.log(resourceId)
  fetch("/api/v1/resource/remove-resource",{
    method : "DELETE",
    headers : {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
  },
  body : JSON.stringify({resourceId})
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


// Backend Functionalities ends here

function logout() {
  fetch("/api/v1/auth/logout", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) document.location.href = "/";
      else {
        document.getElementById("notification").innerText = data.message;
        setTimeout(() => {
          document.getElementById("notification").innerText = "";
        }, 2000);
      }
    });
}

function getCookie(allCookies) {
  const cookieArray = allCookies.split(";");
  const cookieObject = {};
  cookieArray.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieObject[name] = value;
  });

  accessToken = cookieObject["accessToken"];
  refreshToken = cookieObject["refreshToken"];
}
