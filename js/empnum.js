// Function to update the date and time
window.onload = function() {
    updateDateTime();
    // Update the time every second
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString();
}

async function timeIn() {
    const employeeNo = document.querySelector('input[type="text"]').value;
    
    if (!employeeNo) {
        Swal.fire({
            icon: 'warning',
            title: 'Input Required',
            text: 'Please enter an employee number',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/attendance/time-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ employeeNo })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Time in recorded successfully',
                timer: 1500,
                showConfirmButton: false
            });
            document.querySelector('input[type="text"]').value = ''; // Clear input
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error recording time in'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error recording time in'
        });
    }
}

async function timeOut() {
    const employeeNo = document.querySelector('input[type="text"]').value;
    
    if (!employeeNo) {
        Swal.fire({
            icon: 'warning',
            title: 'Input Required',
            text: 'Please enter an employee number',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/attendance/time-out', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ employeeNo })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Time out recorded successfully',
                timer: 1500,
                showConfirmButton: false
            });
            document.querySelector('input[type="text"]').value = ''; // Clear input
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error recording time out'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error recording time out'
        });
    }
} 