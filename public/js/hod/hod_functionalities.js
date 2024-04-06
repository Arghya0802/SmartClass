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
    if (data.success === false || data.designation!=="hod") {
      localStorage.setItem(
        "response",
        JSON.stringify({ message : data.message, statusCode })
      );
      window.location.href = "/error/error.html";
    }
  });

fetch("api/v1/hod/", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const { loggedInHoD } = data;
    document.getElementById("name").innerText = loggedInHoD.name;
    document.getElementById("designation").innerText = loggedInHoD.designation;
    document.getElementById("uniqueId").innerText = loggedInHoD.uniqueId;

    // setTimeout(()=>{
    //     logout();
    // },data.session)
  });

// Backend Functionalities are starts here

function addSubject() {
  const subjectId = document.getElementById("subject-id").value;
  const name = document.getElementById("name").value;

  document.getElementById("subject-id").value = "";
  document.getElementById("name").value = "";

  const jsonObject = {
    subjectId,
    name,
  };
  fetch("/api/v1/subject/add", {
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

function assignSubjectToTeacher() {
  const subjectId = document.getElementById("subject-id").value;
  const teacherId = document.getElementById("teacher-id").value;

  document.getElementById("subject-id").value = "";
  document.getElementById("teacher-id").value = "";

  const jsonObject = {
    subjectId,
    teacherId,
  };
  fetch("/api/v1/hod/assign-subject-teacher", {
    method: "PATCH",
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

  fetch("forms/hodforms/showsubjects.html")
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
          html += "<td>" + subject.uniqueId + "</td>";
          html += "<td>" + subject.name + "</td>";
          html +=
            "<td><button onclick=\"removeSubject('" +
            subject._id +
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

function removeSubject(subjectId) {
  fetch("/api/v1/subject/remove", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subjectId }), // ObjectId
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        getAllSubjects();
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
