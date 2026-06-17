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
    const note = prompt("Nota visita (facoltativa):");

    if (!date) return;

    data.visits.push({
        date,
        note: note || "Nessuna nota"
    });

    save();
    renderVisits();
    update();
}

function renderVisits() {
    const view = document.getElementById("visitView");
    view.innerHTML = "";

    if (data.visits.length === 0) {
        view.innerHTML = "Nessuna visita";
        return;
    }

    data.visits.forEach(v => {
        const div = document.createElement("div");
        div.innerHTML = `📅 ${v.date} - 📝 ${v.note}`;
        view.appendChild(div);
    });
}

/* REFERTI */
function addReport() {
    const input = document.getElementById("reportInput");
    const type = document.getElementById("reportType");

    const desc = prompt("Descrizione referto (facoltativa):");

    if (!input.value) return;

    data.reports.push({
        name: input.value,
        type: type.value,
        desc: desc || "Nessuna descrizione",
        date: new Date().toLocaleDateString()
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
            📄 ${r.date} - ${r.type} - <b>${r.name}</b><br>
            <small>${r.desc}</small>
        `;
        list.appendChild(li);
    });
}

/* FARMACI */
function addMed() {
    const name = document.getElementById("medInput").value;
    const dose = prompt("Dose (es: 500mg)");
    const time = prompt("Orario (es: mattina / sera)");

    if (!name) return;

    data.meds.push({
        name,
        dose: dose || "non specificata",
        time: time || "non specificato"
    });

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
            <small>${m.dose} - ${m.time}</small>
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
    load();

    if (data.visits.length > 0) renderVisits();
    renderReports();
    renderMeds();

    update();

    setTimeout(() => {
        const splash = document.getElementById("splashScreen");
        if (splash) splash?.remove();
    }, 1800);
};