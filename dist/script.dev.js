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
      li.setAttribute('data-id', item.id);
      var span = document.createElement('span');
      span.textContent = item.text;
      li.appendChild(span);
      var button = document.createElement('button');
      button.className = 'btn btn-danger';
      button.appendChild(document.createTextNode('X'));
      li.appendChild(button);
      list.appendChild(li);
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
}); // Delete an item

document.querySelector('#list-group').addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-danger')) {
    UI.deleteItem(e.target);
    var itemId = e.target.parentElement.getAttribute('data-id');
    Store.removeItem(Number(itemId));
    UI.showAlert('Item Removed', 'success');
  }
}); // Search items

document.querySelector('#search').addEventListener('keyup', function (e) {
  var searchValue = e.target.value;
  UI.searchItems(searchValue);
});
//# sourceMappingURL=script.dev.js.map
