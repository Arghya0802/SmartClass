
const {data} = JSON.parse(localStorage.getItem("response"));
const {designation,findAdmin} = data;
const {name,uniqueId} = findAdmin;
document.getElementById("name").innerText = name;
document.getElementById("designation").innerText = designation;
document.getElementById("uniqueId").innerText = uniqueId;