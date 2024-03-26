let accessToken;
let refreshToken;
getCookie(document.cookie);
console.log(accessToken);

if(!accessToken)
{
  localStorage.setItem("response",JSON.stringify({ message : "Unauthorized Access" ,statusCode : 404}));
  document.location.href = "/error/error.html"
}

var statusCode;

fetch("api/v1/auth/verify",{
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
})
.then( res => {
  statusCode = res.status;
  return res.json();
})
.then(data => {
  if(data.success === false)
  {
    localStorage.setItem("response",JSON.stringify({ message : data.message ,statusCode}));
    window.location.href = "/error/error.html"
  }
})

fetch("api/v1/teacher/", {
  headers :
  {
    'Authorization': `Bearer ${accessToken}`,
  }
}).then(res => {
  return res.json()
})
.then(data => {
  const {loggedInTeacher} = data;
  document.getElementById("name").innerText = loggedInTeacher.name;
  document.getElementById("designation").innerText = "Teacher";
  document.getElementById("uniqueId").innerText = loggedInTeacher.uniqueId;
  
    // setTimeout(()=>{
    //     logout();
    // },data.session)
})


function addAssignment()
{
    //Testing functionality
    document.getElementById("notification").innerText = "Hi there You have clicked Add";
}

function logout()
{
  fetch("/api/v1/auth/logout", {
      headers : {
          'Authorization': `Bearer ${accessToken}`,
      },
  }).then(res => res.json())
  .then(data => {
      if(data.success)
      document.location.href = "/";
      else
      {
          document.getElementById("notification").innerText = data.message;
          setTimeout(() => {
          document.getElementById("notification").innerText = "";
          },2000)
      }
  })
}

function getCookie(allCookies)
  {
      const cookieArray = allCookies.split(';');
      const cookieObject = {};
      cookieArray.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookieObject[name] = value;
  });

    accessToken = cookieObject['accessToken'];
    refreshToken = cookieObject['refreshToken'];
  
  }