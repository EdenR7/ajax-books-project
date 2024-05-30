const booksUrl = 'http://localhost:8001/books';
const favouritesUrl = 'http://localhost:8001/favourites';
let favBookIds = [];
let favBooksElements = []; 
const tableElement = document.querySelector("tbody");
document.addEventListener('DOMContentLoaded', async ()=>{
    const res = await axios.get(favouritesUrl);
    for (const element of res.data) {
        favBookIds.push(element.bookId)
    }
    for (const id of favBookIds) {
        const row = document.createElement('tr');
        tableElement.appendChild(row);
        const response = await axios.get(`${booksUrl}/${id}`);
        const book = response.data;
        favBooksElements.push(book);
        row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.ISBN?book.ISBN[0].identifier:"-"}</td>
        <td>
          <img
          src="${book.imageLink?book.imageLink.small:'X'}"
          alt="${book.title}">
        </td>`
        
        
    }
})

document.getElementById("scroll-up").addEventListener("click",()=>{
    window.scrollTo({top:0, behavior:"smooth"});
})

