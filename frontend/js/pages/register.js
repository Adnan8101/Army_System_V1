document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            showPopup('popup-success');
            document.getElementById('popup-success').querySelector('p').innerHTML = 'Your details have been sent to the army for approval.';
            setTimeout(() => {
                window.location.href = '/html/pages/login.html'; // Redirect to login page after 3 seconds
            }, 3000);
        } else {
            showPopup('popup-error');
            document.getElementById('popup-error').querySelector('p').innerHTML = result.msg || 'Error occurred during registration.';
        }
    } catch (error) {
        console.error('Error:', error);
        showPopup('popup-error');
    }
});

function showPopup(id) {
    document.getElementById(id).style.display = 'block';
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
}
