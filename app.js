// =========================================
// Vesta Billing Portal
// Version 1
// =========================================

// ----------------------
// Application Data
// ----------------------

let associations = [];
let employees = [];
let services = [];
let receipt = [];

// ----------------------
// HTML Elements
// ----------------------

const officeSelect = document.getElementById("officeSelect");
const associationSelect = document.getElementById("associationSelect");
const employeeSelect = document.getElementById("employeeSelect");
const serviceSelect = document.getElementById("serviceSelect");

const todayDate = document.getElementById("todayDate");

// ----------------------
// Startup
// ----------------------

document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {

    todayDate.textContent = new Date().toLocaleDateString();

    await loadData();

    populateOffices();

    populateEmployees();

    populateServices();

    setupEvents();

}

// ----------------------
// Load JSON Files
// ----------------------

async function loadData() {

    try {

        const associationResponse =
            await fetch("data/associations.json");

        associations =
            await associationResponse.json();

        const employeeResponse =
            await fetch("data/employees.json");

        employees =
            await employeeResponse.json();

        const serviceResponse =
            await fetch("data/services.json");

        services =
            await serviceResponse.json();

        console.log("Associations:", associations);
        console.log("Employees:", employees);
        console.log("Services:", services);

    }

    catch(error){

        console.error("Unable to load JSON files.", error);

    }

}

// ----------------------
// Populate Offices
// ----------------------

function populateOffices(){

    officeSelect.innerHTML =
        '<option value="">Select Office</option>';

    const offices =
        [...new Set(associations.map(a => a.office))];

    offices.sort();

    offices.forEach(office=>{

        const option =
            document.createElement("option");

        option.value = office;

        option.textContent = office;

        officeSelect.appendChild(option);

    });

}

// ----------------------
// Populate Employees
// ----------------------

function populateEmployees(){

    employeeSelect.innerHTML =
        '<option value="">Select Employee</option>';

    employees.forEach(employee=>{

        const option =
            document.createElement("option");

        option.value = employee.id;

        option.textContent = employee.name;

        employeeSelect.appendChild(option);

    });

}

// ----------------------
// Populate Services
// ----------------------

function populateServices(){

    serviceSelect.innerHTML =
        '<option value="">Select Service</option>';

    services.sort((a,b)=>
        a.name.localeCompare(b.name)
    );

    services.forEach(service=>{

        const option =
            document.createElement("option");

        option.value = service.id;

        option.textContent =
            `${service.name} ($${service.price.toFixed(2)} / ${service.unit})`;

        serviceSelect.appendChild(option);

    });

}

// ----------------------
// Events
// ----------------------

function setupEvents(){

    officeSelect.addEventListener(
        "change",
        officeChanged
    );

}

// ----------------------
// Office Changed
// ----------------------

function officeChanged(){

    associationSelect.innerHTML =
        '<option value="">Select Association</option>';

    associationSelect.disabled = true;

    if(!officeSelect.value)
        return;

    const filtered =
        associations.filter(a =>
            a.office === officeSelect.value
        );

    filtered.forEach(association=>{

        const option =
            document.createElement("option");

        option.value =
            association.id;

        option.textContent =
            association.association;

        associationSelect.appendChild(option);

    });

    associationSelect.disabled = false;

}
