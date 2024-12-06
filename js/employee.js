// Reference the employee table and modal elements
const employeeTable = document.querySelector("table tbody");
const addEmployeeForm = document.querySelector("#addEmployeeModal form");
const editEmployeeForm = document.querySelector("#editEmployeeModal form");
const searchInput = document.querySelector(".input-group input");
let selectedRow = null;  // Store the selected row for editing

// Add Employee Functionality
addEmployeeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const employeeNo = document.querySelector("#employeeNo").value;
    const firstName = document.querySelector("#firstName").value;
    const middleName = document.querySelector("#middleName").value;
    const lastName = document.querySelector("#lastName").value;
    const position = document.querySelector("#position").value;

    const newRow = `
        <tr>
            <td>${employeeNo}</td>
            <td>${firstName}</td>
            <td>${middleName}</td>
            <td>${lastName}</td>
            <td>${position}</td>
            <td>
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editEmployeeModal">Edit</button>
                <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal">Delete</button>
            </td>
        </tr>`;
    employeeTable.innerHTML += newRow;

    // Close modal and reset form
    document.querySelector("#addEmployeeModal .btn-close").click();
    addEmployeeForm.reset();
});

// Edit Employee Functionality
employeeTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-primary")) {
        const row = e.target.closest("tr");
        selectedRow = row;  // Store the selected row

        // Pre-fill the edit form with the current row data
        document.querySelector("#editEmployeeNo").value = row.cells[0].textContent;
        document.querySelector("#editFirstName").value = row.cells[1].textContent;
        document.querySelector("#editMiddleName").value = row.cells[2].textContent;
        document.querySelector("#editLastName").value = row.cells[3].textContent;
        document.querySelector("#editPosition").value = row.cells[4].textContent;
    }
});

// Save changes to employee when the Edit form is submitted
editEmployeeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (selectedRow) {
        selectedRow.cells[0].textContent = document.querySelector("#editEmployeeNo").value;
        selectedRow.cells[1].textContent = document.querySelector("#editFirstName").value;
        selectedRow.cells[2].textContent = document.querySelector("#editMiddleName").value;
        selectedRow.cells[3].textContent = document.querySelector("#editLastName").value;
        selectedRow.cells[4].textContent = document.querySelector("#editPosition").value;

        // Close the modal
        document.querySelector("#editEmployeeModal .btn-close").click();
    }
});

// Delete Employee Functionality
employeeTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-danger")) {
        const row = e.target.closest("tr");
        document.querySelector("#deleteEmployeeModal .btn-danger").onclick = function () {
            row.remove();
            document.querySelector("#deleteEmployeeModal .btn-close").click();
        };
    }
});

// Search Employee Functionality
searchInput.addEventListener("input", function () {
    const filter = searchInput.value.toLowerCase();
    Array.from(employeeTable.rows).forEach(function (row) {
        const name = row.cells[1].textContent.toLowerCase();
        const id = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(filter) || id.includes(filter) ? "" : "none";
    });
});
