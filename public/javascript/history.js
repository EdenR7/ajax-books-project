document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('table tbody');
    const sortSelect = document.getElementById('sort-select');
    const baseUrl = 'http://localhost:3000/history';

    const rows = Array.from(table.querySelectorAll('tr'));
    console.log('Rows:', rows);

    const fetchBooks = async () => {
        const { data } = await axios.get(`${baseUrl}`)
        console.log(data);
    }

    fetchBooks()

    // const addBook = async () => {
    //     await axios.post(baseUrl, {
    //         firstName: 'Fred',
    //         lastName: 'Flintstone'
    //     })
    // }

    // addBook()


    // sortSelect.addEventListener('change', function () {
    //     const sortBy = sortSelect.value;
    //     console.log('Sort by:', sortBy);

    //     if (sortBy === 'alphabetical') {
    //         rows.sort((a, b) => {
    //             const nameA = a.cells[2].innerText.toLowerCase();
    //             const nameB = b.cells[2].innerText.toLowerCase();
    //             return nameA.localeCompare(nameB);
    //         });
    //     } else if (sortBy === 'added') {
    //         rows.sort((a, b) => {
    //             const idA = parseInt(a.cells[0].innerText);
    //             const idB = parseInt(b.cells[0].innerText);
    //             return idA - idB;
    //         });
    //     }
    // })
});

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('table tbody');
    const categorySelect = document.getElementById('category-select');
    const sortAlphabeticalButton = document.getElementById('sort-alphabetical');
    const baseUrl = 'http://localhost:3000/history';


    const fetchHistory = async () => {
        try {
            const response = await axios.get(baseUrl);
            const data = response.data;
            console.log('Fetched history data:', data);


            tableBody.innerHTML = '';


            data.forEach(action => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${action.actionId}</td>
                    <td>${action.bookId}</td>
                    <td>${action.bookName}</td>
                    <td>${action.numCopies}</td>
                    <td>${action.operationType}</td>
                    <td>${action.operationDate}</td>
                    <td>${action.operationTime}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching history data:', error);
        }
    };


    const sortAlphabetically = () => {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const nameA = a.cells[2].innerText.toLowerCase();
            const nameB = b.cells[2].innerText.toLowerCase();
            return nameA.localeCompare(nameB);
        });
        rows.forEach(row => tableBody.appendChild(row));
    };


    sortAlphabeticalButton.addEventListener('click', sortAlphabetically);


    fetchHistory();
});
