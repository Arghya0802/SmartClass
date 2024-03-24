
function addAdmin(){
    const uniqueId = document.getElementById("unique-id").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email-id").value;
    const password = document.getElementById("password").value;
    
    document.getElementById("unique-id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email-id").value = "";
    document.getElementById("password").value = "";

    console.log(uniqueId);
    console.log(name);
    console.log(email);    
    console.log(password);
    const jsonObject = {
        uniqueId,
        name,
        email,
        password
    }
    fetch("/api/v1/admin/add-admin", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}


function assignHOD(){
    const uniqueId = document.getElementById("unique-id").value;
    document.getElementById("unique-id").value = "";
    console.log(uniqueId);
    const jsonObject = {
        uniqueId
    }
    fetch("/api/v1/admin/assign-hod", {
        method : 'PATCH',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}

function removeHOD(){
    const uniqueId = document.getElementById("unique-id").value;
    document.getElementById("unique-id").value = "";
    console.log(uniqueId);
    const jsonObject = {
        uniqueId
    }
    fetch("/api/v1/admin/remove-hod", {
        method : 'PATCH',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}


function addStudent(){
    const uniqueId = document.getElementById("unique-id").value;
    const departmentId = document.getElementById("department").value;

    document.getElementById("unique-id").value = "";
    document.getElementById("department").value = "";

    console.log(uniqueId);
    console.log(departmentId);
    const jsonObject = {
        uniqueId,
        departmentId
    }
    fetch("/api/v1/admin/add-student", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)

}


function addDepartment(){
    const uniqueId = document.getElementById("department-id").value;
    const name = document.getElementById("department").value;
    
    document.getElementById("department-id").value = "";
    document.getElementById("department").value = "";

    console.log(uniqueId);    
    console.log(name);
    const jsonObject = {
        uniqueId,
        name
    }
    fetch("/api/v1/admin/add-department", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}


function addTeacher(){
    const uniqueId = document.getElementById("unique-id").value;
    const departmentId = document.getElementById("department").value;
    
    document.getElementById("unique-id").value = "";
    document.getElementById("department").value = "";

    console.log(uniqueId);
    console.log(departmentId);
    const jsonObject = {
        uniqueId,
        departmentId
    }
    fetch("/api/v1/admin/add-teacher", {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(jsonObject)
    }).then((response) => {
        return response.json();
    }).then((data) => {
        document.getElementById("notification").innerText = data.message;
        if(data.success)
        document.getElementById("notification").style.color = "green";
        else
        document.getElementById("notification").style.color = "red";
    })
    setTimeout(() => {
        document.getElementById("notification").innerText = "";
    },2000)
}