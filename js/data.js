// ================================
// Application Data
// ================================

let associations = [];
let services = [];
let employees = [];

// ================================
// Load JSON Files
// ================================

async function loadData() {

    try{

        const assocResponse = await fetch("data/associations.json");
        associations = await assocResponse.json();

        const serviceResponse = await fetch("data/services.json");
        services = await serviceResponse.json();

        const employeeResponse = await fetch("data/employees.json");
        employees = await employeeResponse.json();

        console.log("Associations:", associations);
        console.log("Services:", services);
        console.log("Employees:", employees);

        if(typeof initializeUI === "function"){

            initializeUI();

        }

    }

    catch(error){

        console.error("Unable to load data.", error);

    }

}
