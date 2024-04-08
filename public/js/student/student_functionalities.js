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
    if (data.success === false || data.designation !== "student") {
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

  fetch("/api/v1/subject/department/all", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.subjects.forEach((subject) => {
          html += "<tr>";
          html += "<td>" + subject.uniqueId + "</td>";
          html += "<td>" + subject.teacherId + "</td>";
          html +=
            "<td><button onclick=\"getAllResources('" +
            subject.uniqueId +
            "', '" +
            subject.teacherId +
            "')\"> Resources </button></td>";
          html +=
            "<td><button onclick=\"getAllAssignments('" +
            subject.uniqueId +
            "', '" +
            subject.teacherId +
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

function getAllSubjectsforAssignment(assignmentType) {
  var html = "";

  fetch("forms/studentforms/showsubjectsforassignment.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/subject/department/all", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.subjects.forEach((subject) => {
          html += "<tr>";
          html += "<td>" + subject.uniqueId + "</td>";
          html += "<td>" + subject.teacherId + "</td>";

          if (assignmentType === "pending") {
            html +=
              "<td><button onclick=\"getAllPendingAssignments('" +
              subject.uniqueId +
              "', '" +
              subject.teacherId +
              "')\"> Assignments </button></td>";
          } else if (assignmentType === "submitted") {
            html +=
              "<td><button onclick=\"getAllSubmittedAssignments('" +
              subject.uniqueId +
              "', '" +
              subject.teacherId +
              "')\"> Assignments </button></td>";
          } else {
            html +=
              "<td><button onclick=\"getAllMissedAssignments('" +
              subject.uniqueId +
              "', '" +
              subject.teacherId +
              "')\"> Assignments </button></td>";
          }
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

function getAllSubjectsforResource() {
  let html = "";

  fetch("forms/studentforms/showsubjectsforresource.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/subject/department/all", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.subjects.forEach((subject) => {
          html += "<tr>";
          html += "<td>" + subject.uniqueId + "</td>";
          html += "<td>" + subject.teacherId + "</td>";
          html +=
            "<td><button onclick=\"getAllResources('" +
            subject.uniqueId +
            "', '" +
            subject.teacherId +
            "')\"> Resources </button></td>";
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

function getAllAssignments(subjectId, teacherId) {
  const jsonObject = {
    subjectId,
    teacherId,
  };
  let html = "";
  console.log(jsonObject);

  fetch("forms/studentforms/showassignments.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/assignment/all", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.activeAssignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html +=
            "<td><button onclick=\"addSolutionClicked('" +
            assignment._id +
            "')\"> Add Solution </button></td>";
          html += "</tr>";
        });
        data.nonActiveAssignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html += "<td>" + "</td>";
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

function getAllResources(subjectId, teacherId) {
  let jsonObject = {
    subjectId,
    teacherId,
  };
  console.log(jsonObject);
  let html = "";

  fetch("forms/studentforms/showresources.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/resource/all", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
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

function addSolutionClicked(assignmentId) {
  fetch("forms/studentforms/addSolution.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
      const addButton = document.getElementById("add-solution");
      addButton.addEventListener("click", function () {
        addSolution(assignmentId);
      });
    });
}

function addSolution(assignmentId) {
  const formData = new FormData();

  // Get the selected files
  const fileInput = document.getElementById("fileInput");
  const files = fileInput.files;

  // Append each file to the FormData
  for (const file of files) {
    console.log(file);
    formData.append("solutions", file);
  }

  fetch("/api/v1/solution/add/" + assignmentId, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        setTimeout(() => {
          getAllSubjects();
        }, 2000);
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 5000);
}

function sendFeedbackClicked() {
  let html = "";

  fetch("forms/studentforms/showsubjectsforfeedback.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/subject/department/all", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.subjects.forEach((subject) => {
          html += "<tr>";
          html += "<td>" + subject.uniqueId + "</td>";
          html += "<td>" + subject.teacherId + "</td>";
          html +=
            "<td><button onclick=\"sendFeedbackForm('" +
            subject.uniqueId +
            "', '" +
            subject.teacherId +
            "')\"> send feedback </button></td>";
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

function getAllPendingAssignments(subjectId, teacherId) {
  const jsonObject = {
    subjectId,
    teacherId,
  };
  let html = "";
  console.log(jsonObject);

  fetch("forms/studentforms/showassignments.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/student/assignments/pending", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.pendingAssignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html +=
            "<td><button onclick=\"addSolutionClicked('" +
            assignment._id +
            "')\"> Add Solution </button></td>";
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

function getAllSubmittedAssignments(subjectId, teacherId) {
  const jsonObject = {
    subjectId,
    teacherId,
  };
  let html = "";
  console.log(jsonObject);

  fetch("forms/studentforms/showsubmittedassignment.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/student/assignments/submitted", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.activeSubmittedAssignments.forEach((object) => {
          let { assignment, solution } = object;
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html += "<td>" + solution.link + "</td>";
          html +=
            "<td><button onclick=\"addSolutionClicked('" +
            assignment._id +
            "')\"> Add Solution </button></td>";
          html += "</tr>";
        });
        data.nonactiveSubmittedAssignments.forEach((object) => {
          let { assignment, solution } = object;
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + solution.marksObtained + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html += "<td>" + solution.link + "</td>";
          html += "<td>" + "</td>";
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

function getAllMissedAssignments(subjectId, teacherId) {
  const jsonObject = {
    subjectId,
    teacherId,
  };
  let html = "";
  console.log(jsonObject);

  fetch("forms/studentforms/showassignments.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/student/assignments/missed", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.missedAssignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html += "<td>" + assignment.link + "</td>";
          html += "<td>" + "</td>";
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

function sendFeedbackForm(subjectId, teacherId) {
  fetch("forms/studentforms/feedbackform.html")
    .then((response) => {
      return response.text();
    })
    .then((html) => {
      document.getElementById("display-window").innerHTML = html;
      const feedbackbutton = document.getElementById("feedback-button");
      feedbackbutton.addEventListener("click", function () {
        addFeedback(subjectId, teacherId);
      });
    });
}

function addFeedback(subjectId, teacherId) {
  const description = document.getElementById("description").value;

  document.getElementById("description").value = "";

  const jsonObject = {
    description,
    subjectId,
    teacherId,
  };
  fetch("/api/v1/student/submit-feedback", {
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
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        setTimeout(() => {
          sendFeedbackClicked();
        }, 2000);
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 2000);
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
