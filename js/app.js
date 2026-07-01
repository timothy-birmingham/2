document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("todayDate").textContent =
        new Date().toLocaleDateString();

    loadData();

});
