const tableBody = document.getElementById('history-body');
const categorySelect = document.getElementById('category-select');
const sortAlphabeticalButton = document.getElementById('sort-alphabetical');
const bookNameHeader = document.getElementById('book-name-header');
const operationTypeHeader = document.getElementById('operation-type-header');
const baseUrl = 'http://localhost:8001/history';
const itemsPerPage = 10; // Set the number of items per page

let currentPage = 1;
let data = []; // Store the fetched data

document.addEventListener('DOMContentLoaded', async ()=>{
    tableBody.innerHTML = '';
    const res = await axios.get(baseUrl);
    const historyData = res.data;
    console.log(historyData);
    for (const historyElement of historyData) {
        console.log(historyElement);
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${historyElement.bookName}</td>
        <td>${historyElement.operationType}</td>
        <td>${historyElement.operationDate}</td>
        <td>${historyElement.comments}</td>
        `;
        tableBody.appendChild(row);
        
    }
})
document.getElementById("scroll-up").addEventListener("click",()=>{
    window.scrollTo({top:0, behavior:"smooth"});
})


// fetchHistory();


// const fetchHistory = async () => {
//             try {
//                 const response = await axios.get(baseUrl);
//                 data = response.data;
//                 console.log('Fetched history data:', data);
//                 updateTable();
//                 renderPagination();
//             } catch (error) {
//                 console.error('Error fetching history data:', error);
//             }
//         };
// const updateTable = () => {
//     tableBody.innerHTML = '';
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const pageData = data.slice(startIndex, endIndex);

//     pageData.forEach(action => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//       <td>${action.bookName}</td>
//       <td>${action.operationType}</td>
//       <td>${action.operationDate}</td>
//       <td>${action.comments}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//     // <td>${action.operationTime}</td>
// };
// document.addEventListener('DOMContentLoaded', function () {

//     // Fetch history data from the server
//     const fetchHistory = async () => {
//         try {
//             const response = await axios.get(baseUrl);
//             data = response.data;
//             console.log('Fetched history data:', data);
//             updateTable();
//             renderPagination();
//         } catch (error) {
//             console.error('Error fetching history data:', error);
//         }
//     };

//     // Update the table with the current page of data
//     const updateTable = () => {
//         tableBody.innerHTML = '';
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         const pageData = data.slice(startIndex, endIndex);

//         pageData.forEach(action => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//           <td>${action.bookName}</td>
//           <td>${action.operationType}</td>
//           <td>${action.operationDate}</td>
//           <td>${action.comments}</td>
//           `;
//           tableBody.appendChild(row);
//         });
//         // <td>${action.operationTime}</td>
//     };

//     // Render pagination buttons
//     const renderPagination = () => {
//         const totalPages = Math.ceil(data.length / itemsPerPage);
//         const paginationContainer = document.getElementById('pagination-container');
//         paginationContainer.innerHTML = '';

//         // Create and append the "Previous" button
//         const prevButton = document.createElement('button');
//         prevButton.classList.add("btn")
//         prevButton.innerText = 'Previous';
//         prevButton.disabled = currentPage === 1;
//         prevButton.addEventListener('click', () => {
//             if (currentPage > 1) {
//                 currentPage--;
//                 updateTable();
//                 renderPagination();
//             }
//         });
//         paginationContainer.appendChild(prevButton);

//         // Create and append the page number buttons
//         // for (let i = 1; i <= totalPages; i++) {
//         //     const button = document.createElement('button');
//         //     button.innerText = i;
//         //     button.disabled = i === currentPage;
//         //     button.addEventListener('click', () => {
//         //         currentPage = i;
//         //         updateTable();
//         //         renderPagination();
//         //     });
//         //     paginationContainer.appendChild(button);
//         // }

//         // Create and append the "Next" button
//         const nextButton = document.createElement('button');
//         nextButton.classList.add("btn")
//         nextButton.innerText = 'Next';
//         nextButton.disabled = currentPage === totalPages;
//         nextButton.addEventListener('click', () => {
//             if (currentPage < totalPages) {
//                 currentPage++;
//                 updateTable();
//                 renderPagination();
//             }
//         });
//         paginationContainer.appendChild(nextButton);
//     };

//     // Sort table alphabetically
//     const sortAlphabetically = () => {
//         const rows = Array.from(tableBody.querySelectorAll('tr'));
//         rows.sort((a, b) => {
//             const nameA = a.cells[0].innerText.toLowerCase();
//             const nameB = b.cells[0].innerText.toLowerCase();
//             return nameA.localeCompare(nameB);
//         });
//         rows.forEach(row => tableBody.appendChild(row));
//     };
//     const sortAlphabeticallyByBookName = () => {
//         const rows = Array.from(tableBody.querySelectorAll('tr'));
//         rows.sort((a, b) => {
//             const nameA = a.cells[0].innerText.toLowerCase();
//             const nameB = b.cells[0].innerText.toLowerCase();
//             return nameA.localeCompare(nameB);
//         });
//         rows.forEach(row => tableBody.appendChild(row));
//     };

//     const sortAlphabeticallyByOperationType = () => {
//         const rows = Array.from(tableBody.querySelectorAll('tr'));
//         rows.sort((a, b) => {
//             const typeA = a.cells[1].innerText.toLowerCase();
//             const typeB = b.cells[1].innerText.toLowerCase();
//             return typeA.localeCompare(typeB);
//         });
//         rows.forEach(row => tableBody.appendChild(row));
//     };

// // sortAlphabeticalButton.addEventListener('click', sortAlphabeticallyByBookName);
// //     bookNameHeader.addEventListener('click', sortAlphabeticallyByBookName); 
// //     operationTypeHeader.addEventListener('click', sortAlphabeticallyByOperationType);
// //     sortAlphabeticalButton.addEventListener('click', sortAlphabetically);

//     fetchHistory();
// });