document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const section = link.getAttribute('onclick').match(/showSection\('(\w+)'\)/)[1];
            showSection(section);
        });
    });

    loadMarketPlaceOrders();
    loadSubmittedQuotations();
    loadOrderHistory();

    document.getElementById('file-quotation-form').addEventListener('submit', fileQuotation);
});

function showSection(section) {
    const currentSection = document.querySelector('.tab-content.active');
    if (currentSection) {
        currentSection.classList.remove('active');
    }
    const newSection = document.getElementById(section);
    newSection.classList.add('active');
    
    if (section === 'marketplace') {
        loadMarketPlaceOrders();
    } else if (section === 'submitted-quotations') {
        loadSubmittedQuotations();
    } else if (section === 'order-history') {
        loadOrderHistory();
    }
}

async function loadMarketPlaceOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        fillMarketPlaceTable('marketplace-orders-table', orders);
    } catch (error) {
        console.error('Error:', error);
    }
}

function fillMarketPlaceTable(tableId, data) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    if (data.length > 0) {
        data.forEach(item => {
            if (item.status !== 'Ignored') {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${item.orderId ? `#${item.orderId}` : ''}</td>
                    <td>${item.name || ''}</td>
                    <td>${item.quantity || ''}</td>
                    <td>${item.expectedDeliveryDate ? formatDate(item.expectedDeliveryDate) : ''}</td>
                    <td>${item.maxPrice || ''}</td>
                    <td>${item.description || ''}</td>
                    <td>
                        <button onclick="showQuotationForm('${item._id}')">File Quotation</button>
                        <button onclick="showIgnoreConfirmation('${item._id}')">Ignore</button>
                    </td>
                `;
            }
        });
    } else {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.setAttribute('colspan', 7);
        cell.textContent = 'No orders available in the marketplace.';
    }
}

function showQuotationForm(orderId) {
    const modal = document.getElementById('quotation-form-modal');
    modal.style.display = 'block';
    document.getElementById('quotationOrderId').value = orderId;
}

function closeQuotationForm() {
    document.getElementById('quotation-form-modal').style.display = 'none';
}

async function fileQuotation(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('file-quotation-form'));

    try {
        const response = await fetch('/api/quotations', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Quotation submitted successfully!');
            loadMarketPlaceOrders();
            loadSubmittedQuotations();
            document.getElementById('file-quotation-form').reset();
            closeQuotationForm();
        } else {
            alert('Failed to submit quotation.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function showIgnoreConfirmation(orderId) {
    const modal = document.getElementById('ignore-confirmation-modal');
    modal.style.display = 'block';
    document.getElementById('confirmIgnoreButton').onclick = function() {
        confirmIgnore(orderId);
    };
}

function closeIgnoreConfirmation() {
    document.getElementById('ignore-confirmation-modal').style.display = 'none';
}

async function confirmIgnore(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Ignored' })
        });

        if (response.ok) {
            alert('Order ignored successfully!');
            loadMarketPlaceOrders();
            loadOrderHistory();
            closeIgnoreConfirmation();
        } else {
            alert('Failed to ignore order.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadSubmittedQuotations() {
    try {
        const response = await fetch('/api/quotations');
        const quotations = await response.json();
        fillSubmittedQuotationsTable('submitted-quotations-table', quotations);
    } catch (error) {
        console.error('Error:', error);
    }
}

function fillSubmittedQuotationsTable(tableId, data) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    const uniqueQuotations = data.filter((value, index, self) => self.findIndex(v => v.orderId === value.orderId) === index);

    if (uniqueQuotations.length > 0) {
        uniqueQuotations.forEach(item => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.orderId ? `#${item.orderId}` : ''}</td>
                <td>${item.wmName || ''}</td>
                <td>${item.email || ''}</td>
                <td>${item.summary || ''}</td>
                <td>${item.filePath ? `<a href="/${item.filePath}" target="_blank" download>View Form</a>` : ''}</td>
                <td><span style="color: ${item.status === 'Accepted' ? 'green' : item.status === 'Rejected' ? 'red' : 'blue'};">${item.status || 'Pending'}</span></td>
            `;
        });
    } else {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.setAttribute('colspan', 6);
        cell.textContent = 'No quotations submitted yet.';
    }
}

async function loadOrderHistory() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        fillTable('order-history-table', orders);
    } catch (error) {
        console.error('Error:', error);
    }
}

function fillTable(tableId, data) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
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
                <td><span style="color: ${item.status === 'Confirmed' ? 'green' : item.status === 'Cancelled' ? 'red' : item.status === 'Ignored' ? 'gray' : 'blue'};">${item.status}</span></td>
            `;
        });
    } else {
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.setAttribute('colspan', 7);
        cell.textContent = 'No data available';
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
