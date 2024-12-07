// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../login.html';
}

function logout() {
    // Clear any stored session data
    sessionStorage.clear();
    localStorage.clear();
    
    // Replace current URL with login page (prevents going back)
    window.location.replace('../emnum.html');
    
    // For additional security, disable back button
    window.history.pushState(null, '', '../emnum.html');
    window.addEventListener('popstate', function() {
        window.history.pushState(null, '', '../emnum.html');
    });
}

// Add Employee Form Handler
document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeData = {
        employeeNo: document.getElementById('employeeNo').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        lastName: document.getElementById('lastName').value,
        position: document.getElementById('position').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(employeeData)
        });

        const data = await response.json();

        if (response.ok) {
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
            modal.hide();

            // Refresh the employee list
            loadEmployees();

            // Reset the form
            document.getElementById('addEmployeeForm').reset();

            // Delayed success alert
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Employee added successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            }, 500);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.message || 'Error adding employee'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error adding employee'
        });
    }
});

// Function to load employees
async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:5000/api/employees', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const employees = await response.json();
        const tableBody = document.getElementById('employeeTable');
        tableBody.innerHTML = '';

        employees.forEach(employee => {
            tableBody.innerHTML += `
                <tr>
                    <td>${employee.employeeNo}</td>
                    <td>${employee.firstName}</td>
                    <td>${employee.middleName || ''}</td>
                    <td>${employee.lastName}</td>
                    <td>${employee.position}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editEmployee('${employee._id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${employee._id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading employees:', error);
        alert('Error loading employees');
    }
}

// Delete Employee Function
async function deleteEmployee(id) {
    // Replace confirmation modal with SweetAlert
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadEmployees();
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Employee has been deleted.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }, 500);
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: data.message || 'Error deleting employee'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error deleting employee'
            });
        }
    }
}

// Edit Employee Function
async function editEmployee(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const employee = await response.json();
        
        if (!employee) {
            throw new Error('Employee not found');
        }

        // Populate the edit form
        document.getElementById('editEmployeeNo').value = employee.employeeNo;
        document.getElementById('editFirstName').value = employee.firstName;
        document.getElementById('editMiddleName').value = employee.middleName || '';
        document.getElementById('editLastName').value = employee.lastName;
        document.getElementById('editPosition').value = employee.position;

        // Store the employee ID for the update
        document.getElementById('editEmployeeForm').dataset.employeeId = id;

        // Show the edit modal
        const editModal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
        editModal.show();
    } catch (error) {
        console.error('Error loading employee:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error loading employee details: ' + error.message
        });
    }
}

// Edit Form Submit Handler
document.getElementById('editEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = e.target.dataset.employeeId;
    const employeeData = {
        firstName: document.getElementById('editFirstName').value,
        middleName: document.getElementById('editMiddleName').value,
        lastName: document.getElementById('editLastName').value,
        position: document.getElementById('editPosition').value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(employeeData)
        });

        if (response.ok) {
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal'));
            modal.hide();

            // Refresh the employee list
            loadEmployees();

            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Employee updated successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            }, 500);
        } else {
            const data = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.message || 'Error updating employee'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error updating employee'
        });
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();

    // Reset edit form when modal is closed
    document.getElementById('editEmployeeModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('editEmployeeForm').reset();
    });

    // Reset delete modal when closed
    document.getElementById('deleteEmployeeModal').addEventListener('hidden.bs.modal', function () {
        document.querySelector('#deleteEmployeeModal .btn-danger').onclick = null;
    });
});

// Search functionality
document.getElementById('searchEmployee').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const rows = document.getElementById('employeeTable').getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    });
});
