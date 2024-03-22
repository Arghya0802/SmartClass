const {data} = JSON.parse(localStorage.getItem("response"));
const {designation,findAdmin} = data;
const {name,uniqueId} = findAdmin;
document.getElementById("name").innerText = name;
document.getElementById("designation").innerText = designation;
document.getElementById("uniqueId").innerText = uniqueId;

function addDepartmentClicked() 
{
    // fetch("forms/test.html").then(response => {
    //     return response.text();
    // }
    // ).then(html => {
    //     document.getElementById("display-window").innerHTML = html;
    // })
    document.getElementById("display-window").innerHTML = "You Clicked add Department button";
}

function addSubjectClicked() 
{
    document.getElementById("display-window").innerHTML = "You Clicked add Subject button";
}

function addTeacherClicked()
{
    document.getElementById("display-window").innerHTML = "You Clicked add Teacher button";
}

function assignHODClicked() 
{
    document.getElementById("display-window").innerHTML = "You Clicked assign HOD button";
}