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

/* VISITE */
function addVisit() {
    const date = document.getElementById("visitDate").value;
    const note = document.getElementById("visitNote").value;

    if (!date) return;

    data.visits.push({ date, note });

    renderVisits();
    save();
    update();
}

function renderVisits() {
    const view = document.getElementById("visitView");
    view.innerHTML = "";

    data.visits.forEach(v => {
        const div = document.createElement("div");
        div.innerHTML = `📅 ${v.date} — 📝 ${v.note}`;
        view.appendChild(div);
    });
}

/* REFERTI */
function addReport() {
    const name = document.getElementById("reportInput").value;
    const type = document.getElementById("reportType").value;
    const desc = document.getElementById("reportDesc").value;

    if (!name) return;

    data.reports.push({
        name,
        type,
        desc
    });

    renderReports();
    save();
    update();
}

function renderReports() {
    const list = document.getElementById("reportList");
    list.innerHTML = "";

    data.reports.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `
            📄 <b>${r.name}</b> (${r.type})<br>
            📝 ${r.desc}
        `;
        list.appendChild(li);
    });
}

/* FARMACI */
function addMed() {
    const name = document.getElementById("medInput").value;
    const dose = document.getElementById("medDose").value;
    const time = document.getElementById("medTime").value;

    if (!name) return;

    data.meds.push({ name, dose, time });

    renderMeds();
    save();
    update();
}

function renderMeds() {
    const list = document.getElementById("medList");
    list.innerHTML = "";

    data.meds.forEach(m => {
        const li = document.createElement("li");
        li.innerHTML = `
            💊 <b>${m.name}</b><br>
            ${m.dose} — ${m.time}
        `;
        list.appendChild(li);
    });
}

/* STORAGE */
function save() {
    localStorage.setItem("salutelink", JSON.stringify(data));
}

function load() {
    const saved = localStorage.getItem("salutelink");
    if (saved) data = JSON.parse(saved);
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
                datasets: [{ data: [v, r, m] }]
            }
        });
    } else {
        chart.data.datasets[0].data = [v, r, m];
        chart.update();
    }
}

/* INIT */
window.onload = function () {
    load();
    renderVisits();
    renderReports();
    renderMeds();
    update();

    setTimeout(() => {
        document.getElementById("splashScreen")?.remove();
    }, 1800);
};