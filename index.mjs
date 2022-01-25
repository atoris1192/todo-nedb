
// import * as path from "path"
import  Nedb  from "nedb";

// const filepath = path.join(__dirname, 'sample1.db');
const db = new Nedb({
    // filename: 'todo.db',
    autoload: true,
});

class EventEmitter {
    constructor() {
        this._listeners = new Map();
    }

    addEventListener(type, listener) {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, new Set());
        }
        const listenerSet = this._listeners.get(type);
        listenerSet.add(listener);
    }

    emit(type) {
        const listenerSet = this._listeners.get(type);
        if (!listenerSet) {
            return;
        }
        listenerSet.forEach(listener => {
            listener.call(this);
        });
    }
}

const eventEmitter = new EventEmitter()  // ここだけクラスインスタンスを使用します
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
        "created": new Date(),
    };
    db.insert(item, function (err, newDoc) {   // Callback is optional
      if(err) {console.error('Err: ',err)}
      console.log('newDoc: ',newDoc)
    });


    // todoListItems.push(item);
    inputElement.value = "";
    eventEmitter.emit("todoListItems Update")

})

// view関係
eventEmitter.addEventListener("todoListItems Update", () => {
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
});


function htmlToElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild;
}


const getAll= () => {
  return new Promise((resolve, reject) => {
    // db.find({}, (err, data)=> {
    db.find().sort({ created: 1 }).exec((err, data) =>{
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