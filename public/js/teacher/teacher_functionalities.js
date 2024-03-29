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

async function addAssignment() {
  try {
    const subjectId = document.getElementById("subject-id").value;
    const title = document.getElementById("title").value;
    const fullMarks = document.getElementById("full-marks").value;

    // Create a new FormData object
    const formData = new FormData();

    // Get the selected files
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    // Append each file to the FormData
    for (const file of files) {
      console.log(file);
      formData.append("assignments", file);
    }

    document.getElementById("subject-id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("full-marks").value = "";
    document.getElementById("fileInput").value = "";

    // Append the subjectId and title to the FormData
    formData.append("subjectId", subjectId);
    formData.append("title", title);
    formData.append("fullMarks", fullMarks);

    console.log(formData);

    const response = await fetch("/api/v1/teacher/assignment/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    document.getElementById("notification").innerText = data.message;

    if (data.success)
      document.getElementById("notification").style.color = "green";
    else document.getElementById("notification").style.color = "red";

    setTimeout(() => {
      document.getElementById("notification").innerText = "";
    }, 3000);
  } catch (error) {
    console.log(error);
  }
}

async function addResources() {
  try {
    const subjectId = document.getElementById("subject-id").value;
    const chapter = document.getElementById("chapter").value;

    // Create a new FormData object
    const formData = new FormData();

    // Get the selected files
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    // Append each file to the FormData
    for (const file of files) {
      console.log(file);
      formData.append("resources", file);
    }

    document.getElementById("subject-id").value = "";
    document.getElementById("chapter").value = "";
    document.getElementById("fileInput").value = "";

    // Append the subjectId and title to the FormData
    formData.append("subjectId", subjectId);
    formData.append("chapter", chapter);

    console.log(formData);

    const response = await fetch("/api/v1/teacher/resources/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    document.getElementById("notification").innerText = data.message;

    if (data.success)
      document.getElementById("notification").style.color = "green";
    else document.getElementById("notification").style.color = "red";

    setTimeout(() => {
      document.getElementById("notification").innerText = "";
    }, 3000);
  } catch (error) {
    console.log(error);
  }
}

function addAttendance() {
  const subjectId = document.getElementById("subject-id").value;
  const studentId = document.getElementById("student-id").value;

  document.getElementById("subject-id").value = "";
  document.getElementById("student-id").value = "";

  const jsonObject = {
    subjectId,
    studentId,
  };
  fetch("/api/v1/teacher/attendance", {
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
  }, 3000);
}

// Define the function to handle the button click
function handleLinksButtonClick(subjectId, chapter) {
  // console.log(subjectId, chapter);
  getAllLinksForChapter(subjectId, chapter);
}

function getAllResources() {
  let html = "";

  fetch("forms/teacherforms/showresources.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/teacher/resources", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.resources.forEach((resource) => {
          html += "<tr>";
          html += "<td>" + resource.name + "</td>";
          html += "<td>" + resource.subjectId + "</td>";
          html += "<td>" + resource.chapter + "</td>";
          html += `<td>
            <button onclick="handleLinksButtonClick('${resource.subjectId}', '${resource.chapter}')">
              Links
            </button>
          </td>`;

          // html +=
          //   "<td><button onclick=\"getAllTeachers('" +
          //   department.uniqueId +
          //   "')\"> Teachers List </button></td>";
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

function getAllLinksForChapter(subjectId, chapter) {
  let html = "";
  // console.log(subjectId, chapter);

  fetch("forms/teacherforms/showchapterlinks.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      // console.log(jsonObject);
      html = data;
    });

  const jsonObject = {
    subjectId,
    chapter,
  };
  // console.log(JSON.stringify(jsonObject));

  fetch("/api/v1/teacher/resources/chapter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(jsonObject),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      if (data.success) {
        // console.log(data.resourcesLink);
        data.resourcesLink.forEach((link) => {
          html += "</tr>";
          html += "<td>" + link + "</td>";
          html += `<td><button onclick="UpdateLink('${link}')"> Update </button></td>`;
          html += `<td><button onclick="removeLink('${link}', '${subjectId}')"> Remove </button></td>`;
          html += "</tr>";
        });
      }
      html += "</tbody>";
      html += "</table>";
      document.getElementById("display-window").innerHTML = html;
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
      } else document.getElementById("notification").style.color = "red";

      setTimeout(() => {
        document.getElementById("notification").innerText = "";
      }, 2000);
    });
}

async function removeLink(url, subjectId) {
  try {
    const jsonObject = {
      url,
      subjectId,
    };
    const apiResponse = await fetch("/api/v1/teacher/resources/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jsonObject),
    });
    const data = await apiResponse.json();
    document.getElementById("notification").innerText = data.message;
    if (data.success) {
      getAllLinksForChapter(data.subjectId, data.chapter);
      document.getElementById("notification").style.color = "green";
    } else document.getElementById("notification").style.color = "red";

    setTimeout(() => {
      document.getElementById("notification").innerText = "";
    }, 3000);
  } catch (error) {
    console.log(error);
  }
}

function getAllAssignments() {
  let html = "";

  fetch("forms/teacherforms/showassignments.html")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      html = data;
    });

  fetch("/api/v1/teacher/assignments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.assignments.forEach((assignment) => {
          html += "<tr>";
          html += "<td>" + assignment.title + "</td>";
          html += "<td>" + assignment.subjectId + "</td>";
          // console.log(assignment);
          // console.log(assignment.addedAssignment);
          // const addedAssignment = JSON.stringify(assignment);
          // console.log(addedAssignment);
          html += `<td><button onclick="showAllAssignmentLinks('${assignment._id}')"> Update </button></td>`;

          html += `<td>
            <button onclick="updateAssignment('${assignment._id}')">
              Update
            </button>
          </td>`;
          html += `<td>
            <button onclick="delteAssignment('${assignment._id}')">
              Delete
            </button>
          </td>`;

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

async function showAllAssignmentLinks(assignments) {
  try {
    let html = "";

    const response = await fetch("forms/teacherforms/showmyassignment.html");
    console.log(response);
    const data = await response.text();
    html += data;
    // console.log(html);

    html += "</tbody>";
    html += "</table>";
    document.getElementById("display-window").innerHTML = html;
    document.getElementById("notification").innerText = "data.message;";
    // if (data.success)
    //   document.getElementById("notification").style.color = "green";
    // else document.getElementById("notification").style.color = "red";

    setTimeout(() => {
      document.getElementById("notification").innerText = "";
    }, 2000);
  } catch (error) {}
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
