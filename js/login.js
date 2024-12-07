document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.admin.username);

            // Show success message and then redirect
            await Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back ' + data.admin.username,
                timer: 2000,
                timerProgressBar: true
            });

            // Redirect to dashboard after the alert
            window.location.href = '../htmls/attendance.html';
        } else {
            // Show error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message || 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred. Please try again.'
        });
    }
});

// Add this to protect routes
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }
} 

// Success Alert
Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: 'Your action was completed successfully',
    timer: 3000,
    timerProgressBar: true
});

// Error Alert
Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!'
});

// Warning Alert
Swal.fire({
    icon: 'warning',
    title: 'Warning',
    text: 'Are you sure you want to proceed?',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
});

// Info Alert
Swal.fire({
    icon: 'info',
    title: 'Information',
    text: 'Here is some important information'
}); 