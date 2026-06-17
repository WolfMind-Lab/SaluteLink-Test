function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

/* PROFILO */
function saveProfile() {
    localStorage.setItem("name", name.value);
    localStorage.setItem("age", age.value);

    profileView.innerText = name.value + " - " + age.value;
}

/* VISITE */
function addVisit() {
    localStorage.setItem("visit", visitDate.value);
    visitView.innerText = "Visita: " + visitDate.value;
    update();
}

/* REFERTI */
function addReport() {
    let li = document.createElement("li");
    li.textContent = reportType.value + " - " + reportInput.value;

    reportList.appendChild(li);

    localStorage.setItem("reports", reportList.innerHTML);
    update();
}

/* FARMACI */
function addMed() {
    let li = document.createElement("li");
    li.textContent = medInput.value;

    medList.appendChild(li);

    localStorage.setItem("meds", medList.innerHTML);
    update();
}

/* DASHBOARD */
let chart;

function update() {

    visiteCount.innerText = localStorage.getItem("visit") ? 1 : 0;
    refertiCount.innerText = reportList.children.length;
    farmaciCount.innerText = medList.children.length;

    drawChart();
}

/* GRAFICO */
function drawChart() {

    let v = visiteCount.innerText;
    let r = refertiCount.innerText;
    let m = farmaciCount.innerText;

    if (!chart) {
        chart = new Chart(document.getElementById("chart"), {
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

    if (localStorage.getItem("name")) {
        profileView.innerText =
            localStorage.getItem("name") + " - " + localStorage.getItem("age");
    }

    visitView.innerText =
        "Visita: " + (localStorage.getItem("visit") || "nessuna");

    reportList.innerHTML = localStorage.getItem("reports") || "";
    medList.innerHTML = localStorage.getItem("meds") || "";

    update();

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
};