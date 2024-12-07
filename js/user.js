// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../login.html';
}

// Function to load and display employee statistics
async function loadEmployeeStats() {
    try {
        // Show loading state
        Swal.fire({
            title: 'Loading...',
            text: 'Fetching employee statistics',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        // Fetch all employees
        const employeeResponse = await fetch('http://localhost:5000/api/employees', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const employees = await employeeResponse.json();

        // Fetch all attendance records for the current month
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const attendanceResponse = await fetch(`http://localhost:5000/api/attendance/date-range?startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const attendance = await attendanceResponse.json();

        // Process statistics for each employee
        const tableBody = document.getElementById('employeeTable');
        tableBody.innerHTML = '';

        employees.forEach(employee => {
            // Filter attendance records for this employee
            const employeeAttendance = attendance.filter(record => 
                record.employeeNo === employee.employeeNo
            );

            // Count different status types
            const presentCount = employeeAttendance.filter(record => 
                record.status === 'PRESENT'
            ).length;

            const lateCount = employeeAttendance.filter(record => 
                record.status === 'LATE'
            ).length;

            const absentCount = employeeAttendance.filter(record => 
                record.status === 'ABSENT'
            ).length;

            // Add row to table
            tableBody.innerHTML += `
                <tr>
                    <td>${employee.employeeNo}</td>
                    <td>${employee.firstName} ${employee.middleName || ''} ${employee.lastName}</td>
                    <td>${employee.position}</td>
                    <td>${presentCount}</td>
                    <td>${lateCount}</td>
                    <td>${absentCount}</td>
                </tr>
            `;
        });

        // Close loading indicator after data is loaded
        Swal.close();

    } catch (error) {
        console.error('Error loading employee statistics:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error loading employee statistics',
            timer: 3000,
            timerProgressBar: true
        });
    }
}

// Search functionality
document.getElementById('searchEmployee').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const rows = document.getElementById('employeeTable').getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    });
});

// Load statistics when the page loads
document.addEventListener('DOMContentLoaded', loadEmployeeStats);
