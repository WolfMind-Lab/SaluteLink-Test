let data = {
    visits: [],
    reports: [],
    meds: []
};

let chart;

/* NAV */
function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

/* THEME */
function toggleTheme() {
    document.body.classList.toggle("dark");
}

/* STORAGE */
function saveData() {
    localStorage.setItem("salutelink", JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem("salutelink");
    if (saved) data = JSON.parse(saved);
}

/* VISITE */
function addVisit() {
    const date = document.getElementById("visitDate").value;
    if (!date) return;

    data.visits.push({ date });

    document.getElementById("visitView").innerText =
        "Ultima visita: " + date;

    saveData();
    update();
}

/* REFERTI */
function addReport() {
    const input = document.getElementById("reportInput");
    const type = document.getElementById("reportType");

    if (!input.value) return;

    data.reports.push({
        type: type.value,
        name: input.value,
        date: new Date().toLocaleDateString()
    });

    renderReports();
    saveData();
    update();
}

function renderReports() {
    const list = document.getElementById("reportList");
    list.innerHTML = "";

    data.reports.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.date} - ${r.type} - ${r.name}`;
        list.appendChild(li);
    });
}

/* FARMACI */
function addMed() {
    const input = document.getElementById("medInput");
    if (!input.value) return;

    data.meds.push({ name: input.value });

    renderMeds();
    saveData();
    update();
}

function renderMeds() {
    const list = document.getElementById("medList");
    list.innerHTML = "";

    data.meds.forEach(m => {
        const li = document.createElement("li");
        li.textContent = "💊 " + m.name;
        list.appendChild(li);
    });
}

/* DASHBOARD */
function update() {
    document.getElementById("visiteCount").innerText = data.visits.length;
    document.getElementById("refertiCount").innerText = data.reports.length;
    document.getElementById("farmaciCount").innerText = data.meds.length;

    drawChart();
}

/* CHART */
function drawChart() {
    if (!window.Chart) return;

    const ctx = document.getElementById("chart");

    const v = data.visits.length;
    const r = data.reports.length;
    const m = data.meds.length;

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

/* INIT */
window.onload = function () {

    loadData();

    renderReports();
    renderMeds();

    if (data.visits.length > 0) {
        document.getElementById("visitView").innerText =
            "Ultima visita: " + data.visits[data.visits.length - 1].date;
    }

    update();

    setTimeout(() => {
        const splash = document.getElementById("splashScreen");
        if (splash) splash.remove();
    }, 1800);
};