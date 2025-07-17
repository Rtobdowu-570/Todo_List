const input = document.querySelector('#form-input');
const submit = document.querySelector('#form-submit');
const form = document.querySelector('#form-control');
const list = document.querySelector('#list-group');
const item = document.querySelector('.list-group-item');


form.addEventListener("submit", onSubmit);
   function onSubmit(e) {
    e.preventDefault();
    if (input.value === "") {
        alert("Please fill in the field")
    } else {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.appendChild(document.createTextNode(input.value));
      list.appendChild(li);

      // create a remove button
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right');
      removeBtn.appendChild(document.createTextNode('X'));
      li.appendChild(removeBtn);

      // Add event listener to remove the item
      removeBtn.addEventListener('click', removeItem);
      function removeItem(e) {
        e.target.parentElement.remove();
        console.log("Item removed");
      }
    }
    input.value = "";
    item.addEventListener('click', removeItem);
    
   };

   // Search Functionality
   const searchInput = document.querySelector('#search');

   searchInput.addEventListener('input', function(e){
    const searchValue = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.list-group-item');
    items.forEach(function(item) {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchValue)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    })
   })