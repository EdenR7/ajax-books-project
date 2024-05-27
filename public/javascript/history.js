document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('table tbody');
    const sortSelect = document.getElementById('sort-select');

    const rows = Array.from(table.querySelectorAll('tr'));
    console.log('Rows:', rows);

    sortSelect.addEventListener('change', function () {
        const sortBy = sortSelect.value;
        console.log('Sort by:', sortBy);

        if (sortBy === 'alphabetical') {
            rows.sort((a, b) => {
                const nameA = a.cells[2].innerText.toLowerCase();
                const nameB = b.cells[2].innerText.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (sortBy === 'added') {
            rows.sort((a, b) => {
                const idA = parseInt(a.cells[0].innerText);
                const idB = parseInt(b.cells[0].innerText);
                return idA - idB;
            });
        }
    })});
