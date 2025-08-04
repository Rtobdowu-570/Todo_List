class Item {
  constructor(text) {
    this.text = text;
    this.id = Date.now(); // unique ID
    this.completed = false;
  }
}

class UI {
   static displayItems() {
    const items = Store.getItems();
    items.forEach((item) => UI.addItemToList(item));
  }

  static addItemToList(item) {
    const list = document.querySelector('#list-group');
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.setAttribute('data-id', item.id);

    const span = document.createElement('span');
    span.textContent = item.text;
    li.appendChild(span);

    const button = document.createElement('button');
    button.className = 'btn btn-danger';
    button.appendChild(document.createTextNode('X'));
    li.appendChild(button);
    list.appendChild(li);
  }

  static deleteItem(el) {
      el.parentElement.remove();
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.textContent = message;
    const main = document.querySelector('#main');
    const form = document.querySelector('#form-control');
    main.insertBefore(div, form);

    // Vanish in 2 seconds
    setTimeout(() => div.remove(), 2000);
  }

  static searchItems(searchValue) {
    const items = document.querySelectorAll('.list-group-item');
    items.forEach((item) => {
       const itemText = item.querySelector('span').textContent.toLowerCase();
       if(itemText.includes(searchValue.toLowerCase())) {
        item.style.display = 'flex';
       } else {
        item.style.display = 'none';
       }
    })
  }

  static clearFields() {
    document.querySelector('#input').value = '';
  }
}

class Store {

   static getItems() {
    let items;
    if (localStorage.getItem('items') === null) {
      items = [];
      } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
   }

   static addItems(item) {
    const items = Store.getItems();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
   }

   static removeItem(id) {
    const items = Store.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem('items', JSON.stringify(filteredItems));
 }

}

// Event Listeners 
document.addEventListener('DOMContentLoaded', UI.displayItems);

document.querySelector('#form-control').addEventListener('submit', (e) => {
  e.preventDefault();
  const itemText = document.querySelector('#input').value;
  if (itemText === '') {
    UI.showAlert('Please add an item', 'error');
  } else {
    const item = new Item(itemText);
    UI.addItemToList(item);
    Store.addItems(item);
    UI.showAlert('Item Added', 'success');
    UI.clearFields();
  }
  });

  // Delete an item
document.querySelector('#list-group').addEventListener('click', (e) => {
  if ( e.target.classList.contains('btn-danger')) {
  UI.deleteItem(e.target);
  const itemId = e.target.parentElement.getAttribute('data-id');
  Store.removeItem(Number(itemId));
  UI.showAlert('Item Removed', 'success');
  }
});

// Search items
document.querySelector('#search').addEventListener('keyup', (e) => {
  const searchValue = e.target.value;
  UI.searchItems(searchValue);
});