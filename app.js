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

/* SEARCH */
function searchAll() {
    const q = document.getElementById("search").value.toLowerCase();

    const all = [
        ...data.visits.map(v => "visita " + v.note),
        ...data.reports.map(r => r.name + " " + r.desc),
        ...data.meds.map(m => m.name)
    ];

    const results = all.filter(x => x.toLowerCase().includes(q));

    document.getElementById("timeline").innerHTML =
        results.map(r => `<div class="item">🔎 ${r}</div>`).join("");
}

/* VISITE */
function addVisit() {
    data.visits.push({
        date: visitDate.value,
        note: visitNote.value
    });

    save();
    renderAll();
}

/* REFERTI */
function addReport() {
    data.reports.push({
        name: reportInput.value,
        type: reportType.value,
        desc: reportDesc.value
    });

    save();
    renderAll();
}

/* FARMACI */
function addMed() {
    data.meds.push({
        name: medInput.value,
        dose: medDose.value,
        time: medTime.value
    });

    save();
    renderAll();
}

/* DELETE GENERICO */
function remove(type, index) {
    data[type].splice(index, 1);
    save();
    renderAll();
}

/* RENDER */
function renderAll() {
    visiteCount.innerText = data.visits.length;
    refertiCount.innerText = data.reports.length;
    farmaciCount.innerText = data.meds.length;

    visitList.innerHTML = data.visits.map((v,i)=>
        `<div class="item">📅 ${v.date} - ${v.note} <button onclick="remove('visits',${i})">❌</button></div>`
    ).join("");

    reportList.innerHTML = data.reports.map((r,i)=>
        `<div class="item">📄 ${r.name} (${r.type}) - ${r.desc} <button onclick="remove('reports',${i})">❌</button></div>`
    ).join("");

    medList.innerHTML = data.meds.map((m,i)=>
        `<div class="item">💊 ${m.name} - ${m.dose} - ${m.time} <button onclick="remove('meds',${i})">❌</button></div>`
    ).join("");

    timeline.innerHTML = [
        ...data.visits.map(v => `📅 ${v.date} - ${v.note}`),
        ...data.reports.map(r => `📄 ${r.name}`),
        ...data.meds.map(m => `💊 ${m.name}`)
    ].map(x => `<div class="item">${x}</div>`).join("");

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
    const saved = localStorage.getItem("salutelink");
    if (saved) data = JSON.parse(saved);

    renderAll();
};