
// import * as path from "path"
import  Nedb  from "nedb";

// const filepath = path.join(__dirname, 'sample1.db');
const db = new Nedb({
    filename: 'todo.db',
    autoload: true,
});


const formElement = document.querySelector("#js-form");
const inputElement = document.querySelector("#js-form-input");
const containerElement = document.querySelector("#js-todo-list");
const todoItemCountElement = document.querySelector("#js-todo-count");


// let todoListItems = [];
let idNum = 0;

formElement.addEventListener("submit" , (event) => {
    event.preventDefault();

    const item = {
        "id": idNum ++,
        "title": inputElement.value,
        "completed" : false,
    };
    db.insert(item, function (err, newDoc) {   // Callback is optional
      if(err) {console.error('Err: ',err)}
      console.log('newDoc: ',newDoc)
    });


    // todoListItems.push(item);
    inputElement.value = "";

    // console.log(todoListItems)

    // view関係
    const ulElement = htmlToElement(`<ul />`)
    getAll()
      .then(res => {
        res.forEach((ITEM) => {
            const liElement = htmlToElement(`<li>${ITEM.title}</li>`)
            ulElement.appendChild(liElement)
        })
        // console.log(res)
      })
    containerElement.innerHTML = "";
    containerElement.appendChild(ulElement);

    getCount()
      .then(count => { 
        // console.log(count)
        todoItemCountElement.textContent = `Todoアイテム数 : ${count}`
      })


})


function htmlToElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild;
}


const getAll= () => {
  return new Promise((resolve, reject) => {
    db.find({}, (err, data)=> {
      if (err) { reject(err)}
      else resolve(data)
    })
  })
  .catch(err => { console.error(err)})
};

const getCount = () => {
  return new Promise((resolve, reject) => {
    db.count({}, (err, count) => {
      if (err) {reject(err)}
      else resolve(count)
    })
  })
  .catch(err => { console.error(err)})
}