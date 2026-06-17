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

/* STORAGE */
function save() {
    localStorage.setItem("healthpro", JSON.stringify(data));
}

function load() {
    const d = localStorage.getItem("healthpro");
    if (d) data = JSON.parse(d);
}

/* VISITE */
function addVisit() {
    data.visits.push({
        note: visitNote.value,
        type: visitType.value,
        time: visitTime.value
    });

    visitNote.value = "";

    save();
    renderAll();
}

/* FARMACI */
function addMed() {
    data.meds.push({
        name: medName.value,
        dose: medDose.value,
        time: medTime.value
    });

    medName.value = "";

    save();
    renderAll();
}

/* REFERTI */
function addReport() {
    data.reports.push({
        name: reportName.value,
        desc: reportDesc.value
    });

    reportName.value = "";
    reportDesc.value = "";

    save();
    renderAll();
}

/* RENDER */
function renderAll() {

    visiteCount.innerText = data.visits.length;
    refertiCount.innerText = data.reports.length;
    farmaciCount.innerText = data.meds.length;

    visitList.innerHTML = data.visits.map(v =>
        `📅 ${v.type} - ${v.time} - ${v.note}`
    ).join("");

    medList.innerHTML = data.meds.map(m =>
        `💊 ${m.name} - ${m.dose} - ${m.time}`
    ).join("");

    reportList.innerHTML = data.reports.map(r =>
        `📄 ${r.name}`
    ).join("");

    timeline.innerHTML = [
        ...data.visits.map(v => `📅 ${v.type} - ${v.time}`),
        ...data.meds.map(m => `💊 ${m.name}`),
        ...data.reports.map(r => `📄 ${r.name}`)
    ].map(x => `<div>${x}</div>`).join("");

    drawChart();
}

/* CHART */
function drawChart() {
    const ctx = document.getElementById("chart");

    const v = data.visits.length;
    const r = data.reports.length;
    const m = data.meds.length;

    if (!chart) {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Visite","Referti","Farmaci"],
                datasets: [{ data: [v,r,m] }]
            }
        });
    } else {
        chart.data.datasets[0].data = [v,r,m];
        chart.update();
    }
}

/* INIT */
window.onload = function () {
    load();
    renderAll();
};