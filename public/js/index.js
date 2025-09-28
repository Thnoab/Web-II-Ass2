// index.js - fetch events and render brief cards
async function loadEvents(){
  try {
    const res = await fetch('/api/events');
    const events = await res.json();
    const out = document.getElementById('events');
    if (!events || events.length === 0) { out.innerHTML = '<p>No events found.</p>'; return; }
    out.innerHTML = events.map(e => `
      <div class="card">
        <h3>${escapeHtml(e.name)} <small>(${escapeHtml(e.category_name||'')})</small></h3>
        <p class="meta">${e.org_name || ''} — ${e.location || ''} — ${e.date} (${e.status})</p>
        <p>${escapeHtml(e.short_description || (e.description||'').slice(0,140))}</p>
        <p>Price: ${e.price==0 ? 'Free' : '$'+e.price} — Goal: $${e.goal} — Raised: $${e.progress}</p>
        <a href="event.html?id=${e.id}">View Details</a>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('events').innerText = 'Failed to load events: ' + err.message;
  }
}
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
loadEvents();
