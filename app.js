// ======================================================
// Vesta Billing Portal
// app.js
// Part 1 of 2
// ======================================================

// ======================================================
// Global State
// ======================================================

let associations = [];
let employees = [];
let services = [];

let receiptItems = [];

// ======================================================
// Cached DOM Elements
// ======================================================

const todayDate = document.getElementById("todayDate");

const officeSelect = document.getElementById("officeSelect");
const associationSelect = document.getElementById("associationSelect");
const employeeSelect = document.getElementById("employeeSelect");
const serviceSelect = document.getElementById("serviceSelect");

const quantityInput = document.getElementById("quantityInput");
const notesInput = document.getElementById("notesInput");

const unitPrice = document.getElementById("unitPrice");
const unitType = document.getElementById("unitType");
const lineTotal = document.getElementById("lineTotal");

const addItemButton = document.getElementById("addItemButton");

const receiptTableBody = document.querySelector("#receiptTable tbody");
const receiptTotal = document.getElementById("receiptTotal");

const clearReceiptButton = document.getElementById("clearReceipt");
const printButton = document.getElementById("printButton");
const exportButton = document.getElementById("exportButton");

// ======================================================
// Utility Functions
// ======================================================

function formatMoney(value) {
    return "$" + Number(value).toFixed(2);
}

function getTodayString() {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    return new Date().toLocaleDateString("en-US", options);

}

function clearDropdown(selectElement, placeholder) {

    selectElement.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = placeholder;

    selectElement.appendChild(option);

}

function updateReceiptTotal() {

    const total = receiptItems.reduce((sum, item) => {

        return sum + item.lineTotal;

    }, 0);

    receiptTotal.textContent = formatMoney(total);

}

// ======================================================
// Data Loading
// ======================================================

async function loadData() {

    try {

        const [
            associationsResponse,
            employeesResponse,
            servicesResponse
        ] = await Promise.all([

            fetch("data/associations.json"),
            fetch("data/employees.json"),
            fetch("data/services.json")

        ]);

        associations = await associationsResponse.json();
        employees = await employeesResponse.json();
        services = await servicesResponse.json();

        populateOfficeDropdown();
        populateEmployeeDropdown();
        populateServiceDropdown();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load JSON data.");

    }

}

// ======================================================
// Populate Dropdowns
// ======================================================

function populateOfficeDropdown() {

    const offices = [...new Set(

        associations.map(a => a.office)

    )].sort();

    offices.forEach(office => {

        const option = document.createElement("option");

        option.value = office;
        option.textContent = office;

        officeSelect.appendChild(option);

    });

}

function populateAssociationDropdown(selectedOffice) {

    clearDropdown(

        associationSelect,
        "Select Association"

    );

    const filtered = associations.filter(a =>

        a.office === selectedOffice

    );

    filtered
        .sort((a, b) =>

            a.association.localeCompare(b.association)

        )
        .forEach(association => {

            const option = document.createElement("option");

            option.value = association.id;
            option.textContent = association.association;

            associationSelect.appendChild(option);

        });

    associationSelect.disabled = false;

}

function populateEmployeeDropdown() {

    employees
        .sort((a, b) =>

            a.name.localeCompare(b.name)

        )
        .forEach(employee => {

            const option = document.createElement("option");

            option.value = employee.id;
            option.textContent = employee.name;

            employeeSelect.appendChild(option);

        });

}

function populateServiceDropdown() {

    services
        .sort((a, b) =>

            a.name.localeCompare(b.name)

        )
        .forEach(service => {

            const option = document.createElement("option");

            option.value = service.name;
            option.textContent = service.name;

            serviceSelect.appendChild(option);

        });

}

// ======================================================
// Service Preview
// ======================================================

function updateServicePreview() {

    const serviceName = serviceSelect.value;

    const quantity = Number(quantityInput.value) || 1;

    if (!serviceName) {

        unitPrice.textContent = "$0.00";
        unitType.textContent = "-";
        lineTotal.textContent = "$0.00";

        return;

    }

    const service = services.find(s =>

        s.name === serviceName

    );

    if (!service) return;

    const total = quantity * service.price;

    unitPrice.textContent = formatMoney(service.price);
    unitType.textContent = service.unit;
    lineTotal.textContent = formatMoney(total);

}

// ======================================================
// Receipt Logic
// ======================================================

function renderReceipt() {

    receiptTableBody.innerHTML = "";

    receiptItems.forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.service}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td class="money">${formatMoney(item.unitPrice)}</td>
            <td class="money">${formatMoney(item.lineTotal)}</td>
            <td>
                <button class="delete-btn" data-index="${index}">
                    Delete
                </button>
            </td>
        `;

        receiptTableBody.appendChild(row);

    });

    updateReceiptTotal();

}

function addReceiptItem() {

    if (!officeSelect.value) {
        alert("Please select an office.");
        return;
    }

    if (!associationSelect.value) {
        alert("Please select an association.");
        return;
    }

    if (!employeeSelect.value) {
        alert("Please select the employee preparing this billing.");
        return;
    }

    if (!serviceSelect.value) {
        alert("Please select a service.");
        return;
    }

    const quantity = Number(quantityInput.value);

    if (!quantity || quantity <= 0) {
        alert("Quantity must be greater than zero.");
        return;
    }

    const service = services.find(s => s.name === serviceSelect.value);

    if (!service) return;

    const item = {

        service: service.name,
        quantity: quantity,
        unit: service.unit,
        unitPrice: service.price,
        lineTotal: quantity * service.price,
        notes: notesInput.value.trim()

    };

    receiptItems.push(item);

    renderReceipt();

    serviceSelect.value = "";
    quantityInput.value = 1;
    notesInput.value = "";

    updateServicePreview();

}

function deleteReceiptItem(index) {

    receiptItems.splice(index, 1);

    renderReceipt();

}

function clearReceipt() {

    if (receiptItems.length === 0) return;

    const confirmed = confirm(
        "Clear all receipt items?"
    );

    if (!confirmed) return;

    receiptItems = [];

    renderReceipt();

}

// ======================================================
// Event Listeners
// ======================================================

officeSelect.addEventListener("change", () => {

    if (!officeSelect.value) {

        associationSelect.disabled = true;

        clearDropdown(
            associationSelect,
            "Select Association"
        );

        return;

    }

    populateAssociationDropdown(
        officeSelect.value
    );

});

serviceSelect.addEventListener(
    "change",
    updateServicePreview
);

quantityInput.addEventListener(
    "input",
    updateServicePreview
);

addItemButton.addEventListener(
    "click",
    addReceiptItem
);

receiptTableBody.addEventListener("click", (event) => {

    if (!event.target.classList.contains("delete-btn")) return;

    const index = Number(
        event.target.dataset.index
    );

    deleteReceiptItem(index);

});

clearReceiptButton.addEventListener(
    "click",
    clearReceipt
);

printButton.addEventListener("click", () => {

    window.print();

});

exportButton.addEventListener("click", () => {

    alert("PDF export coming soon.");

});

// ======================================================
// Initialization
// ======================================================

function initialize() {

    todayDate.textContent = getTodayString();

    quantityInput.value = 1;

    updateServicePreview();

    loadData();

}

initialize();
