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

    // Check if item is completed
    if (item.completed) {
      li.classList.add('completed');
    }
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'form_checkbox';
    checkBox.checked = item.completed;
    li.appendChild(checkBox);


    const span = document.createElement('span');
    span.textContent = item.text;
    li.appendChild(span);

    const button = document.createElement('button');
    button.className = 'btn btn-danger';
    button.appendChild(document.createTextNode('X'));

  // Disable delete button if item is completed
  if(item.completed) {
    button.disabled = false;
    button.classList.add('unclickable');
  }

    li.appendChild(button);
    list.appendChild(li);
  }


  static toggleItem(liElement) {
    const checkBox = liElement.querySelector('.form_checkbox');
    const button = liElement.querySelector('btn-danger');
    const isCompleted = checkBox.checked;

    // Update UI
    liElement.classList.toggle('completed', isCompleted);
    

    if (isCompleted) {
      button.disabled = true;
      button.classList.add('unclickable');
    } else {
      button.disabled = false;
      button.classList.remove('unclickable');
    }
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

  static filterItems(filter) {
    const items = document.querySelectorAll('.list-group-item');
    items.forEach((item) => {
      if (filter === "all") {
        item.style.display = 'flex';
      }
      if (filter === "completed") {
        if (item.classList.contains('completed')) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      }
      if (filter === "pending") {
        if (!item.classList.contains('completed')) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
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

 static updateItem(id) {
  const items = Store.getItems();
  const item = items.find(item => item.id === id);
  if (item) {
    item.completed = !item.completed;
    localStorage.setItem('items', JSON.stringify(items));
  }
  return item ? item.completed : false;
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

  // Toggle item
document.querySelector('#list-group').addEventListener('click', (e) => {
  if ( e.target.classList.contains('form_checkbox')) {
  const li = e.target.closest('.list-group-item');
  const itemId = Number(li.getAttribute('data-id'));
  
  // Update storage  
  Store.updateItem(itemId);

  // Update UI
  UI.toggleItem(li);
  UI.showAlert('Item Completed', 'success');
  
  } else {
    return;
  }
});

  // Delete an item
document.querySelector('#list-group').addEventListener('click', (e) => {
  if ( e.target.classList.contains('btn-danger')) {

    // if button is not disabled 
    if (!e.target.disabled) {
      const li = e.target.closest('.list-group-item');
      const itemId = Number(li.getAttribute('data-id'));

      UI.deleteItem(li);
      Store.removeItem(itemId);
      UI.showAlert('Item Deleted', 'success');
    }
  }
});

// Search items
document.querySelector('#search').addEventListener('keyup', (e) => {
  const searchValue = e.target.value;
  UI.searchItems(searchValue);
});

// Display Filter items
let icon = document.getElementsByTagName('i')[0];
icon.addEventListener('click', (e) => {
  document.querySelector('.filter_list').classList.toggle('hidden');
  document.querySelector('.filter_list').classList.add('show');
});

// Filter items Options
document.querySelector('.filter_list').addEventListener('click', (e) => {
  if (e.target.classList.contains('filter_list__option')) {
    const option = e.target.getAttribute('data-filter');
    UI.filterItems(option);
    document.querySelector('.filter_list').classList.remove('show');
  }
});
