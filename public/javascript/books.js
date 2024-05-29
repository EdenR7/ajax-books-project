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
let errorInAddingElements = [];



//Add new books
async function addBookToList(event) { // add book to list by click
    const bookId = event.currentTarget.id;
    const book = await getOneBookById(bookId);
    const exists = await check_if_exists(book.data.volumeInfo.title);
    if (exists || elementsToAdd.includes(bookId)) {
        displayFailure(`${book.data.volumeInfo.title} already exists!`)
    } else {
        elementsToAdd.push(bookId);
        document.getElementById("num-of-books").innerText = elementsToAdd.length;
        document.getElementById("add-books").style.display = "block";
    }
}
async function addBooks() { // add the whole books list
    if (document.getElementById("num-of-books").innerText > 0) {
        errorInAddingElements.length = 0; //reset history of errors
        try {
            displayLoader(document.querySelector(".web-books-wrapper"));
            for (const bookId of elementsToAdd) {
                const res = await getOneBookById(bookId);
                const element = res.data.volumeInfo;
                await addBookToData(getElementProperties(element));
            }
            if (errorInAddingElements.length == 0) { // error tracking
                displaySuccess();
            } else {
                const errMsg = errorMessageGenerator();
                displayFailure(errMsg);
            }
        } catch (error) {
            displayFailure("Sorry, there was an ERROR in operation");
        }
        errorInAddingElements.length = 0;
        closeLoader(document.querySelector(".web-books-wrapper"));
    }
    elementsToAdd.length = 0;
    document.getElementById("add-books").style.display = "none";

}
async function addBookToData(element) { // add a book, if there wan an error it will update
    try {
        await axios.post(booksUrl, element);
    } catch (error) {
        errorInAddingElements.push(element.title);
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
    }
    return res;
}

async function getOneBookById(bookId) { // get a book
    const res = await axios.get(`${googleUrl}/${bookId}`, {
        params: {
            key: apiKey
        }
    });
    return res;
}
async function check_if_exists(title) { //Check if the book exists
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
function errorMessageGenerator() {
    let resMessage = "Error in attempt to add ";
    for (const title of errorInAddingElements) {
        resMessage += `"${title}", `;
    }
    return resMessage.slice(0, -2);
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
    }
    return res;
}
async function displayBookPage() {
    try {
        displayLoader(document.querySelector(".web-books-wrapper"));
        const book = await getOnePage(generateParams());
        closeLoader(document.querySelector(".web-books-wrapper"));
        bookListElement.innerHTML = "";
        document.querySelector(".next").style.visibility = checkIfLastPage(book.totalItems) ? "hidden" : "visible";
        const booksArray = book.items;
        for (const book of booksArray) {
            const bookDetail = book.volumeInfo;
            bookListElement.innerHTML += bookDetails(bookDetail, book.id);
        }
        currentPage === 1 ? document.querySelector(".prev").style.visibility = "hidden" : document.querySelector(".prev").style.visibility = "visible";
    } catch (error) {
        throw error;
    }
}
function generateParams() {
    return {
        key: apiKey,
        startIndex: currentPage,
        maxResults: pageMax,
        q: inputField.value
    }
}
function checkIfLastPage(totalElements) {
    const lastPage = Math.floor(totalElements / pageMax) + 1;
    return lastPage < currentPage ? true : false;
}
async function getOnePage(params) {
    try {
        const response = await axios.get(`${googleUrl}`, { params });
        return response.data;
    } catch (error) {
        throw error
    }
}

//manually add 
const manuallyForm = document.getElementById("add")
manuallyForm.addEventListener("submit", async (event) => {
    try {
        errorInAddingElements.length = 0;
        event.preventDefault();
        const data = getFormData();
        if (validateRequiredFields(data)) {
            const bookElem = createBookProperties(data);
            displayLoader(document.querySelector(".forms-container"));
            const isDup = await check_if_exists(bookElem.title);
            if (!isDup) {
                await addBookToData(bookElem);
                displaySuccess();
                event.target.reset();
            } else {
                errorInAddingElements.push(bookElem.title)
                displayFailure(errorMessageGenerator());
            }
        } else {
            displayFailure("Please fill all the req FIELDS");
        }
    } catch (error) {
        displayFailure("Sorry, there was an ERROR in operation");
    }

    closeLoader(document.querySelector(".forms-container"));

})
// collect the form data 
function getFormData() {
    const formDataElem = new FormData(manuallyForm);
    const data = {};
    formDataElem.entries().forEach(element => {
        data[element[0]] = element[1];
    });
    return data;
}
// validations
function validateRequiredFields(data) {
    for (const key in data) {
        if (key === "imageLink-small" || key === "imageLink-big") {
        } else {
            if (!data[key]) {
                return false;
            }
        }
    }
    // design operations, clear fields  
    return true;
}
//convert the data to a ready to insert book
function createBookProperties(data) {
    return {
        title: data.title,
        authors: data.authors.split(","),
        numPages: data.numPages,
        description: data.description,
        imageLink: {
            "small": data['imageLink-small'],
            "big": data['imageLink-big']
        },
        categories: data.categories.split(","),
        ISBN: [{
            "type": "ISBN_10",
            "identifier": data.ISBN
        }],
        numOfCopies: getRandomNumOfCopies()
    }

    //title
    //authors []
    //numpages
    //desc
    //imageLink {}
    //categories []
    //isbn[{"type": "ISBN_10","identifier": "0830879110"}]
    // num copies
}

//manually delete 
document.querySelector("#delete").addEventListener("submit", async (e) => {
    try {
        e.preventDefault();
        const desiredIsbn = document.querySelector("#delete-isbn").value;
        displayLoader(document.querySelector(".forms-container"));
        const response = await searchIsbn(desiredIsbn);
        if (response) {
            deleteBook(response.id);
        } else {
            displayFailure(`Error! ${desiredIsbn} dont exist in system!`);
        }
        e.target.reset();
    } catch (error) {
        displayFailure(`System Error!`);
    }
    closeLoader(document.querySelector(".forms-container"));
})
async function searchIsbn(identifier) {
    const res = await axios.get(booksUrl);
    const booksArray = res.data;
    for (const book of booksArray) {
        const bookIsbns = book.ISBN;
        if (bookIsbns && bookIsbns.length > 0) {
            for (const isbn of bookIsbns) {
                if (isbn.identifier == identifier) {
                    return book;
                }
            }
        }
    }
    return;
}
async function deleteBook(bookId) {
    try {
        const res = await axios.delete(`${booksUrl}/${bookId}`)
        displaySuccess();
    } catch (error) {
        displayFailure("System Error!")
    }
}

function displayLoader(element) {
    element.querySelector('.loader-container').style.display = "block";
}
function closeLoader(element) {
    setTimeout(() => {
        element.querySelector('.loader-container').style.display = "none";
    }, 50)
}
function displaySuccess() {
    const element = document.querySelector('.success-container');
    element.style.display = "block";
    setTimeout(() => {
        element.style.display = "none";
    }, 1000)
}
function displayFailure(text) {
    const element = document.querySelector('.failure-container');
    element.style.display = "block";
    document.querySelector(".status-desc").innerText = text;
}
function closeFailure() {
    document.querySelector('.failure-container').style.display = "none";
    document.querySelector(".status-desc").innerText = "";
}
function prevPage() {
    currentPage--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    displayBookPage();
}
function nextPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPage++;
    displayBookPage();
}

const getRandomNumOfCopies = () => Math.floor(Math.random() * 16) + 5;
document.addEventListener('DOMContentLoaded', function () {
    const addBtnsContainer = document.querySelector('.add-btn-container');
    const addNewBookBtn = document.querySelector('.side-bar li:nth-child(3)');
    addNewBookBtn.addEventListener('click', function () {
        addBtnsContainer.style.visibility = 'visible';
        document.getElementById("add").style.display = "none";
        document.getElementById("delete").style.display = "none";

    });
    document.getElementById("web").addEventListener("click", () => {
        document.querySelector(".web-books-wrapper").style.display = "flex";
        document.getElementById("add").style.display = "none";
        document.getElementById("delete").style.display = "none";
    });
    document.querySelector("#manually").addEventListener('click', () => {
        document.querySelector(".web-books-wrapper").style.display = "none";
        document.getElementById("add").style.display = "grid";
    });
    document.querySelector('.side-bar li:nth-child(2)').addEventListener('click', () => {
        addBtnsContainer.style.visibility = 'hidden';
        document.querySelector("#delete ").style.display = "block";
        document.querySelector(".web-books-wrapper").style.display = "none";
        document.getElementById("add").style.display = "none";
    })

});

//forms - only one is open at time
//input field, isbn not exist 

