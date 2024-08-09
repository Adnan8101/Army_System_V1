document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const section = link.getAttribute('onclick').match(/showSection\('(\w+)'\)/)[1];
            showSection(section);
        });
    });

    // Load initial data for the home section
    loadHomeData();

    // Add event listener to create order form
    const createOrderForm = document.getElementById('create-order');
    createOrderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        createOrder();
    });

    // Load pending registrations initially
    loadPendingRegistrations();
});

function showSection(section) {
    document.querySelector('.tab-content.active')?.classList.remove('active');
    document.getElementById(section)?.classList.add('active');

    if (section === 'analytics') {
        loadAnalyticsData();
    }
    if (section === 'home' || section === 'orders') {
        loadHomeData();
        loadActiveOrders();
        loadOrderHistory();
        loadQuotations();
    }
    if (section === 'pending-registrations') {
        loadPendingRegistrations();
    }
}

function showCreateOrderForm() {
    document.getElementById('create-order-form').style.display = 'block';
}

function closeCreateOrderForm() {
    document.getElementById('create-order-form').style.display = 'none';
}

function generateUniqueID() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function createOrder() {
    const orderData = {
        orderId: `ORD-${generateUniqueID()}`,
        name: document.getElementById('orderName').value,
        quantity: document.getElementById('orderQuantity').value,
        expectedDeliveryDate: document.getElementById('orderDate').value,
        maxPrice: document.getElementById('orderPrice').value,
        description: document.getElementById('orderDescription').value,
        status: 'Active'
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Order created successfully!');
            loadActiveOrders();
            document.getElementById('create-order').reset();
            closeCreateOrderForm();
        } else {
            alert('Failed to create order.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadHomeData() {
    const orders = [
        { orderId: 'ORD-10521', projectName: 'Defense Equipment', quantity: 50, amount: '$1200.00', details: 'Details about the project...' },
        { orderId: 'ORD-53251', projectName: 'Communication Gear', quantity: 20, amount: '$5685.00', details: 'Details about the project...' }
    ];

    const buyers = [
        { templateNumber: 'TEMP-1001', licenseNumber: 'LIC-201', buyerName: 'John Doe', productPurchased: 'Rifle', price: '$1021', quantity: 10 },
        { templateNumber: 'TEMP-1002', licenseNumber: 'LIC-202', buyerName: 'Jane Smith', productPurchased: 'Ammo', price: '$2021', quantity: 50 }
    ];

    fillTable('recent-orders-table', orders, 5);
    fillTable('recent-buyers-table', buyers, 6);
}

async function loadActiveOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        fillTable('active-orders-table', orders, 7);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadOrderHistory() {
    try {
        const response = await fetch('/api/orders/history');
        const orders = await response.json();
        fillTable('order-history-table', orders, 7);
    } catch (error) {
        console.error('Error:', error);
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function fillTable(tableId, data, colspan) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    if (data.length > 0) {
        data.forEach(item => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.orderId ? `#${item.orderId}` : ''}</td>
                <td>${item.name || ''}</td>
                <td>${item.quantity || ''}</td>
                <td>${item.expectedDeliveryDate ? formatDate(item.expectedDeliveryDate) : ''}</td>
                <td>${item.maxPrice || ''}</td>
                <td>${item.description || ''}</td>
                <td>${item.status ? `<span style="color: ${item.status === 'Confirmed' ? 'green' : item.status === 'Cancelled' ? 'red' : 'blue'};">${item.status}</span>` : ''}</td>
            `;
            if (tableId === 'active-orders-table') {
                const actionCell = row.insertCell();
                const actionButton = document.createElement('button');
                actionButton.textContent = 'Action';
                actionButton.onclick = function() {
                    showActionModal(item.orderId);
                };
                actionCell.appendChild(actionButton);
            }
        });
    } else {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.setAttribute('colspan', colspan);
        cell.textContent = 'No data available';
    }
}

function showActionModal(orderId) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'block';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Order';
    deleteButton.onclick = async function() {
        await updateOrderStatus(orderId, 'Cancelled');
        modal.style.display = 'none';
        document.body.removeChild(modal);
    };

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm Order';
    confirmButton.onclick = async function() {
        await updateOrderStatus(orderId, 'Confirmed');
        modal.style.display = 'none';
        document.body.removeChild(modal);
    };

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = function() {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    };

    modalContent.append(closeButton, deleteButton, confirmButton, backButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`/api/orders/update/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert(`Order ${status} successfully!`);
            loadActiveOrders();
            loadOrderHistory();
        } else {
            alert(`Failed to update order status to ${status}.`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadQuotations() {
    try {
        const response = await fetch('/api/quotations');
        const quotations = await response.json();
        fillQuotationsTable('quotations-table', quotations);
    } catch (error) {
        console.error('Error:', error);
    }
}

function fillQuotationsTable(tableId, data) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    if (data.length > 0) {
        data.forEach((item, index) => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.wmName || ''}</td>
                <td>${item.email || ''}</td>
                <td><button onclick="showQuotationDetails('${item._id}')">View Form</button></td>
            `;
        });
    } else {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.setAttribute('colspan', 4);
        cell.textContent = 'No quotations received for this order.';
    }
}

function showQuotationDetails(quotationId) {
    fetch(`/api/quotations/${quotationId}`)
        .then(response => response.json())
        .then(quotation => {
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.style.display = 'block';

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            const closeButton = document.createElement('span');
            closeButton.classList.add('close');
            closeButton.innerHTML = '&times;';
            closeButton.onclick = function() {
                modal.style.display = 'none';
                document.body.removeChild(modal);
            };

            modalContent.innerHTML = `
                <h2>Quotation Details</h2>
                <p><strong>WM Name:</strong> ${quotation.wmName}</p>
                <p><strong>Email:</strong> ${quotation.email}</p>
                <p><strong>Summary:</strong> ${quotation.summary}</p>
                <p><strong>Quotation File:</strong> <a href="/uploads/${quotation.filePath}" target="_blank">View File</a></p>
                <button onclick="updateQuotationStatus('${quotation.orderId}', 'Accepted')">Accept</button>
                <button onclick="updateQuotationStatus('${quotation.orderId}', 'Rejected')">Reject</button>
                <button onclick="closeQuotationModal()">Back</button>
            `;

            modalContent.appendChild(closeButton);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        })
        .catch(error => console.error('Error:', error));
}

function closeQuotationModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
}

async function updateQuotationStatus(orderId, status) {
    try {
        const response = await fetch(`/api/quotations/update/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert(`Quotation ${status} successfully!`);
            closeQuotationModal();
            loadQuotations();
        } else {
            alert(`Failed to update quotation status to ${status}.`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadAnalyticsData() {
    console.log("Loading analytics data...");
    const overviewChart = document.getElementById('overviewChart').getContext('2d');
    new Chart(overviewChart, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Monthly Data',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });

    const budgetChart = document.getElementById('budgetChart').getContext('2d');
    new Chart(budgetChart, {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
                label: 'Quarterly Budget',
                data: [20000, 24000, 28000, 22000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });

    const weeklyChart = document.getElementById('weeklyChart').getContext('2d');
    new Chart(weeklyChart, {
        type: 'doughnut',
        data: {
            labels: ['Complete', 'In Progress', 'Delayed'],
            datasets: [{
                label: 'Weekly Status',
                data: [50, 30, 20],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function loadPendingRegistrations() {
    try {
        const response = await fetch('/api/officer/pending-registrations'); // Ensure the URL matches your backend route
        const registrations = await response.json();
        if (response.ok) {
            fillPendingRegistrationsTable('pending-registrations-table', registrations);
        } else {
            console.error('Error loading pending registrations:', registrations);
        }
    } catch (error) {
        console.error('Error loading pending registrations:', error);
    }
}

function fillPendingRegistrationsTable(tableId, data) {
    const table = document.getElementById(tableId);
    table.innerHTML = ''; // Clear existing content
    if (data.length > 0) {
        data.forEach(item => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.licenseNumber}</td>
                <td>${item.phoneNumber}</td>
                <td>
                    <button onclick="showApprovalModal('${item._id}')">Approve</button>
                    <button onclick="showRejectionModal('${item._id}')">Reject</button>
                </td>
            `;
        });
    } else {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.setAttribute('colspan', 5);
        cell.textContent = 'No pending registrations';
    }
}

function showApprovalModal(registrationId) {
    const modal = document.getElementById('approval-modal');
    modal.style.display = 'block';
    document.getElementById('approval-modal').dataset.registrationId = registrationId;
}

function closeApprovalModal() {
    const modal = document.getElementById('approval-modal');
    modal.style.display = 'none';
}

async function confirmApproval() {
    const registrationId = document.getElementById('approval-modal').dataset.registrationId;

    try {
        const response = await fetch(`/api/officer/approve-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: registrationId })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registration approved successfully!');
            loadPendingRegistrations();
            closeApprovalModal();
        } else {
            console.error('Failed to approve registration:', result);
            alert('Failed to approve registration.');
        }
    } catch (error) {
        console.error('Error approving registration:', error);
    }
}

function showRejectionModal(registrationId) {
    const modal = document.getElementById('rejection-modal');
    modal.style.display = 'block';
    document.getElementById('rejection-modal').dataset.registrationId = registrationId;
}

function closeRejectionModal() {
    const modal = document.getElementById('rejection-modal');
    modal.style.display = 'none';
}

async function confirmRejection() {
    const registrationId = document.getElementById('rejection-modal').dataset.registrationId;
    const reason = document.getElementById('rejection-reason').value;

    try {
        const response = await fetch(`/api/officer/reject-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: registrationId, reason })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registration rejected successfully!');
            loadPendingRegistrations();
            closeRejectionModal();
        } else {
            console.error('Failed to reject registration:', result);
            alert('Failed to reject registration.');
        }
    } catch (error) {
        console.error('Error rejecting registration:', error);
    }
}
