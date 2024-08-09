document.addEventListener('DOMContentLoaded', function() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const userIdInput = document.getElementById('userId');
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    userIdInput.value = uid; // Set the UID in the input field

    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const value = event.target.value;
            if (value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
    });

    document.getElementById('otpVerificationForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        const userId = userIdInput.value;
        console.log(`Entered OTP: ${otp}`); // Log the entered OTP for debugging

        try {
            const response = await fetch('/api/password/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, otp }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(`Server OTP: ${otp}`); // Log the server OTP for debugging
                window.location.href = `/reset-password?email=${urlParams.get('email')}&uid=${uid}`;
            } else {
                document.getElementById('message').textContent = result.error || 'Error verifying OTP';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('message').textContent = 'Unexpected error occurred';
        }
    });
});
