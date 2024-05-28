const inputField = document.getElementById("name-field");
const btnSearch = document.getElementById("search");
const addForm = document.getElementById("search-by-name");
const googleUrl = 'https://www.googleapis.com/books/v1/volumes';
const booksUrl = 'http://localhost:8001/books';
const bookListElement = document.getElementById("books");
const apiKey = 'AIzaSyCTA9wuo8lvoUDxqDt_WYsebCsbSYoHoUY';
let currentPage = 1;
const pageMax = 12;
const elementsToAdd = [];



//Add new books
async function addBookToList(event){
    const bookId = event.currentTarget.id;
    elementsToAdd.push(bookId);
    document.getElementById("num-of-books").innerText = elementsToAdd.length;
    document.getElementById("add-books").style.visibility="visible";
}
async function addBooks() {
    if (document.getElementById("num-of-books").innerText > 0) {
        try {
            for (const bookId of elementsToAdd) {
                const res = await axios.get(`${googleUrl}/${bookId}`,{
                    params:{
                        key: apiKey
                    }
                });
                await addBookToData(res.data.volumeInfo);
            }
        } catch (error) {
            
        }
    }
    elementsToAdd.length = 0;
    document.getElementById("num-of-books").innerText = elementsToAdd.length;
}
async function addBookToData(element) {
    try {
        const exists = await check_if_exists(element.title); // boolean by name only
        if (exists) {
            console.log("Duplicate book:", element.title);
        } else {
            const copies = getRandomNumOfCopies();
            const elementToPush = getElementProperties(element);
            const res = await axios.post(booksUrl, elementToPush);
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}
function getElementProperties(element) {
    const copies = getRandomNumOfCopies();
    let res;
    try {
        res = {
            title: element.title,
            authors: element.authors || ["Anonymous"],
            numPages: element.pageCount || 0,
            description: element.description || "",
            imageLink: {
                small: element.imageLinks ? element.imageLinks.smallThumbnail : "",
                big: element.imageLinks ? element.imageLinks.thumbnail : ""
            },
            categories: element.categories || [],
            ISBN: element.industryIdentifiers || [],
            numOfCopies: copies
        };
    } catch (error) {
        console.log(element);
    }
    return res;
}

async function check_if_exists(title) {
    try {
        const response = await axios.get(booksUrl);
        const myBooks = response.data;
        for (const book of myBooks) {
            if (book.title.toLowerCase() === title.toLowerCase()) {
                return true;
            }
        }
        return false;
    } catch (error) {
        throw error;
    }
}

//Create by web
addForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        displayBookPage();
    } catch (error) {
        throw error;
    }
});

inputField.addEventListener('input', () => { // new input
    currentPage = 1;
});
function bookDetails(element, id) {
    let res;
    try {
        const title = element.title ? element.title : "--";
        const author = element.authors && element.authors[0] ? element.authors[0] : "Anonymous";
        const isbn = element.industryIdentifiers && element.industryIdentifiers[0] && element.industryIdentifiers[0].identifier ? element.industryIdentifiers[0].identifier : "--";
        const imgSrc = element.imageLinks && element.imageLinks.smallThumbnail ? element.imageLinks.smallThumbnail : "--";
        res = `
        <li onclick="addBookToList(event)" id="${id}" class="flex-group book">
                  <div class="book-text flex-group">
                    <h3>${title}</h3>
                    <p><span class="key">Authors:</span> ${author}</p>
                    <p><span class="key">ISBN:</span> ${isbn}</p>
                  </div>
                  <div class="book-img flex-group">
                    <img
                      src="${imgSrc}"
                      alt="X"
                    />
                  </div>
                </li> 
        `;
    } catch (error) {
        res = "";
        console.log(element);
    }
    return res;
}
async function displayBookPage() {
    try {
        const book = await getOnePage(generateParams());
        bookListElement.innerHTML = "";
        document.querySelector(".next").style.visibility = checkIfLastPage(book.totalItems)?"hidden":"visible";
        const booksArray = book.items;
        for (const book of booksArray) {
            const bookDetail = book.volumeInfo;
            bookListElement.innerHTML += bookDetails(bookDetail,book.id);
        }
        currentPage === 1 ? document.querySelector(".prev").style.visibility = "hidden" : document.querySelector(".prev").style.visibility = "visible";
    } catch (error) {
        throw error
    }
}
function generateParams() {
    return{
        key: apiKey,
        startIndex: currentPage,
        maxResults: pageMax,
        q: inputField.value
    }
}
function checkIfLastPage(totalElements) {
    const lastPage = Math.floor(totalElements/pageMax)+1;
    return lastPage < currentPage?true:false;
}
async function getOnePage(params) {
    try {
        const response = await axios.get(`${googleUrl}`, { params });
        return response.data;
    } catch (error) {
        throw error
    }
}


function prevPage(){
    currentPage -- ;
    displayBookPage();
}
function nextPage(){
    currentPage ++;
    displayBookPage();
}

const getRandomNumOfCopies = () => Math.floor(Math.random() * 16) + 5;
document.addEventListener('DOMContentLoaded', function () {
    const addBtnsContainer = document.querySelector('.add-btn-container');
    const addNewBookBtn = document.querySelector('.side-bar li:nth-child(3)');
    addNewBookBtn.addEventListener('click', function () {
        addBtnsContainer.style.visibility = 'visible'; 
    });
    document.getElementById("web").addEventListener("click",()=>{
        document.querySelector(".web-books-wrapper").style.display = "flex";
    });
});

//forms - only one is open at time
//Validation:
//input field, isbn not exist 
//pop up messages loader

