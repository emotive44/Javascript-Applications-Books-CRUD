import {get, post, put, deleted} from './requestData.js';

function load() {
    get('appdata', 'books')
    .then(showBook)
    .then(addEvent);
}

function showBook(data) {
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    data.map(x => {
        let row = document.createElement('tr');
        row.setAttribute('data-id', `${x._id}`)
        row.innerHTML = `
        <tr>
        <td>${x.title}</td>
            <td>${x.author}</td>
            <td>${x.isbn}</td>
            <td>
                <button class='edit'>Edit</button>
                <button class='delete'>Delete</button>
            </td>
        </tr>`
        tbody.appendChild(row)
    });
}

function addEvent() {
    //// Add event on buttons for every book
    Array.from(document.querySelectorAll('.edit')).map(x => {
        x.addEventListener('click', edit);
    });

    Array.from(document.querySelectorAll('.delete')).map(x => {
        x.addEventListener('click', del);
    });
}

function createBook(e) {
    e.preventDefault();
    let isbn = document.getElementById('isbn').value;
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;

    post('appdata', 'books', { title, author, isbn})
        .then(load)
        .then(reset)
}

function reset() {
    document.getElementById('isbn').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
}

let ID = ''; //// id with which can edit and delete boooks
const form = document.createElement('form');
function edit(e) {
    let ar = [];                //// Get information to make Edit
    let inputs = Array.from(document.querySelectorAll('#createBook input'));
    Array.from(e.target.parentNode.parentNode.children).map((x, i) => {
        if(i <= inputs.length - 1) {
            ar.push(x.innerText);
        }
    });
    let [title, author, isbn] = [...ar];
    
    document.getElementById('createBook').style.display = 'none';////hide form for create book
    form.innerHTML = '';
    form.innerHTML = `
        <h3>FORM EDIT</h3>
        <label>TITLE</label>
        <input type="title" id="editedTitle" value='${title}'>
        <label>AUTHOR</label>
        <input type="title" id="editedAuthor" value='${author}'>
        <label>ISBN</label>
        <input type="title" id="editedIsbn" value='${isbn}'>`;
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('id','edit');
    editBtn.style.color = 'red';
    editBtn.style.padding = '5px 30px';
    form.appendChild(editBtn);
    document.querySelector('#form').appendChild(form);
    ID = e.target.parentNode.parentNode.getAttribute('data-id');

    editBtn.addEventListener('click', editedSubmit);
}

function editedSubmit(e) {
    e.preventDefault();
    let isbn = document.getElementById('editedIsbn').value;
    let title = document.getElementById('editedTitle').value;
    let author = document.getElementById('editedAuthor').value;

    put('appdata', `books/${ID}`, {title, author, isbn})
        .then(editedReset)
        .then(load);
}

function editedReset() {
    document.getElementById('editedIsbn').value = '';
    document.getElementById('editedTitle').value = '';
    document.getElementById('editedAuthor').value = '';
}

function del(e) {
    ID =  e.target.parentNode.parentNode.getAttribute('data-id');
    deleted('appdata', `books/${ID}`)
        .then(load);
}

(function attachEvents() {
    document.getElementById('loadBooks').addEventListener('click', load);
    document.getElementById('submit').addEventListener('click', createBook);
}());
