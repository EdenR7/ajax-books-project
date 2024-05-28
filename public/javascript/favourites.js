document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('table tbody');
    const sortSelect = document.getElementById('sort-select');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Sample data for sorting
    const rows = Array.from(table.querySelectorAll('tr'));

    sortSelect.addEventListener('change', function () {
        const sortBy = this.value;
        let sortedRows;

        if (sortBy === 'alphabetical') {
            sortedRows = rows.sort((a, b) => {
                const nameA = a.cells[2].innerText.toLowerCase();
                const nameB = b.cells[2].innerText.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (sortBy === 'added') {
            sortedRows = rows.sort((a, b) => {
                const idA = parseInt(a.cells[0].innerText, 10);
                const idB = parseInt(b.cells[0].innerText, 10);
                return idA - idB;
            });
        }

        sortedRows.forEach(row => table.appendChild(row)); // Append sorted rows directly to table
    });

    // Sample pagination functionality
    let currentPage = 1;
    const rowsPerPage = 5;

    function displayRows(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            if (index >= start && index < end) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function updatePagination() {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === Math.ceil(rows.length / rowsPerPage);
    }

    prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displayRows(currentPage);
            updatePagination();
        }
    });

    nextBtn.addEventListener('click', function () {
        if (currentPage < Math.ceil(rows.length / rowsPerPage)) {
            currentPage++;
            displayRows(currentPage);
            updatePagination();
        }
    });

    displayRows(currentPage);
    updatePagination();

    // Adding click event listener to delete buttons
    table.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.closest('tr');
            row.remove(); // Remove the row from the table
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('table tbody');

    // Adding click event listener to delete buttons
    table.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.closest('tr');
            row.remove(); // Remove the row from the table
        }
    });
});