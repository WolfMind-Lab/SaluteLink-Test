let data = {
    visits: [],
    reports: [],
    meds: []
};

let chart;
let currentDate = new Date();
let selectedDate = null;

/* NAV */
function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    if (page === "visite") renderCalendar();
}

/* CALENDARIO */
function renderCalendar() {
    const calendar = document.getElementById("calendar");
    const monthLabel = document.getElementById("monthLabel");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthLabel.innerText =
        currentDate.toLocaleString("it-IT", { month: "long", year: "numeric" });

    calendar.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += `<div></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${month + 1}-${d}`;

        const hasEvent = data.visits.some(v => v.date === dateStr);

        calendar.innerHTML += `
            <div class="day ${hasEvent ? "hasEvent" : ""}"
                 onclick="selectDate('${dateStr}')">
                ${d}
            </div>
        `;
    }
}

function selectDate(date) {
    selectedDate = date;
    document.getElementById("selectedDateLabel").innerText =
        "Data: " + date;
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

/* VISITE */
function addVisitFromCalendar() {
    if (!selectedDate) return;

    const note = document.getElementById("visitNote").value;

    data.visits.push({
        date: selectedDate,
        note: note || "Visita"
    });

    save();
    renderAll();
    renderCalendar();
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

/* STORAGE */
function save() {
    localStorage.setItem("salutelink", JSON.stringify(data));
}

function load() {
    const saved = localStorage.getItem("salutelink");
    if (saved) data = JSON.parse(saved);
}

/* RENDER */
function renderAll() {
    visiteCount.innerText = data.visits.length;
    refertiCount.innerText = data.reports.length;
    farmaciCount.innerText = data.meds.length;

    visitList.innerHTML = data.visits.map(v =>
        `<div>📅 ${v.date} - ${v.note}</div>`
    ).join("");

    reportList.innerHTML = data.reports.map(r =>
        `<div>📄 ${r.name}</div>`
    ).join("");

    medList.innerHTML = data.meds.map(m =>
        `<div>💊 ${m.name}</div>`
    ).join("");

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
    load();
    renderAll();
};