let currentPage = 1;
const pageMax = 12;
const booksUrl = 'http://localhost:8001/books';
const bookListElement = document.getElementById("books");



//Display all books
async function displayBooksPage() {
    let books;
    await getPage(currentPage)
    .then(res => books = res)
    bookListElement.innerHTML= ""
    for (const book of books) {
        bookListElement.innerHTML += `
        <li id=${book.id} class="flex-group book" onclick="displayBook(this.id)">
        <div class="book-text flex-group">
          <h3>${book.title}</h3>
          <p> ${book.authors?`Wriiten by ${book.authors[0]}`:'Anonymus author'}</p>
        </div>
        <div class="book-img flex-group">
          <img
            src="${book.imageLink.small}"
            alt=""
          />
        </div>
      </li>`
    }
}
async function getPage() {
    currentPage === 1 ? document.querySelector(".prev").style.visibility = "hidden" : document.querySelector(".prev").style.visibility = "visible";
    const response = await axios.get(`${booksUrl}`, {
        params: {
            _page: currentPage,
            _per_page : pageMax,
            _sort: 'title',
            _order: 'desc'
        }
        });
    return response.data.data;
}
//Paginote
async function nextPage(){
    currentPage++;
    await displayBooksPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });

}
async function prevPage(){
    currentPage --;
    await displayBooksPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

//Overlay functions
async function displayBook(bookID) {
    const book = await getBookFromDB(bookID);
    document.querySelector(".overlay__book-img").innerHTML =`<img
    src="${book.imageLink.big}"
    alt=""
  />` ;  
  document.querySelector('.overlay__book-details').innerHTML= overlayBookDetails(book);
  document.querySelector('#book-copies').innerText = book.numOfCopies;
  setTimeout(()=>{
    displayOverlay(bookID);
  },300);
}
function overlayBookDetails(element) {
    return `
    <h3 class="title">${element.title}</h3>
            <p class="author">
              <span class="key">Authors: </span
              ><span class="text">${element.authors[0]?element.authors[0]:""}</span>
            </p>
            <p class="Category">
              <span class="key">Category:</span
              ><span class="text"> ${element.categories}</span>
            </p>
            <p class="pages-number">
              <span class="key">Pages:</span><span class="text"> ${element.numPages}</span>
            </p>
            <p class="description">
              <span class="text">
                ${element.description}
              </span>
            </p>
            <p class="Identifier">
              <span class="key">ISBN:</span><span class="text"> ${element.id}</span>
            </p>
    `
}
async function getBookFromDB(id) {
    const response = await axios.get(`${booksUrl}/${id}`);
    return response.data;
}
async function addCopy(event){
    const bookID = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('identifier');
    const getResponse = await axios.get(`${booksUrl}/${bookID}`);
    const book = getResponse.data;
    const newCopies = book.numOfCopies + 1;
    const patchResponse = await axios.patch(`${booksUrl}/${bookID}`, {
        numOfCopies: newCopies
      });
    document.querySelector('#book-copies').innerText = newCopies;
    // ADD HISTORY ACTION
}
async function removeCopy(event){
    const bookID = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('identifier');
    const getResponse = await axios.get(`${booksUrl}/${bookID}`);
    const book = getResponse.data;
    const newCopies = book.numOfCopies - 1;
    const patchResponse = await axios.patch(`${booksUrl}/${bookID}`, {
        numOfCopies: newCopies
      });
    document.querySelector('#book-copies').innerText = newCopies;
    // ADD HISTORY ACTION
}

const closeBtns = document.querySelectorAll(".close-btn");
closeBtns.forEach((btn=>{
    btn.addEventListener('click', ()=>{
        closeOverlay();
    })
}))
function displayOverlay(bookID) {
    document.querySelector("main").style.opacity = .5;
    document.querySelector("nav").style.opacity = .5;
    console.log(document.querySelector("main"));
    document.querySelector(".overlay-container").setAttribute('identifier', bookID);
    document.querySelector(".overlay-container").style.display = "block";
}
function closeOverlay() {
    document.querySelector("main").style.opacity = 1;
    document.querySelector("nav").style.opacity = 1;
    document.querySelector(".overlay-container").style.display = "none";
    document.querySelector(".overlay-container").removeAttribute('identifier');
}


// default actions of dom
document.addEventListener('DOMContentLoaded', function() {
    const categorySelectWrapper = document.querySelector('.category-select-wrapper');
    const selectElement = categorySelectWrapper.querySelector('select');
    categorySelectWrapper.innerHTML += `
        <div class="category-select-styled">${selectElement.options[0].text}</div>
        <div class="category-select-options">
            ${Array.from(selectElement.options).map(option => `
                <div data-value="${option.value}">${option.text}</div>
            `).join('')}
        </div>
    `;
    const categorySelectStyled = categorySelectWrapper.querySelector('.category-select-styled');
    const categorySelectOptions = categorySelectWrapper.querySelector('.category-select-options');
    categorySelectStyled.addEventListener('click', () => {
        categorySelectWrapper.classList.toggle('open');
    });

    categorySelectOptions.querySelectorAll('div').forEach(optionDiv => {
        optionDiv.addEventListener('click', () => {
            categorySelectStyled.textContent = optionDiv.textContent;
            selectElement.value = optionDiv.getAttribute('data-value');
            categorySelectWrapper.classList.remove('open');
            categorySelectWrapper.setAttribute('data-value', optionDiv.textContent);
        });
    });
    displayBooksPage();
});

//search by name
//paginate end
//Check if there is a ibsn 
//pop up messages - loader...
// filter categories
//option to delete book