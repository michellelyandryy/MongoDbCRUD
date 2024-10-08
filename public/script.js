const itemList = document.getElementById('itemList');
const addItem = document.getElementById('addItem');

function fetchItems() {
    fetch('/items')
        .then(response => response.json())
        .then(items => {
            itemList.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${item.name}</strong>: ${item.description}
                    <button onclick="deleteItem('${item._id}')">Delete</button>
                    <button onclick="editItem('${item._id}', '${item.name}', '${item.description}')">Edit</button>
                `;
                itemList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}

// add a new item
addItem.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
    })
        .then(response => response.json())
        .then(() => {
            fetchItems();
            itemList.appendChild(li);
            addItem.reset();
        })
        .catch(error => console.error('Error adding item:', error));
});

// delete an item   
function deleteItem(id) {
    fetch(`/items/${itemId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => {
            fetchItems();
        })
        .catch(error => console.error('Error deleting item:', error));
}

// edit an item
function editItem(id, name, description) {
    const newName = prompt('Enter new name:', name);
    const newDescription = prompt('Enter new description: ', description);

    fetch(`/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, description: newDescription })
    })
        .then(() => fetchItems())
        .catch(error => console.error('Error editing item: ', error));
}

fetchItems();
