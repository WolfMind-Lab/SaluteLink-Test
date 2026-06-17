function go(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

/* PROFILO */
function saveProfile() {
    localStorage.setItem("name", name.value);
    localStorage.setItem("age", age.value);

    profileView.innerText = name.value + " - " + age.value + " anni";
}

/* VISITE */
function addVisit() {
    let date = visitDate.value;
    if (!date) return;

    localStorage.setItem("visit", date);
    visitView.innerText = "Visita: " + date;

    notify("Visita programmata: " + date);

    update();
}

/* REFERTI */
function addReport() {
    if (!reportInput.value) return;

    let li = document.createElement("li");
    li.textContent = reportType.value + " - " + reportInput.value;

    reportList.appendChild(li);

    save("reports", reportList);

    update();
}

/* FARMACI */
function addMed() {
    if (!medInput.value) return;

    let li = document.createElement("li");
    li.textContent = medInput.value;

    medList.appendChild(li);

    save("meds", medList);

    update();
}

/* STORAGE */
function save(key, el) {
    localStorage.setItem(key, el.innerHTML);
}

/* NOTIFICHE (PRO FEATURE) */
function notify(text) {
    if ("Notification" in window) {
        Notification.requestPermission().then(p => {
            if (p === "granted") {
                new Notification("SaluteLink", { body: text });
            }
        });
    }
}

/* UPDATE DASHBOARD */
function update() {

    visiteCount.innerText = localStorage.getItem("visit") ? 1 : 0;
    refertiCount.innerText = reportList.children.length;
    farmaciCount.innerText = medList.children.length;
}

/* LOAD */
window.onload = function () {

    if (localStorage.getItem("name")) {
        profileView.innerText =
            localStorage.getItem("name") +
            " - " +
            localStorage.getItem("age") +
            " anni";
    }

    visitView.innerText =
        "Visita: " + (localStorage.getItem("visit") || "nessuna");

    reportList.innerHTML = localStorage.getItem("reports") || "";
    medList.innerHTML = localStorage.getItem("meds") || "";

    update();
};