
import * as path from "path"
import  Nedb  from "nedb";

const filepath = path.join(__dirname, 'sample1.db');
const db = new Nedb({
    filename: filepath,
    autoload: true,
});

// var doc = { hello: 'world'
//                , n: 5
//                , today: new Date()
//                , nedbIsAwesome: true
//                , notthere: null
//                , notToBeSaved: undefined  // Will not be saved
//                , fruits: [ 'apple', 'orange', 'pear' ]
//                , infos: { name: 'nedb' }
//                };

// db.insert(doc, function (err, newDoc) {   // Callback is optional
//   if(err) {console.error('Err: ',err)}
//   console.log('newDoc: ',newDoc)
// });

const getAll= () => {
  return new Promise((resolve, reject) => {
    db.find({}, (err, data)=> {
      if (err) { reject(err)}
      else resolve(data)
    })
  })
  .catch(err => { console.error(err)})
};

getAll()
  .then(res => {
    console.log(res)
  })



const formElement = document.querySelector("#js-form");
const inputElement = document.querySelector("#js-form-input");
const containerElement = document.querySelector("#js-todo-list");
const todoItemCountElement = document.querySelector("#js-todo-count");


let todoListItems = [];
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

})

