function loginClicked()
{
    event.preventDefault();
    var jsonObject;
    const uniqueId = document.getElementById("unique-id").value;
    const password = document.getElementById("password").value;
    if(uniqueId && password)
    {
        jsonObject = {
            uniqueId,
            password
        }
    }

    document.getElementById("unique-id").value = "";
    document.getElementById("password").value = "";

    var statusCode;
    fetch("/api/v1/auth/login", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {

        statusCode = response.status;

        //console.log(response.headers.getSetCookie());

        return response.json();
    }).then((data) => {
        const post = data.designation;
        if(post==="admin")
        window.location.href = "/admin.html";
        else if(post==="hod")
        window.location.href = "/hod.html";
        else if(post==="student")
        window.location.href = "/student.html";
        else if(post==="teacher")
        window.location.href = "/teacher.html";
        else
        {
            localStorage.setItem("response",JSON.stringify({ message : data.message ,statusCode}));
            window.location.href = "/error.html";
        }
    })
}