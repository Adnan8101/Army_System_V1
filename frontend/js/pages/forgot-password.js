document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    try {
        const response = await fetch('/api/password/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('userId', data.uid);  // Store user ID in local storage
            window.location.href = `/otp-verification?email=${data.email}&uid=${data.uid}`;
        } else {
            document.getElementById('forgotPasswordMessage').innerHTML = result.msg;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('forgotPasswordMessage').innerHTML = 'An error occurred. Please try again.';
    }
});
