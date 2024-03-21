function RegisterClicked()
{
    event.preventDefault();

    var UID = document.getElementById("uniqueId").value;
    var pwd = document.getElementById("password").value;
    var mail = document.getElementById("email").value;
    var name = document.getElementById("name").value;

    var jsonObject = {}
    var statusCode;

    if(UID && pwd && mail && name)
    jsonObject = {
        name : name,
        uniqueId : UID,
        email : mail,
        password : pwd
    }
    
    console.log(JSON.stringify(jsonObject))

    fetch('api/v1/auth/register', {
        method: 'PATCH',
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonObject)
    })
    .then(response => {
        statusCode = response.status;
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);
        localStorage.setItem("response", JSON.stringify( {data, statusCode}));
        if(data.success === true)
        window.location.href = "login.html";
        else
        window.location.href = "error.html";
    })
    .catch(error => {
        console.log('Error:', error);
    });
}

function goToLogin()
{
    event.preventDefault();
    window.location.href = "login.html"
}