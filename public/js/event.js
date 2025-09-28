// event.js - fetch single event by id and render full details
function qs(name){ return new URLSearchParams(location.search).get(name); }
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function load(){
  const id = qs('id');
  if (!id) { document.getElementById('event').innerHTML = '<p>No event selected.</p>'; return; }
  const res = await fetch('/api/events/' + id);
  if (!res.ok){ document.getElementById('event').innerHTML = '<p>Event not found.</p>'; return; }
  const e = await res.json();
  document.getElementById('event').innerHTML = `
    <h1>${escapeHtml(e.name)}</h1>
    <p class="meta">${e.org_name || ''} — ${e.location} — ${e.date} (${e.status})</p>
    <p><strong>Description:</strong> ${escapeHtml(e.description || e.short_description || '')}</p>
    <p><strong>Price:</strong> ${e.price==0 ? 'Free' : '$'+e.price}</p>
    <p><strong>Goal:</strong> $${e.goal} — <strong>Progress:</strong> $${e.progress}</p>
    <button id="register">Register</button>
  `;
  document.getElementById('register').addEventListener('click', ()=> alert('This feature is currently under construction.'));
}
load();
