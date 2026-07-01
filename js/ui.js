// ===============================
// UI Initialization
// ===============================

function initializeUI() {

    populateOffices();

    populateEmployees();

    populateServices();

    setupEventListeners();

}

// ===============================
// Populate Office Dropdown
// ===============================

function populateOffices() {

    officeSelect.innerHTML =
        '<option value="">Select Office</option>';

    const offices = [...new Set(
        associations.map(a => a.office)
    )];

    offices.sort();

    offices.forEach(office => {

        const option = document.createElement("option");

        option.value = office;
        option.textContent = office;

        officeSelect.appendChild(option);

    });

}

// ===============================
// Populate Employees
// ===============================

function populateEmployees() {

    employeeSelect.innerHTML =
        '<option value="">Select Employee</option>';

    employees.forEach(employee => {

        const option = document.createElement("option");

        option.value = employee.id;

        option.textContent = employee.name;

        employeeSelect.appendChild(option);

    });

}

// ===============================
// Populate Services
// ===============================

function populateServices() {

    serviceSelect.innerHTML =
        '<option value="">Select Service</option>';

    services
        .sort((a,b)=>a.name.localeCompare(b.name))
        .forEach(service=>{

            const option=document.createElement("option");

            option.value=service.id;

            option.textContent=
                `${service.name} ($${service.price.toFixed(2)}/${service.unit})`;

            serviceSelect.appendChild(option);

        });

}

// ===============================
// Event Listeners
// ===============================

function setupEventListeners(){

    officeSelect.addEventListener("change", officeChanged);

}

// ===============================
// Office Changed
// ===============================

function officeChanged(){

    associationSelect.innerHTML =
        '<option value="">Select Association</option>';

    associationSelect.disabled=true;

    if(!officeSelect.value)
        return;

    const filtered =
        associations.filter(a =>
            a.office === officeSelect.value
        );

    filtered.forEach(association=>{

        const option=document.createElement("option");

        option.value=association.id;

        option.textContent=association.association;

        associationSelect.appendChild(option);

    });

    associationSelect.disabled=false;

}
