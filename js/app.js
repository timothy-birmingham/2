document.addEventListener("DOMContentLoaded", () => {

    // Cache page controls

    window.officeSelect =
        document.getElementById("officeSelect");

    window.associationSelect =
        document.getElementById("associationSelect");

    window.employeeSelect =
        document.getElementById("employeeSelect");

    window.serviceSelect =
        document.getElementById("serviceSelect");

    window.quantityInput =
        document.getElementById("quantityInput");

    window.notesInput =
        document.getElementById("notesInput");

    window.addItemButton =
        document.getElementById("addItemButton");

    window.receiptTable =
        document.querySelector("#receiptTable tbody");

    window.receiptTotal =
        document.getElementById("receiptTotal");

    window.todayDate =
        document.getElementById("todayDate");

    todayDate.textContent =
        new Date().toLocaleDateString();

    loadData();

});
