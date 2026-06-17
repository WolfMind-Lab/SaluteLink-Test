let data = [];

function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    render();
}

function addItem() {

    data.push({
        type: type.value,
        title: title.value,
        desc: desc.value,
        date: date.value,
        time: time.value
    });

    title.value = "";
    desc.value = "";
    date.value = "";
    time.value = "";

    render();
}

function render() {

    const today = new Date().toISOString().split("T")[0];

    todayFeed.innerHTML = data
        .filter(i => i.date === today)
        .map(i => `<div class="card">${i.title} (${i.type})</div>`)
        .join("");

    upcoming.innerHTML = data
        .filter(i => i.date >= today)
        .slice(0, 5)
        .map(i => `<div class="card">${i.title} - ${i.date}</div>`)
        .join("");

    archiveList.innerHTML = data
        .map(i => `<div class="card">${i.type} - ${i.title}<br>${i.date}</div>`)
        .join("");

    renderCalendar();
}

function renderCalendar() {

    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    for (let i = 1; i <= 30; i++) {

        const day = String(i).padStart(2,'0');

        const count = data.filter(x => x.date?.endsWith(`-${day}`)).length;

        grid.innerHTML += `
            <div class="card">
                ${day} ${count ? "●" : ""}
            </div>
        `;
    }
}

render();