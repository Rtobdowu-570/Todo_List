"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Item = function Item(text) {
  _classCallCheck(this, Item);

  this.text = text;
  this.id = Date.now(); // unique ID

  this.completed = false;
};

var UI =
/*#__PURE__*/
function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, null, [{
    key: "displayItems",
    value: function displayItems() {
      var items = Store.getItems();
      items.forEach(function (item) {
        return UI.addItemToList(item);
      });
    }
  }, {
    key: "addItemToList",
    value: function addItemToList(item) {
      var list = document.querySelector('#list-group');
      var li = document.createElement('li');
      li.className = 'list-group-item';
      li.setAttribute('data-id', item.id); // Check if item is completed

      if (item.completed) {
        li.classList.add('completed');
      }

      var checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.className = 'form_checkbox';
      checkBox.checked = item.completed;
      li.appendChild(checkBox);
      var span = document.createElement('span');
      span.textContent = item.text;
      li.appendChild(span);
      var button = document.createElement('button');
      button.className = 'btn btn-danger';
      button.appendChild(document.createTextNode('X')); // Disable delete button if item is completed

      if (item.completed) {
        button.disabled = true;
        button.classList.add('unclickable');
      }

      li.appendChild(button);
      list.appendChild(li);
    }
  }, {
    key: "toggleItem",
    value: function toggleItem(liElement) {
      var checkBox = liElement.querySelector('.form_checkbox');
      var button = liElement.querySelector('btn-danger');
      var isCompleted = checkBox.checked; // Update UI

      liElement.classList.toggle('completed', isCompleted);

      if (isCompleted) {
        button.disabled = true;
        button.classList.add('unclickable');
      } else {
        button.disabled = false;
        button.classList.remove('unclickable');
      }
    }
  }, {
    key: "deleteItem",
    value: function deleteItem(el) {
      el.parentElement.remove();
    }
  }, {
    key: "showAlert",
    value: function showAlert(message, className) {
      var div = document.createElement('div');
      div.className = "alert ".concat(className);
      div.textContent = message;
      var main = document.querySelector('#main');
      var form = document.querySelector('#form-control');
      main.insertBefore(div, form); // Vanish in 2 seconds

      setTimeout(function () {
        return div.remove();
      }, 2000);
    }
  }, {
    key: "searchItems",
    value: function searchItems(searchValue) {
      var items = document.querySelectorAll('.list-group-item');
      items.forEach(function (item) {
        var itemText = item.querySelector('span').textContent.toLowerCase();

        if (itemText.includes(searchValue.toLowerCase())) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }
  }, {
    key: "clearFields",
    value: function clearFields() {
      document.querySelector('#input').value = '';
    }
  }]);

  return UI;
}();

var Store =
/*#__PURE__*/
function () {
  function Store() {
    _classCallCheck(this, Store);
  }

  _createClass(Store, null, [{
    key: "getItems",
    value: function getItems() {
      var items;

      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    }
  }, {
    key: "addItems",
    value: function addItems(item) {
      var items = Store.getItems();
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    }
  }, {
    key: "removeItem",
    value: function removeItem(id) {
      var items = Store.getItems();
      var filteredItems = items.filter(function (item) {
        return item.id !== id;
      });
      localStorage.setItem('items', JSON.stringify(filteredItems));
    }
  }, {
    key: "updateItem",
    value: function updateItem(id) {
      var items = Store.getItems();
      var item = items.find(function (item) {
        return item.id === id;
      });

      if (item) {
        item.completed = !item.completed;
        localStorage.setItem('items', JSON.stringify(items));
      }

      return item ? item.completed : false;
    }
  }]);

  return Store;
}(); // Event Listeners 


document.addEventListener('DOMContentLoaded', UI.displayItems);
document.querySelector('#form-control').addEventListener('submit', function (e) {
  e.preventDefault();
  var itemText = document.querySelector('#input').value;

  if (itemText === '') {
    UI.showAlert('Please add an item', 'error');
  } else {
    var item = new Item(itemText);
    UI.addItemToList(item);
    Store.addItems(item);
    UI.showAlert('Item Added', 'success');
    UI.clearFields();
  }
}); // Toggle item

document.querySelector('#list-group').addEventListener('click', function (e) {
  if (e.target.classList.contains('form_checkbox')) {
    var li = e.target.closest('.list-group-item');
    var itemId = Number(li.getAttribute('data-id')); // Update storage  

    Store.updateItem(itemId); // Update UI

    UI.toggleItem(li);
    UI.showAlert('Item Completed', 'success');
  } else {
    return;
  }
}); // Delete an item

document.querySelector('#list-group').addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-danger')) {
    // if button is not disabled 
    if (!e.target.disabled) {
      var li = e.target.closest('.list-group-item');
      var itemId = Number(li.getAttribute('data-id'));
      UI.deleteItem(li);
      Store.removeItem(itemId);
      UI.showAlert('Item Deleted', 'success');
    }
  }
}); // Search items

document.querySelector('#search').addEventListener('keyup', function (e) {
  var searchValue = e.target.value;
  UI.searchItems(searchValue);
});
//# sourceMappingURL=script.dev.js.map
