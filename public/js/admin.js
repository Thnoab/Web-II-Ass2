// admin.js

const apiBase = '/api/events';
const eventTable = document.querySelector('#eventTable tbody');
const addFormSection = document.getElementById('addFormSection');
const eventForm = document.getElementById('eventForm');
const showAddFormBtn = document.getElementById('showAddForm');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');

let editMode = false;

async function loadEvents() {
  const res = await fetch(apiBase);
  const events = await res.json();
  eventTable.innerHTML = '';
  events.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.name}</td>
      <td>${e.date || '-'}</td>
      <td>${e.location || '-'}</td>
      <td>${e.category_id || '-'}</td>
      <td>${e.goal}</td>
      <td>${e.progress}</td>
      <td>
        <button onclick="editEvent(${e.id})">Edit</button>
        <button onclick="deleteEvent(${e.id})">Delete</button>
      </td>
    `;
    eventTable.appendChild(tr);
  });
}

showAddFormBtn.addEventListener('click', () => {
  eventForm.reset();
  document.getElementById('eventId').value = '';
  formTitle.textContent = 'Add New Event';
  editMode = false;
  addFormSection.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  addFormSection.classList.add('hidden');
});

eventForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    short_description: document.getElementById('short_description').value,
    description: document.getElementById('description').value,
    location: document.getElementById('location').value,
    date: document.getElementById('date').value,
    start_time: document.getElementById('start_time').value,
    price: document.getElementById('price').value,
    goal: document.getElementById('goal').value,
    progress: document.getElementById('progress').value,
    category_id: document.getElementById('category_id').value,
    org_id: document.getElementById('org_id').value,
    image_url: document.getElementById('image_url').value
  };

  let url = apiBase;
  let method = 'POST';
  if (editMode) {
    const id = document.getElementById('eventId').value;
    url = `${apiBase}/${id}`;
    method = 'PUT';
  }

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert(editMode ? 'Event updated!' : 'Event added!');
    addFormSection.classList.add('hidden');
    loadEvents();
  } else {
    const err = await res.json();
    alert('Error: ' + err.error);
  }
});

async function deleteEvent(id) {
  if (!confirm('Delete this event?')) return;
  const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  if (res.ok) {
    alert('Deleted!');
    loadEvents();
  } else {
    const err = await res.json();
    alert('Error: ' + err.error);
  }
}

async function editEvent(id) {
  const res = await fetch(`${apiBase}/${id}`);
  const event = await res.json();
  formTitle.textContent = 'Edit Event';
  editMode = true;
  addFormSection.classList.remove('hidden');
  document.getElementById('eventId').value = event.id;
  document.getElementById('name').value = event.name;
  document.getElementById('short_description').value = event.short_description;
  document.getElementById('description').value = event.description;
  document.getElementById('location').value = event.location;
  document.getElementById('date').value = event.date ? event.date.split('T')[0] : '';
  document.getElementById('start_time').value = event.start_time || '';
  document.getElementById('price').value = event.price;
  document.getElementById('goal').value = event.goal;
  document.getElementById('progress').value = event.progress;
  document.getElementById('category_id').value = event.category_id;
  document.getElementById('org_id').value = event.org_id;
  document.getElementById('image_url').value = event.image_url;
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  window.location.href = 'login.html';
});

loadEvents();
