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

function removeLink(url, subjectId) {
  const jsonObject = {
    url,
    subjectId,
  };
  fetch("/api/v1/teacher/resources/delete", {
    method: "DELETE",
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
        getAllLinksForChapter(data.subjectId, data.chapter);
        document.getElementById("notification").style.color = "green";
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 3000);
}

// async function getAllLinksForChapter(subjectId, chapter) {
//   try {
//     const jsonObject = {
//       subjectId,
//       chapter,
//     };

//     console.log(jsonObject);

//     // Fetch the HTML template
//     const responseHtml = await fetch(
//       "forms/teacherforms/showchapterlinks.html"
//     );
//     const data = await responseHtml.text();
//     console.log(jsonObject);
//     let html = data;

//     // Fetch resource links
//     const responseApi = await fetch("/api/v1/teacher/resources", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(jsonObject),
//     });

//     const apiData = await responseApi.json();
//     console.log(apiData);

//     if (apiData.success) {
//       apiData.resourceLinks.forEach((resource) => {
//         html += "</tr>";
//         html += `<td>${resource.link}</td>`;
//         html += `<td><button onclick="UpdateLink('${resource.link}')"> Update </button></td>`;
//         html += `<td><button onclick="removeLink('${resource.link}')"> Remove </button></td>`;
//         html += "</tr>";
//       });
//     }

//     html += "</tbody>";
//     html += "</table>";

//     // Display the HTML content
//     document.getElementById("display-window").innerHTML = html;
//     document.getElementById("notification").innerText = apiData.message;

//     if (apiData.success)
//       document.getElementById("notification").style.color = "green";
//     else document.getElementById("notification").style.color = "red";

//     setTimeout(() => {
//       document.getElementById("notification").innerText = "";
//     }, 2000);
//   } catch (error) {
//     console.log("Error fetching data:", error);
//   }
// }

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
