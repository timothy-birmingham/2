// ======================================================
// Vesta Billing Portal
// app.js
// Version 2
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

    return new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


function clearDropdown(selectElement, placeholder) {

    selectElement.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = placeholder;

    selectElement.appendChild(option);

}


function updateReceiptTotal() {

    const total = receiptItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
    );

    receiptTotal.textContent = formatMoney(total);

}


function getSelectedAssociation() {

    return associations.find(
        association =>
            association.id == associationSelect.value
    );

}


function getSelectedEmployee() {

    return employees.find(
        employee =>
            employee.id == employeeSelect.value
    );

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

    catch(error) {

        console.error(
            "Data loading error:",
            error
        );

        alert(
            "Unable to load portal data."
        );

    }

}


// ======================================================
// Dropdown Population
// ======================================================

function populateOfficeDropdown() {

    const offices = [
        ...new Set(
            associations.map(
                association => association.office
            )
        )
    ];


    offices.sort();


    offices.forEach(office => {

        const option = document.createElement("option");

        option.value = office;

        option.textContent = office;

        officeSelect.appendChild(option);

    });

}



function populateAssociationDropdown(office) {


    clearDropdown(
        associationSelect,
        "Select Association"
    );


    const filteredAssociations =
        associations.filter(
            association =>
                association.office === office
        );


    filteredAssociations.forEach(
        association => {

            const option =
                document.createElement("option");


            option.value =
                association.id;


            option.textContent =
                association.association;


            associationSelect.appendChild(option);

        }
    );


    associationSelect.disabled = false;

}



function populateEmployeeDropdown() {

    employees.forEach(employee => {

        const option =
            document.createElement("option");


        option.value =
            employee.id;


        option.textContent =
            employee.name;


        employeeSelect.appendChild(option);

    });

}



function populateServiceDropdown() {

    services.forEach(service => {

        const option =
            document.createElement("option");


        option.value =
            service.name;


        option.textContent =
            service.name;


        serviceSelect.appendChild(option);

    });

}


// ======================================================
// Service Preview
// ======================================================

function updateServicePreview() {

    const selectedService =
        services.find(
            service =>
                service.name === serviceSelect.value
        );


    const quantity =
        Number(quantityInput.value) || 1;


    if(!selectedService) {

        unitPrice.textContent = "$0.00";

        unitType.textContent = "-";

        lineTotal.textContent = "$0.00";

        return;

    }


    unitPrice.textContent =
        formatMoney(
            selectedService.price
        );


    unitType.textContent =
        selectedService.unit;


    lineTotal.textContent =
        formatMoney(
            selectedService.price * quantity
        );

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

            <td class="money">
                ${formatMoney(item.unitPrice)}
            </td>

            <td class="money">
                ${formatMoney(item.lineTotal)}
            </td>

            <td>
                <button 
                    class="delete-btn"
                    data-index="${index}">
                    Delete
                </button>
            </td>

        `;


        receiptTableBody.appendChild(row);

    });


    updateReceiptTotal();

}



// ======================================================
// Add Billing Item
// ======================================================

function addReceiptItem() {


    const service =
        services.find(
            service =>
                service.name === serviceSelect.value
        );


    if(!service) {

        alert(
            "Please select a service."
        );

        return;

    }


    const quantity =
        Number(quantityInput.value);


    if(!quantity || quantity <= 0) {

        alert(
            "Quantity must be greater than zero."
        );

        return;

    }


    const item = {

        service:
            service.name,

        quantity:
            quantity,

        unit:
            service.unit,

        unitPrice:
            service.price,

        lineTotal:
            quantity * service.price,

        notes:
            notesInput.value.trim()

    };


    receiptItems.push(item);


    renderReceipt();


    serviceSelect.value = "";

    quantityInput.value = 1;

    notesInput.value = "";


    updateServicePreview();

}



// ======================================================
// Delete Receipt Item
// ======================================================

function deleteReceiptItem(index) {


    receiptItems.splice(
        index,
        1
    );


    renderReceipt();

}



// ======================================================
// Clear Receipt
// ======================================================

function clearReceipt() {


    if(receiptItems.length === 0) {

        return;

    }


    if(
        !confirm(
            "Clear all billing items?"
        )
    ) {

        return;

    }


    receiptItems = [];


    renderReceipt();

}



// ======================================================
// Print Document Generator
// ======================================================

function generatePrintDocument() {


    const association =
        getSelectedAssociation();


    const employee =
        getSelectedEmployee();


    const total =
        receiptItems.reduce(
            (sum, item) =>
                sum + item.lineTotal,
            0
        );


    let rows = "";


    receiptItems.forEach(item => {


        rows += `

            <tr>

                <td>
                    ${item.service}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${item.unit}
                </td>

                <td>
                    ${formatMoney(item.unitPrice)}
                </td>

                <td>
                    ${formatMoney(item.lineTotal)}
                </td>

            </tr>

        `;

    });



    return `

<!DOCTYPE html>

<html>

<head>

<title>
Vesta Billing Request
</title>


<style>

body {

    font-family:
        Arial, sans-serif;

    padding:
        40px;

    color:
        #333;

}


h1 {

    text-align:
        center;

    color:
        #1f4e79;

}


.header {

    margin-bottom:
        30px;

}


.info {

    line-height:
        1.8;

}


table {

    width:
        100%;

    border-collapse:
        collapse;

    margin-top:
        30px;

}


th {

    background:
        #1f4e79;

    color:
        white;

    padding:
        10px;

    text-align:
        left;

}


td {

    border-bottom:
        1px solid #ddd;

    padding:
        10px;

}


.total {

    margin-top:
        30px;

    text-align:
        right;

    font-size:
        22px;

    font-weight:
        bold;

}


.footer {

    margin-top:
        80px;

}


</style>


</head>


<body>


<h1>
Vesta Billing Request
</h1>


<div class="header">


<div class="info">

<strong>Date:</strong>
${getTodayString()}
<br>


<strong>Office:</strong>
${officeSelect.value}
<br>


<strong>Association:</strong>
${association ? association.association : ""}
<br>


<strong>Prepared By:</strong>
${employee ? employee.name : ""}


</div>


</div>



<table>


<thead>

<tr>

<th>
Service
</th>

<th>
Qty
</th>

<th>
Unit
</th>

<th>
Unit Price
</th>

<th>
Total
</th>

</tr>

</thead>


<tbody>

${rows}

</tbody>


</table>



<div class="total">

Total:
${formatMoney(total)}

</div>



<div class="footer">

Prepared By Signature:
_____________________________

</div>



</body>

</html>

`;

}



// ======================================================
// Print Function
// ======================================================

function printReceipt() {


    if(receiptItems.length === 0) {

        alert(
            "There are no billing items to print."
        );

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    printWindow.document.write(
        generatePrintDocument()
    );


    printWindow.document.close();


    printWindow.focus();


    printWindow.print();


}

// ======================================================
// PDF Export
// ======================================================

function exportPDF() {

    if (receiptItems.length === 0) {

        alert("There are no billing items to export.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const association = getSelectedAssociation();
    const employee = getSelectedEmployee();

    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("VESTA BILLING REQUEST", 105, y, { align: "center" });

    y += 15;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Date: ${getTodayString()}`, 15, y);
    y += 7;

    doc.text(`Office: ${officeSelect.value}`, 15, y);
    y += 7;

    doc.text(
        `Association: ${association ? association.association : ""}`,
        15,
        y
    );
    y += 7;

    doc.text(
        `Prepared By: ${employee ? employee.name : ""}`,
        15,
        y
    );

    y += 12;

    doc.setFont("helvetica", "bold");

    doc.text("Service", 15, y);
    doc.text("Qty", 95, y);
    doc.text("Unit", 115, y);
    doc.text("Price", 145, y);
    doc.text("Total", 175, y);

    y += 4;

    doc.line(15, y, 195, y);

    y += 8;

    doc.setFont("helvetica", "normal");

    let grandTotal = 0;

    receiptItems.forEach(item => {

        doc.text(item.service, 15, y);

        doc.text(String(item.quantity), 95, y);

        doc.text(item.unit, 115, y);

        doc.text(formatMoney(item.unitPrice), 145, y);

        doc.text(formatMoney(item.lineTotal), 175, y);

        grandTotal += item.lineTotal;

        y += 8;

        if (y > 270) {

            doc.addPage();

            y = 20;

        }

    });

    y += 5;

    doc.line(15, y, 195, y);

    y += 10;

    doc.setFont("helvetica", "bold");

    doc.text(
        `TOTAL: ${formatMoney(grandTotal)}`,
        145,
        y
    );

    doc.save("Vesta Billing Request.pdf");

}

// ======================================================
// Event Listeners
// ======================================================

officeSelect.addEventListener(
    "change",
    () => {

        if(!officeSelect.value) {

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

    }
);



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



receiptTableBody.addEventListener(
    "click",
    event => {


        if(
            !event.target.classList.contains(
                "delete-btn"
            )
        ) {

            return;

        }


        deleteReceiptItem(
            Number(
                event.target.dataset.index
            )
        );


    }
);



clearReceiptButton.addEventListener(
    "click",
    clearReceipt
);

printButton.addEventListener(
    "click",
    printReceipt
);

exportButton.addEventListener(
    "click",
    exportPDF
);

// ======================================================
// Application Startup
// ======================================================

function initialize() {


    todayDate.textContent =
        getTodayString();


    quantityInput.value = 1;


    updateServicePreview();


    loadData();


}


initialize();
