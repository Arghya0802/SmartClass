let accessToken;
let refreshToken;
getCookie(document.cookie);
console.log(accessToken);

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
    if (data.success === false || data.designation!=="student") {
      localStorage.setItem(
        "response",
        JSON.stringify({ message: data.message, statusCode })
      );
      window.location.href = "/error/error.html";
    }
  });

fetch("api/v1/student/", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const { loggedInStudent } = data;
    document.getElementById("name").innerText = loggedInStudent.name;
    document.getElementById("designation").innerText = "Student";
    document.getElementById("uniqueId").innerText = loggedInStudent.uniqueId;

    // setTimeout(()=>{
    //     logout();
    // },data.session)
  });

// Backend Functionalities are starts here

function getAllSubjects() {
  let html = "";

  fetch("forms/studentforms/showsubjects.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/student/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // need to change after Backend changes
        data.loggedInTeacher.subjects.forEach((subject) => {
          html += "<tr>";
          html += "<td>" + subject.uniqueId + "</td>";
          html += "<td>" + subject.name + "</td>";
          html +=
            "<td><button onclick=\"getAllResources('" +
            subject.uniqueId +
            "')\"> Resources </button></td>";
          html +=
            "<td><button onclick=\"getAllAssignments('" +
            subject.uniqueId +
            "')\"> Assignments </button></td>";
          html += "</tr>";
        });
      }
      html += "</tbody>";
      html += "</table>";
      document.getElementById("display-window").innerHTML = html;
      document.getElementById("notification").innerText = data.message;
      if (data.success)
        document.getElementById("notification").style.color = "green";
      else document.getElementById("notification").style.color = "red";

      setTimeout(() => {
        document.getElementById("notification").innerText = "";
      }, 2000);
    });
}

function getAllAssignments(subjectId) {
  let html = "";

  fetch("forms/teacherforms/showassignments.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/assignment/" + subjectId, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.assignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html +=
            "<td><button onclick=\"addSolutions('" +
            assignment._id +
            "')\"> Solutions </button></td>";
          html += "</tr>";
        });
      }
      html += "</tbody>";
      html += "</table>";
      document.getElementById("display-window").innerHTML = html;
      document.getElementById("notification").innerText = data.message;
      if (data.success)
        document.getElementById("notification").style.color = "green";
      else document.getElementById("notification").style.color = "red";

      setTimeout(() => {
        document.getElementById("notification").innerText = "";
      }, 2000);
    });
}

function getAllResources(subjectId) {
  let html = "";

  fetch("forms/teacherforms/showresources.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/resource/" + subjectId, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.resources.forEach((resource) => {
          html += "<tr>";
          html += "<td>" + resource.chapter + "</td>";
          html += "<td>" + resource.link + "</td>";
          html += "</tr>";
        });
      }
      html += "</tbody>";
      html += "</table>";
      document.getElementById("display-window").innerHTML = html;
      document.getElementById("notification").innerText = data.message;
      if (data.success)
        document.getElementById("notification").style.color = "green";
      else document.getElementById("notification").style.color = "red";

      setTimeout(() => {
        document.getElementById("notification").innerText = "";
      }, 2000);
    });
}

function addSolution() {
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
