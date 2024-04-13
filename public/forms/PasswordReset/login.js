var email = "";

function sendOTP() {
  // let html = "";
  // fetch("forms/PasswordReset/forgetpassword.html").then(response => {
  //     return response.text();
  // }
  // ).then(data => {
  //     html = data;
  // })

  const myEmail = document.getElementById("email").value;
  email = myEmail;
  console.log(email);
  let jsonObject = {
    email: myEmail,
  };

  fetch("/api/v1/auth/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        window.location.href = "./forgetpassword.html";
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 6000);
}

function verifyOTP() {
  // let html = "";
  // fetch("forms/PasswordReset/newpassword.html").then(response => {
  //     return response.text();
  // }
  // ).then(data => {
  //     html = data;
  // })

  const otp = document.getElementById("otp").value;
  console.log(email);
  let jsonObject = {
    otp,
  };
  fetch("/api/v1/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        window.location.href = "./newpassword.html";
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 4000);
}

function newPasswordLogin() {
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  let jsonObject = {
    password,
    confirmPassword,
  };
  console.log(jsonObject);
  fetch("/api/v1/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("notification").innerText = data.message;
      if (data.success) {
        document.getElementById("notification").style.color = "green";
        window.location.href = "../../login.html";
      } else document.getElementById("notification").style.color = "red";
    });
  setTimeout(() => {
    document.getElementById("notification").innerText = "";
  }, 2000);
}
