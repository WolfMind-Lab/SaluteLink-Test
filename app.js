function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

/* PROFILO */
function saveProfile() {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;

    localStorage.setItem("name", name);
    localStorage.setItem("age", age);

    document.getElementById("profileView").innerText =
        name + " - " + age + " anni";
}

/* VISITE */
function addVisit() {
    let date = document.getElementById("visitDate").value;
    if (!date) return;

    localStorage.setItem("visit", date);
    document.getElementById("visitView").innerText = "Visita: " + date;

    update();
}

/* REFERTI */
function addReport() {
    let text = document.getElementById("reportInput").value;
    let type = document.getElementById("reportType").value;

    if (!text) return;

    let li = document.createElement("li");
    li.textContent = type + " - " + text;

    document.getElementById("reportList").appendChild(li);

    localStorage.setItem("reports", document.getElementById("reportList").innerHTML);

    update();
}

/* FARMACI */
function addMed() {
    let text = document.getElementById("medInput").value;
    if (!text) return;

    let li = document.createElement("li");
    li.textContent = text;

    document.getElementById("medList").appendChild(li);

    localStorage.setItem("meds", document.getElementById("medList").innerHTML);

    update();
}

/* DASHBOARD */
function update() {
    document.getElementById("countVisits").innerText =
        localStorage.getItem("visit") ? 1 : 0;

    document.getElementById("countReports").innerText =
        document.querySelectorAll("#reportList li").length;

    document.getElementById("countMeds").innerText =
        document.querySelectorAll("#medList li").length;
}

/* LOAD */
window.onload = function () {

    let name = localStorage.getItem("name");
    let age = localStorage.getItem("age");

    if (name) {
        document.getElementById("profileView").innerText =
            name + " - " + age + " anni";
    }

    document.getElementById("visitView").innerText =
        "Visita: " + (localStorage.getItem("visit") || "nessuna");

    document.getElementById("reportList").innerHTML =
        localStorage.getItem("reports") || "";

    document.getElementById("medList").innerHTML =
        localStorage.getItem("meds") || "";

    update();
};