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
    if (data.success === false || data.designation !== "teacher") {
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
    document.getElementById("designation").innerText =
      loggedInTeacher.designation;
    document.getElementById("uniqueId").innerText = loggedInTeacher.uniqueId;

    // setTimeout(()=>{
    //     logout();
    // },data.session)
  });

// Backend Functionalities are starts here

function addAssignment() {
  const subjectId = document.getElementById("subject-id").value;
  const fullMarks = document.getElementById("full-marks").value;
  const link = document.getElementById("link").value;

  document.getElementById("subject-id").value = "";
  document.getElementById("full-marks").value = "";
  document.getElementById("link").value = "";

  const jsonObject = {
    subjectId,
    fullMarks,
    link,
  };
  fetch("/api/v1/assignment/add", {
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

function addResource() {
  const subjectId = document.getElementById("subject-id").value;
  const topic = document.getElementById("title").value;
  const link = document.getElementById("link").value;

  document.getElementById("subject-id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("link").value = "";

  const jsonObject = {
    subjectId,
    topic,
    link,
  };
  fetch("/api/v1/resource/add", {
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

function getAllSubjects() {
  let html = "";

  fetch("forms/teacherforms/showsubjects.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/subject/teacher/all", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }) 
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.subjects.forEach((subject) => {
          html += "<tr>";
          html += "<td>" + subject.name + "</td>";
          html += "<td>" + subject.uniqueId + "</td>";
          html +=
            "<td><button onclick=\"getAllResources('" +
            subject +
            "')\"> Resources </button></td>";
          html +=
            "<td><button onclick=\"getAllAssignments('" +
            subject +
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

function getAllResources(subjectId) {
  let html = "";

  fetch("forms/teacherforms/showresources.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/resource/all" + subjectId, {
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
          html += "<td>" + resource.topic + "</td>";
          html += "<td>" + resource.link + "</td>";
          html +=
            "<td><button onclick=\"removeResource('" +
            resource._id +
            "', '" +
            subjectId +
            "')\"> Remove </button></td>";
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

function removeResource(resourceId, subjectId) {
  fetch("/api/v1/resource/remove", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resourceId }), // ObjectId
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        getAllResources(subjectId);
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 2000);
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

  // SubjectId --> ObjectId in Params
  fetch("/api/v1/assignment/all" + subjectId, {
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
            "<td><button onclick=\"getAllSolutions('" +
            assignment._id +
            "')\"> Solutions </button></td>";
          html +=
            "<td><button onclick=\"removeAssignment('" +
            assignment._id +
            "', '" +
            subjectId +
            "')\"> Remove </button></td>";
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

// AssignmentId --> ObjectId in Body
function removeAssignment(assignmentId, subjectId) {
  fetch("/api/v1/assignment/remove", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignmentId }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        getAllAssignments(subjectId);
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 2000);
}

function getAllSolutions(assignmentId) {
  let html = "";

  fetch("forms/teacherforms/showsolutions.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  // AssignmentId --> ObjectId in Params
  fetch("/api/v1/solution/all/" + assignmentId, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.solutions.forEach((solution) => {
          html += "<tr>";
          html += "<td>" + solution.studentId + "</td>";
          html += "<td>" + solution.link + "</td>";
          html += "<td>" + solution.marksObtained + "</td>";
          html += "<td>" + solution.fullMarks + "</td>";

          let str = "Edit Marks";
          if (solution.marksObtained) str = "Add Marks";

          html +=
            "<td><button onclick=\"addMarks('" +
            solution._id +
            "', '" +
            assignmentId +
            "')\"> " +
            str +
            " </button></td>";
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

function addMarks(solutionId){
  
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
