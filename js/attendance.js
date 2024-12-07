// Check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../login.html';
}

// Function to load and display attendance records
async function loadAttendance() {
    try {
        const response = await fetch('http://localhost:5000/api/attendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const attendance = await response.json();
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = '';

        attendance.forEach(record => {
            // Format date and time
            const date = new Date(record.date).toLocaleDateString();
            const timeIn = record.status === 'ABSENT' ? '-' : new Date(record.timeIn).toLocaleTimeString();
            const timeOut = record.timeOut ? new Date(record.timeOut).toLocaleTimeString() : '-';

            // Set row color based on status
            let rowClass = '';
            if (record.status === 'LATE') rowClass = 'table-warning';
            if (record.status === 'ABSENT') rowClass = 'table-danger';

            tableBody.innerHTML += `
                <tr class="${rowClass}">
                    <td>${record.employeeNo}</td>
                    <td>${record.firstName} ${record.lastName}</td>
                    <td>${date}</td>
                    <td>${timeIn}</td>
                    <td>${timeOut}</td>
                    <td>${record.status}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading attendance:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error loading attendance records'
        });
    }
}

// Search functionality
document.getElementById('searchEmployee').addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();
    const rows = document.querySelector('tbody').getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    });
});

// Mark Absent function
async function markAbsent() {
    const employeeNo = document.getElementById('employeeNo').value;
    
    if (!employeeNo) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please enter an employee number'
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/attendance/mark-absent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ employeeNo })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Employee marked as absent successfully'
            });
            document.getElementById('employeeNo').value = ''; // Clear input
            loadAttendance(); // Refresh the table
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error marking absent'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error marking absent'
        });
    }
}

// Add event listener for absent button
document.getElementById('absentBtn').addEventListener('click', markAbsent);

// Load attendance when the page loads
document.addEventListener('DOMContentLoaded', loadAttendance);