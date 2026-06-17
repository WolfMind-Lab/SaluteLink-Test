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
    const date = document.getElementById("visitDate").value;
    if (!date) return;

    localStorage.setItem("visit", date);

    document.getElementById("visitView").innerText =
        "Visita: " + date;

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

/* SALVATAGGIO */
function saveLists() {
    localStorage.setItem("reports", document.getElementById("reportList").innerHTML);
    localStorage.setItem("meds", document.getElementById("medList").innerHTML);
}

/* DASHBOARD */
let chart;

function update() {

    const v = localStorage.getItem("visit") ? 1 : 0;
    const r = document.getElementById("reportList").children.length;
    const m = document.getElementById("medList").children.length;

    document.getElementById("visiteCount").innerText = v;
    document.getElementById("refertiCount").innerText = r;
    document.getElementById("farmaciCount").innerText = m;

    drawChart(v, r, m);
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

    document.getElementById("profileView").innerText =
        (localStorage.getItem("name") || "") +
        " - " +
        (localStorage.getItem("age") || "") +
        " anni";

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