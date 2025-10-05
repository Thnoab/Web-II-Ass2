// event.js
function qs(name){ 
  return new URLSearchParams(location.search).get(name); 
}
function escapeHtml(s){ 
  return String(s||'').replace(/[&<>"']/g, c=> ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c])); 
}

async function load(){
  const id = qs('id');
  const out = document.getElementById('event');
  if (!id) { 
    out.innerHTML = '<p>No event selected.</p>'; 
    return; 
  }

  const res = await fetch('/api/events/' + id);
  if (!res.ok){ 
    out.innerHTML = '<p>Event not found.</p>'; 
    return; 
  }

  const e = await res.json();

  const imgSrc = e.image_url?.startsWith('/images/')
    ? `${window.location.origin}${e.image_url}`
    : (e.image_url || 'https://via.placeholder.com/600x300?text=No+Image');

  out.innerHTML = `
    <div class="card detail">
      <img src="${imgSrc}" alt="Event Image" class="cover">
      <h2>${escapeHtml(e.name)}</h2>
      <p class="meta">${e.org_name || ''} — ${e.location} — ${e.date} (${e.status})</p>
      <p><strong>Description:</strong> ${escapeHtml(e.description || e.short_description || '')}</p>
      <p><strong>Price:</strong> ${e.price==0 ? 'Free' : '$'+e.price}</p>
      <p><strong>Goal:</strong> $${e.goal} — <strong>Progress:</strong> $${e.progress}</p>
    </div>
  `;
}

load();
