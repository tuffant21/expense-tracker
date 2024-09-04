let billsData = [];
let disabledBillsData = [];
let originalBillsData = [];
let originalDisabledBillsData = [];
let sortOrder = null; // Track the sort order: 'asc', 'desc', or null for reset
let currentSortedColumn = null; // Track the currently sorted column

document.addEventListener('DOMContentLoaded', () => {
    fetchBills();

    // Get modal elements
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    cancelButton.onclick = () => {
        hideModal();
    };

    confirmButton.onclick = () => {
        if (typeof confirmCallback === 'function') {
            confirmCallback();
            hideModal();
        }
    };
});

function fetchBills() {
    fetch('/api/bills')
        .then(response => response.json())
        .then(data => {
            billsData = data.filter(bill => !bill.disabled);
            disabledBillsData = data.filter(bill => bill.disabled);
            originalBillsData = [...billsData];  // Store the original data
            originalDisabledBillsData = [...disabledBillsData];  // Store the original disabled data
            populateTable(billsData, 'billTableBody');
            populateTable(disabledBillsData, 'disabledBillTableBody');
        });
}

function populateTable(bills, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = '';  // Clear the table

    bills.forEach(bill => {
        const row = document.createElement('tr');

        // Define all fields
        const fields = {
            bill: bill.bill || '',
            dueDate: bill.dueDate || '',
            autoPay: bill.autoPay !== undefined ? bill.autoPay : false,
            due: bill.due || '',  // Due amount as a string
            balance: bill.balance || '',  // Balance amount as a string
            website: bill.website || '',
            lastPaymentDate: bill.lastPaymentDate || '' // Last payment date will be set to '' if not available
        };

        for (const key in fields) {
            const cell = document.createElement('td');

            if (key === 'due' || key === 'balance') {
                // Create a wrapper with the dollar sign and input field
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';

                const dollarSign = document.createElement('span');
                dollarSign.textContent = '$';
                dollarSign.style.marginRight = '4px'; // Add some space between the dollar sign and input

                const input = document.createElement('input');
                input.type = 'text';
                input.value = fields[key];
                input.addEventListener('blur', (e) => updateBill(bill._id, key, e.target.value));

                wrapper.appendChild(dollarSign);
                wrapper.appendChild(input);
                cell.appendChild(wrapper);
            } else if (key === 'autoPay') {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = fields[key];
                input.addEventListener('change', (e) => updateBill(bill._id, key, e.target.checked));
                cell.appendChild(input);
            } else if (key === 'lastPaymentDate') {
                // Create a date picker for the Last Payment Date
                const input = document.createElement('input');
                input.type = 'date'; // Set input type to date for calendar dialog
                input.value = fields[key]; // Assign the value if it exists
                input.addEventListener('change', (e) => updateBill(bill._id, key, e.target.value));
                cell.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = fields[key];
                input.addEventListener('blur', (e) => updateBill(bill._id, key, e.target.value));
                cell.appendChild(input);
            }

            row.appendChild(cell);
        }

        const actionsCell = document.createElement('td');
        const select = document.createElement('select');
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Choose action';
        defaultOption.disabled = true;
        defaultOption.selected = true;

        const disableOption = document.createElement('option');
        disableOption.value = 'disable';
        disableOption.text = bill.disabled ? 'Enable' : 'Disable';

        const deleteOption = document.createElement('option');
        deleteOption.value = 'delete';
        deleteOption.text = 'Delete';

        select.appendChild(defaultOption);
        select.appendChild(disableOption);
        select.appendChild(deleteOption);

        select.addEventListener('change', (e) => handleAction(bill._id, e.target.value, bill.disabled, select));
        actionsCell.appendChild(select);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function sortTable(column, isDisabledTable = false) {
    let data = isDisabledTable ? disabledBillsData : billsData;
    const originalData = isDisabledTable ? originalDisabledBillsData : originalBillsData;
    const isNumeric = ['due', 'balance'].includes(column);

    if (currentSortedColumn !== column) {
        // New column is clicked, start with ascending sort
        sortOrder = 'asc';
    } else {
        // Same column clicked, toggle sorting order
        sortOrder = (sortOrder === 'asc') ? 'desc' : (sortOrder === 'desc') ? null : 'asc';
    }

    currentSortedColumn = column;

    if (sortOrder === 'asc') {
        // Sort ascending
        data.sort((a, b) => {
            const aVal = a[column] || '';
            const bVal = b[column] || '';

            return isNumeric ? (aVal - bVal) : aVal.toString().localeCompare(bVal.toString());
        });
    } else if (sortOrder === 'desc') {
        // Sort descending
        data.sort((a, b) => {
            const aVal = a[column] || '';
            const bVal = b[column] || '';

            return isNumeric ? (bVal - aVal) : bVal.toString().localeCompare(aVal.toString());
        });
    } else {
        // Reset sorting to original order
        data = [...originalData];
    }

    // Update the table with sorted data
    populateTable(data, isDisabledTable ? 'disabledBillTableBody' : 'billTableBody');

    // Update the sorting icons
    updateSortingIcons(column, isDisabledTable);
}

function updateSortingIcons(column, isDisabledTable) {
    const tableId = isDisabledTable ? 'disabledBillTable' : 'billTable';
    const headers = document.querySelectorAll(`#${tableId} th`);

    // Clear all sorting icons from headers
    headers.forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
    });

    if (sortOrder) {
        // Find the correct header based on the column name and apply the sorting class
        headers.forEach(th => {
            const headerText = th.textContent.trim().toLowerCase();
            const columnMap = {
                'bill': 'bill',
                'due date': 'dueDate',
                'auto pay': 'autoPay',
                'due': 'due',
                'balance': 'balance',
                'website': 'website',
                'last payment date': 'lastPaymentDate'
            };

            if (columnMap[headerText] === column) {
                if (sortOrder === 'asc') {
                    th.classList.add('sorted-asc');
                } else if (sortOrder === 'desc') {
                    th.classList.add('sorted-desc');
                }
            }
        });
    }
}

function updateBill(id, field, value) {
    fetch(`/api/bills/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: value })
    }).then(() => fetchBills());
}

function handleAction(id, action, isDisabled, selectElement) {
    if (action === 'delete') {
        showModal('Are you sure you want to delete this bill?', () => {
            fetch(`/api/bills/${id}`, {
                method: 'DELETE'
            }).then(() => {
                fetchBills();
                resetSelect(selectElement);
            });
        });
    } else if (action === 'disable') {
        const actionText = isDisabled ? 'enable' : 'disable';
        showModal(`Are you sure you want to ${actionText} this bill?`, () => {
            fetch(`/api/bills/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ disabled: !isDisabled })
            }).then(() => {
                fetchBills();
                resetSelect(selectElement);
            });
        });
    }
}

function resetSelect(selectElement) {
    selectElement.value = '';
}

function addNewBill() {
    fetch('/api/bills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then(() => fetchBills());
}

function showModal(message, callback) {
    const modal = document.getElementById('confirmationModal');
    const modalText = document.getElementById('modalText');
    modalText.textContent = message;
    modal.style.display = 'block';
    confirmCallback = callback; // Store the callback for later execution
}

function hideModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}
