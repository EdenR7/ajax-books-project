const tableBody = document.getElementById('history-body');
const categorySelect = document.getElementById('category-select');
const sortAlphabeticalButton = document.getElementById('sort-alphabetical');
const baseUrl = 'http://localhost:8001/history';
const itemsPerPage = 10; // Set the number of items per page

document.addEventListener('DOMContentLoaded', function () {
  let currentPage = 1;
  let data = []; // Store the fetched data
  
  const fetchHistory = async () => {
    try {
      const response = await axios.get(baseUrl);
      data = response.data;
      console.log('Fetched history data:', data);
      updateTable();
      renderPagination();
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  const updateTable = () => {
    tableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    pageData.forEach(action => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${action.bookName}</td>
        <td>${action.operationType}</td>
        <td>${action.operationDate}</td>
        <td>${action.operationTime}</td>
      `;
      tableBody.appendChild(row);
    });
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';
  
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.innerText = i;
      button.addEventListener('click', () => {
        currentPage = i;
        updateTable();
      });
      paginationContainer.appendChild(button);
    }
  };

  fetchHistory();

});

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