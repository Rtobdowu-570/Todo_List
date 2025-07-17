"use strict";

var input = document.querySelector('#form-input');
var submit = document.querySelector('#form-submit');
var form = document.querySelector('#form-control');
var list = document.querySelector('#list-group');
var item = document.querySelector('.list-group-item');
form.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();

  if (input.value === "") {
    alert("Please fill in the field");
  } else {
    var _removeItem = function _removeItem(e) {
      e.target.parentElement.remove();
      console.log("Item removed");
    };

    var li = document.createElement('li');
    li.classList.add('list-group-item');
    li.appendChild(document.createTextNode(input.value));
    list.appendChild(li); // create a remove button

    var removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right');
    removeBtn.appendChild(document.createTextNode('X'));
    li.appendChild(removeBtn); // Add event listener to remove the item

    removeBtn.addEventListener('click', _removeItem);
  }

  input.value = "";
  item.addEventListener('click', removeItem);
}

; // Search Functionality

var searchInput = document.querySelector('#search');
searchInput.addEventListener('input', function (e) {
  var searchValue = e.target.value.toLowerCase();
  var items = document.querySelectorAll('.list-group-item');
  items.forEach(function (item) {
    var text = item.textContent.toLowerCase();

    if (text.includes(searchValue)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
});
//# sourceMappingURL=script.dev.js.map
