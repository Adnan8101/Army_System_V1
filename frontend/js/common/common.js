// Function to show a section based on ID
function showSection(sectionId) {
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Function to handle search input
function handleSearchInput(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', () => {
        const filter = input.value.toLowerCase();
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            const matches = cells.some(cell => cell.textContent.toLowerCase().includes(filter));
            if (matches) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Function to handle modal visibility
function toggleModal(modalId, action) {
    const modal = document.getElementById(modalId);
    if (action === 'show') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Example usage for search input and section toggling
document.addEventListener('DOMContentLoaded', () => {
    handleSearchInput('searchInput');
    const defaultSection = document.querySelector('.tab-content.active');
    if (defaultSection) {
        showSection(defaultSection.id);
    }
});
