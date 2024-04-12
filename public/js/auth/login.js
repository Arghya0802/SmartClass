let email = "";

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
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if (data.success)
            document.getElementById("notification").style.color = "green";
            else document.getElementById("notification").style.color = "red";
        const post = data.designation;
        if(post==="admin")
        window.location.href = "/admin.html";
        else if(post==="hod")
        window.location.href = "/hod.html";
        else if(post==="student")
        window.location.href = "/student.html";
        else if(post==="teacher")
        window.location.href = "/teacher.html";
    })
}



function forgotPasswordClicked()
{
    // fetch("forms/PasswordReset/enteremail.html").then(response => {
    //     return response.text();
    // }
    // ).then(html => {
    //     document.getElementById("display-window").innerHTML = html;
    // })

    window.location.href = "forms/PasswordReset/enteremail.html";
}