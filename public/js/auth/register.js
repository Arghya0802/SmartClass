function registerClicked()
{
    event.preventDefault();
    var jsonObject = { };
    const uniqueId = document.getElementById("unique-id").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email-id").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value;
    const DOB = document.getElementById("dob").value;

    if(uniqueId && password && email && name)
    {
        jsonObject = {
            uniqueId,
            password,
            email,
            name,
            phone,
            gender,
            DOB
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
        document.getElementById("notification").innerText = data.message;
        if (data.success)
            document.getElementById("notification").style.color = "green";
            else document.getElementById("notification").style.color = "red";
        });
}