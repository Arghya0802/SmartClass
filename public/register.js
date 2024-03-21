function RegisterClicked()
{
    event.preventDefault();

    var UID = document.getElementById("uniqueId").value;
    var pwd = document.getElementById("password").value;
    var mail = document.getElementById("email").value;
    var name = document.getElementById("name").value;

<<<<<<< HEAD
    const jsonObject = {
=======
    var jsonObject = {}
    var statusCode;

    if(UID && pwd && mail && name)
    jsonObject = {
>>>>>>> origin/Raj
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
<<<<<<< HEAD
=======
        statusCode = response.status;
>>>>>>> origin/Raj
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);
<<<<<<< HEAD
=======
        localStorage.setItem("response", JSON.stringify( {data, statusCode}));
>>>>>>> origin/Raj
        if(data.success === true)
        window.location.href = "login.html";
        else
        window.location.href = "error.html";
    })
    .catch(error => {
        console.log('Error:', error);
    });
<<<<<<< HEAD
=======
}

function goToLogin()
{
    event.preventDefault();
    window.location.href = "login.html"
>>>>>>> origin/Raj
}