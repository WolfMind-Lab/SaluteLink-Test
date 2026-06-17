let data = {
    visits: [],
    reports: [],
    meds: []
};

let currentDate = new Date();
let selectedDate = null;

/* NAV */
function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    if (page === "visite") renderCalendar();
}

/* STORAGE */
function save() {
    localStorage.setItem("salutelink_pro", JSON.stringify(data));
}

function load() {
    const d = localStorage.getItem("salutelink_pro");
    if (d) data = JSON.parse(d);
}

/* CALENDAR */
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

        const date = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

        const has = data.visits.some(v => v.date === date);

        cal.innerHTML += `
            <div class="day ${has ? "hasEvent" : ""}"
            onclick="selectedDate='${date}'">
                ${d}
            </div>
        `;
    }
}

/* VISITE */
function addVisit() {

    if (!selectedDate) return;

    data.visits.push({
        date: selectedDate,
        note: visitNote.value,
        time: visitTime.value
    });

    visitNote.value = "";
    visitTime.value = "";

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

/* RENDER */
function renderAll() {

    visiteCount.innerText = data.visits.length;
    refertiCount.innerText = data.reports.length;
    farmaciCount.innerText = data.meds.length;

    visitList.innerHTML = data.visits.map(v =>
        `<div class="card">📅 ${v.date} ${v.time}<br>${v.note}</div>`
    ).join("");

    reportList.innerHTML = data.reports.map(r =>
        `<div class="card">📄 ${r.name}<br>${r.desc}</div>`
    ).join("");

    medList.innerHTML = data.meds.map(m =>
        `<div class="card">💊 ${m.name} - ${m.dose} - ${m.time}</div>`
    ).join("");

    timeline.innerHTML = [
        ...data.visits.map(v => `📅 ${v.date}`),
        ...data.reports.map(r => `📄 ${r.name}`),
        ...data.meds.map(m => `💊 ${m.name}`)
    ].map(x => `<div class="card">${x}</div>`).join("");
}

/* INIT */
window.onload = function () {
    load();
    renderAll();
};