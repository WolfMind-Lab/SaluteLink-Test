function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

/* PROFILO */
function saveProfile() {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;

    localStorage.setItem("name", name);
    localStorage.setItem("age", age);

    document.getElementById("profileView").innerText =
        name + " - " + age + " anni";
}

/* VISITE */
function addVisit() {
    const visitDate = document.getElementById("visitDate").value;

    if (!visitDate) return;

    localStorage.setItem("visit", visitDate);

    document.getElementById("visitView").innerText =
        "Visita: " + visitDate;

    update();
}

/* REFERTI */
function addReport() {
    const input = document.getElementById("reportInput");
    const type = document.getElementById("reportType");

    if (!input.value) return;

    const li = document.createElement("li");
    li.textContent = type.value + " - " + input.value;

    document.getElementById("reportList").appendChild(li);

    saveLists();
    update();
}

/* FARMACI */
function addMed() {
    const input = document.getElementById("medInput");

    if (!input.value) return;

    const li = document.createElement("li");
    li.textContent = input.value;

    document.getElementById("medList").appendChild(li);

    saveLists();
    update();
}

/* SALVATAGGIO LISTE */
function saveLists() {
    localStorage.setItem("reports", document.getElementById("reportList").innerHTML);
    localStorage.setItem("meds", document.getElementById("medList").innerHTML);
}

/* DASHBOARD */
let chart;

function update() {

    const visits = localStorage.getItem("visit") ? 1 : 0;
    const reports = document.getElementById("reportList").children.length;
    const meds = document.getElementById("medList").children.length;

    document.getElementById("visiteCount").innerText = visits;
    document.getElementById("refertiCount").innerText = reports;
    document.getElementById("farmaciCount").innerText = meds;

    drawChart(visits, reports, meds);
}

/* GRAFICO */
function drawChart(v, r, m) {

    if (!window.Chart) return;

    const ctx = document.getElementById("chart");

    if (!chart) {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Visite", "Referti", "Farmaci"],
                datasets: [{
                    data: [v, r, m]
                }]
            }
        });
    } else {
        chart.data.datasets[0].data = [v, r, m];
        chart.update();
    }
}

/* LOAD */
window.onload = function () {

    const name = localStorage.getItem("name");
    const age = localStorage.getItem("age");

    if (name && age) {
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

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
};