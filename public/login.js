// Show/hide password onClick of button using Javascript only

// https://stackoverflow.com/questions/31224651/show-hide-password-onclick-of-button-using-javascript-only

function LoginClicked() {
  event.preventDefault();
  // Get form data
  const UID = document.getElementById("uniqueId").value;
  const pwd = document.getElementById("password").value;
  var jsonObject = {
    uniqueId: UID,
    password: pwd,
  };
  console.log(JSON.stringify(jsonObject));

  document.getElementById("uniqueId").value = "";
  document.getElementById("password").value = "";

  // Send POST request to API
  fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from server:", data);
      if (data.designation === "student")
        window.location.href = "users/student.html";
      else if (data.designation === "hod")
        window.location.href = "users/hod.html";
      else if (data.designation === "teacher")
        window.location.href = "users/teacher.html";
      else if (data.designation === "admin")
        window.location.href = "users/admin.html";
      else window.location.href = "error.html";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function goToRegister() {
  event.preventDefault();
  window.location.href = "register.html";
}
