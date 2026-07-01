let associations = [];
let pricing = {};

// HTML Elements
const officeSelect = document.getElementById("officeSelect");
const associationSelect = document.getElementById("associationSelect");
const associationInfo = document.getElementById("associationInfo");

// Load JSON files when page opens
window.addEventListener("DOMContentLoaded", loadData);

async function loadData() {

    try {

        // Load association data
        const assocResponse = await fetch("data/associations.json");
        associations = await assocResponse.json();

        // Load pricing
        const priceResponse = await fetch("data/pricing.json");
        pricing = await priceResponse.json();

        populateOfficeDropdown();

    }
    catch (err) {

        associationInfo.innerHTML =
            "<p style='color:red;'>Unable to load data.</p>";

        console.error(err);

    }

}

// Populate Office Dropdown
function populateOfficeDropdown() {

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

// Office Changed
officeSelect.addEventListener("change", () => {

    const selectedOffice = officeSelect.value;

    associationSelect.innerHTML =
        '<option value="">Select Association...</option>';

    associationSelect.disabled = true;

    associationInfo.innerHTML =
        "<p>Select an association to view details.</p>";

    if (!selectedOffice)
        return;

    const filtered = associations.filter(a =>
        a.office === selectedOffice
    );

    filtered.forEach(a => {

        const option = document.createElement("option");

        option.value = a.id;
        option.textContent = a.association;

        associationSelect.appendChild(option);

    });

    associationSelect.disabled = false;

});

// Association Changed
associationSelect.addEventListener("change", () => {

    const id = Number(associationSelect.value);

    if (!id) {

        associationInfo.innerHTML =
            "<p>Select an association to view details.</p>";

        return;

    }

    const assoc = associations.find(a => a.id === id);

    displayAssociation(assoc);

});

// Display Information
function displayAssociation(assoc) {

    let total = 0;

    let servicesHTML = "";

    assoc.services.forEach(service => {

        servicesHTML +=
            `<span class="service">${service}</span>`;

        total += pricing[service] || 0;

    });

    associationInfo.innerHTML = `

        <div class="info-row">
            <strong>Association</strong>
            <span>${assoc.association}</span>
        </div>

        <div class="info-row">
            <strong>Office</strong>
            <span>${assoc.office}</span>
        </div>

        <div class="info-row">
            <strong>Manager</strong>
            <span>${assoc.manager}</span>
        </div>

        <div class="info-row">
            <strong>Units</strong>
            <span>${assoc.units}</span>
        </div>

        <br>

        <strong>Services</strong>

        <div style="margin-top:10px;">
            ${servicesHTML}
        </div>

        <div class="total">
            Monthly Total: $${total}
        </div>

    `;

}
