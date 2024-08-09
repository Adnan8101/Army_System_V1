document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const email = urlParams.get('email');

    document.getElementById('uid').value = uid;
    document.getElementById('email').value = email;
    console.log(`Loaded UID: ${uid}, Email: ${email}`);

    document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const uid = document.getElementById('uid').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            document.getElementById('resetPasswordMessage').textContent = 'Passwords do not match';
            console.error('Passwords do not match');
            return;
        }

        console.log(`Resetting password for UID: ${uid}, Email: ${email}, New Password: ${newPassword}`);

        try {
            const response = await fetch('/api/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, uid, newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                document.getElementById('resetPasswordMessage').textContent = 'Password reset successfully';
                console.log('Password reset successfully');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else {
                document.getElementById('resetPasswordMessage').textContent = result.error || 'Error resetting password';
                console.error('Error resetting password:', result.error);
            }
        } catch (error) {
            console.error('Unexpected error occurred:', error);
            document.getElementById('resetPasswordMessage').textContent = 'Unexpected error occurred';
        }
    });
});
