let data = {
    visits: [],
    reports: [],
    meds: []
};

let currentDate = new Date();
let chart;

/* NAV */
function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    if (page === "visite") renderCalendar();
}

/* SAVE */
function save() {
    localStorage.setItem("salutelink", JSON.stringify(data));
}

function load() {
    const d = localStorage.getItem("salutelink");
    if (d) data = JSON.parse(d);
}

/* VISITE */
function addVisit() {
    data.visits.push({
        date: selectedDate || today(),
        note: visitNote.value
    });

    visitNote.value = "";
    save();
    renderAll();
    renderCalendar();
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

/* FARMACI */
function addMed() {
    data.meds.push({
        name: medName.value,
        dose: medDose.value,
        time: medTime.value
    });

    medName.value = "";
    medDose.value = "";
    medTime.value = "";

    save();
    renderAll();
}

/* DELETE (CRUD) */
function remove(type, index) {
    data[type].splice(index, 1);
    save();
    renderAll();
}

/* CALENDAR */
let selectedDate = null;

function renderCalendar() {
    const cal = document.getElementById("calendar");
    const label = document.getElementById("monthLabel");

    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    label.innerText = currentDate.toLocaleString("it-IT", {
        month: "long",
        year: "numeric"
    });

    cal.innerHTML = "";

    for (let i = 0; i < first; i++) cal.innerHTML += "<div></div>";

    for (let d = 1; d <= days; d++) {
        const date = `${y}-${m + 1}-${d}`;
        const has = data.visits.some(v => v.date === date);

        cal.innerHTML += `
            <div class="day ${has ? "has" : ""}"
            onclick="selectedDate='${date}'">
                ${d}
            </div>
        `;
    }
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

/* RENDER */
function renderAll() {

    visiteCount.innerText = data.visits.length;
    refertiCount.innerText = data.reports.length;
    farmaciCount.innerText = data.meds.length;

    visitList.innerHTML = data.visits.map((v,i)=>
        `📅 ${v.date} - ${v.note} <button onclick="remove('visits',${i})">❌</button>`
    ).join("");

    reportList.innerHTML = data.reports.map((r,i)=>
        `📄 ${r.name} <button onclick="remove('reports',${i})">❌</button>`
    ).join("");

    medList.innerHTML = data.meds.map((m,i)=>
        `💊 ${m.name} <button onclick="remove('meds',${i})">❌</button>`
    ).join("");

    timeline.innerHTML = [
        ...data.visits.map(v => `📅 ${v.date}`),
        ...data.reports.map(r => `📄 ${r.name}`),
        ...data.meds.map(m => `💊 ${m.name}`)
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

/* UTIL */
function today() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

/* INIT */
window.onload = function () {
    load();
    renderAll();
};