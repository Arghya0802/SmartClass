function registerClicked()
{
    event.preventDefault();
    var jsonObject = { };
    const uniqueId = document.getElementById("unique-id").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email-id").value;
    const name = document.getElementById("name").value;
    if(uniqueId && password && email && name)
    {
        jsonObject = {
            uniqueId,
            password,
            email,
            name
        }
    }
    var statusCode;
    fetch("/api/v1/auth/register", {
        method : 'PATCH',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        statusCode = response.status;
        return response.json();
    }).then((data) => {
        localStorage.setItem("response",JSON.stringify({data,statusCode}))
        if(statusCode === 200)
        window.location.href = "/login.html";
        else
        window.location.href = "/error/error.html";
    })
}