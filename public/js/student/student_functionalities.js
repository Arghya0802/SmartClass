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
          html +=
            "<td>" +
            (subject.teacherId
              ? subject.teacherId
              : "No Teacher assigned yet") +
            "</td>";
          html +=
            "<td>" +
            (subject.teacherId
              ? "<button onclick=\"getAllResources('" +
                subject.uniqueId +
                "', '" +
                subject.teacherId +
                "')\"> Resources </button>"
              : "") +
            "</td>";
          html +=
            "<td>" +
            (subject.teacherId
              ? "<button onclick=\"getAllAssignments('" +
                subject.uniqueId +
                "', '" +
                subject.teacherId +
                "')\"> Assignments </button>"
              : "") +
            "</td>";
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
          html +=
            "<td>" +
            (subject.teacherId
              ? subject.teacherId
              : "No Teacher assigned yet") +
            "</td>";

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
          html +=
            "<td>" +
            (subject.teacherId
              ? subject.teacherId
              : "No Teacher assigned yet") +
            "</td>";
          html +=
            "<td>" +
            (subject.teacherId
              ? "<button onclick=\"getAllResources('" +
                subject.uniqueId +
                "', '" +
                subject.teacherId +
                "')\"> Resources </button>"
              : "") +
            "</td>";
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
          html +=
            '<td> <a href="' +
            assignment.link +
            '" target="_blank"> Link </a></td>';
          html +=
            "<td><button onclick=\"addSolutionClicked('" +
            assignment._id +
            "')\"> Add Solution </button></td>";
          html += "</tr>";
        });
        data.notActiveAssignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.fullMarks + "</td>";
          html +=
            '<td> <a href="' +
            assignment.link +
            '" target="_blank"> Link </a></td>';
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
          html +=
            '<td rowspan="' +
            (resource.links.length + 1) +
            '">' +
            resource.topic +
            "</td>";
          resource.links.forEach((link) => {
            html += "<tr>";
            html +=
              '<td><a href="' + link + '" target="_blank"> Link </a></td>';

            html += "</tr>";
          });
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
          html +=
            "<td>" +
            (subject.teacherId
              ? subject.teacherId
              : "No Teacher assigned yet") +
            "</td>";
          html +=
            "<td>" +
            (subject.teacherId
              ? "<button onclick=\"sendFeedbackForm('" +
                subject.uniqueId +
                "', '" +
                subject.teacherId +
                "')\"> Send feedback </button>"
              : "") +
            "</td>";
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
          html +=
            '<td><a href="' +
            assignment.link +
            '" target="_blank"> Link </a></td>';
          html +=
            "<td><button onclick=\"addSolutionClicked('" +
            assignment._id +
            "')\"> Submit Solution </button></td>";
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
          html +=
            '<td><a href="' +
            assignment.link +
            '" target="_blank"> Link </a></td>';

          html +=
            '<td><a href="' +
            solution.link +
            '" target="_blank"> Link </a></td>';

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
          html +=
            "<td>" +
            (solution.marksObtained ? solution.marksObtained : "NOT MARKED") +
            "</td>";

          html += "<td>" + assignment.fullMarks + "</td>";
          html +=
            '<td><a href="' +
            solution.link +
            '" target="_blank"> Link </a></td>';
          html +=
            '<td><a href="' +
            solution.link +
            '" target="_blank"> Link </a></td>';
          html += '<td style="color:red;">DUE DATE OVER</td>';
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

  fetch("forms/studentforms/showmissedassignments.html")
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
          html +=
            '<td> <a href="' +
            assignment.link +
            '" target="_blank"> Link </a></td>';

          // html += '<td><strong style="color: red;">MISSED</strong></td>';
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

function getGradeCard() {
  let html = "";
  fetch("forms/studentforms/showgradecard.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/student/get-grade-card", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data);
        data.resultSubjects.forEach((object) => {
          let { subjectName, assignments, totalScore, highestScore } = object;

          html += "<tr>";
          html +=
            '<td rowspan="' +
            (assignments.length + 1) +
            '">' +
            subjectName +
            "</td>";

          let index;
          assignments.forEach(({ assignment, solution }) => {
            html += "<tr>";
            html += "<td>" + assignment.title + "</td>";
            html += "<td>" + assignment.teacherId + "</td>";
            html += "<td>" + solution.marksObtained + "</td>";
            html += "<td>" + assignment.fullMarks + "</td>";
            if (!index) {
              index = true;
              html +=
                '<td rowspan="' +
                (assignments.length + 1) +
                '">' +
                totalScore +
                "/" +
                highestScore +
                "</td>";
              html +=
                '<td rowspan="' +
                (assignments.length + 1) +
                '">' +
                ((totalScore / highestScore) * 100).toFixed(2) +
                " % </td>";
            }
            html += "</tr>";
          });
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

// Backend Functionalities ends here

function profile() {
  let html = "";

  fetch("forms/profile.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
      document.getElementById("display-window").innerHTML = html;
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
      const { name, uniqueId, age, DOB, email, phone, departmentId } =
        loggedInStudent;
      document.getElementById("name").innerText = name;
      document.getElementById("uniqueId").innerText = uniqueId;
      document.getElementById("age").innerText = age;
      document.getElementById("DOB").innerText = DOB;
      document.getElementById("phone").innerText = phone;
      document.getElementById("email").innerText = email;
      document.getElementById("department").innerText = departmentId;
    });
}

function notice() {
  let html =
    '<p id="notification" class="notification" style="color:red;"> </p>';
  html += "<h1>Notice</h1>";

  fetch("api/v1/notice/department/all", {
    Authorization: `Bearer ${accessToken}`,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const { allNotices } = data;
        for (const notice in allNotices) {
          html += getNoticeString(allNotices[notice]);
        }
      }
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

function getNoticeString(notice) {
  var htmlString =
    '<div class="notice" onclick="toggleDescription(this, \'' +
    notice._id +
    "')\"> \
  <h2>" +
    " " +
    notice.title +
    " " +
    (!notice.link
      ? ""
      : '<a href="' + notice.link + '" target="_blank">Link</a>') +
    '</h2> \
    <p class="date">' +
    notice.postDate +
    '</p> \
    <p class="description">' +
    notice.description +
    '</p> \
    <p class="toggle-description" id="' +
    notice._id +
    '">Check Description</p> \
    </div>';
  return htmlString;
}

function toggleDescription(element, noticeId) {
  console.log(element, noticeId);
  element.classList.toggle("open");
  var toggleElement = document.getElementById(noticeId);
  if (toggleElement) {
    if (toggleElement.textContent === "Check Description") {
      toggleElement.textContent = "Hide Description";
      toggleElement.style.color = "#594B4B";
    } else {
      toggleElement.textContent = "Check Description";
      toggleElement.style.color = "red";
    }
  }
}

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
