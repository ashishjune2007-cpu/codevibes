/**
 * API client for Code Vibes backend (FastAPI).
 * - In Vite dev: leave VITE_API_BASE_URL empty to use the /api proxy (see vite.config.js).
 * - Production / direct: set VITE_API_BASE_URL=http://localhost:8000 (or your API host).
 * All functions gracefully fall back to client-side behaviour when the backend is offline.
 */

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim();
// Empty string => relative /api (proxied by Vite). Absolute URL => direct call.
const API_BASE_URL = RAW_BASE.replace(/\/$/, '');

function apiUrl(path) {
  // path always starts with /api/...
  return `${API_BASE_URL}${path}`;
}

function isNetworkError(err) {
  if (!err) return false;
  const msg = String(err.message || '');
  return (
    err.name === 'TypeError' ||
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('Network request failed') ||
    msg.includes('Load failed')
  );
}

/**
 * Login user via backend FastAPI / Supabase, with automatic client-side fallback if server is offline.
 */
export async function apiLogin(email, password, role = 'member') {
  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const contentType = res.headers.get('content-type') || '';
    // A production SPA host (for example Netlify) may return index.html for
    // an unconfigured /api route. Do not misreport that routing failure as
    // invalid credentials.
    if (!contentType.includes('application/json')) {
      if (res.status === 404 || contentType.includes('text/html')) {
        throw new Error(
          'Authentication API was not found. Configure VITE_API_BASE_URL to your deployed FastAPI backend, then rebuild/redeploy the frontend.'
        );
      }
      throw new Error(`Authentication server returned an unexpected response (HTTP ${res.status}).`);
    }
    const data = await res.json();
    if (res.ok) return data;
    throw new Error(data.detail || `Login failed (HTTP ${res.status}).`);
  } catch (err) {
    if (isNetworkError(err)) {
      if (role === 'admin') {
        throw new Error('Admin login requires a reachable authentication server. Please try again when the server is online.');
      }
      console.warn('Backend API unreachable at ' + (API_BASE_URL || window.location.origin) + ', using member-only demo fallback.');
      const name = email.split('@')[0];
      return {
        status: 'success',
        user: {
          id: `usr-${Date.now()}`,
          email,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          role: 'member',
          avatar: '',
          isVerified: true,
        },
        token: `vibe_verified_${Date.now()}`,
      };
    }
    throw err;
  }
}

/**
 * Register user via backend FastAPI, with fallback.
 */
export async function apiRegister(name, email, password) {
  try {
    const res = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'member' }),
    });

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Registration failed.');
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('Backend API unreachable, using verified client fallback mode.');
      return {
        status: 'success',
        message: 'Account created successfully',
        user: {
          id: `usr-${Date.now()}`,
          email,
          name,
          role: 'member',
          avatar: '',
          isVerified: true,
        },
        token: `vibe_verified_${Date.now()}`,
      };
    }
    throw err;
  }
}

/**
 * Update builder profile (Name, WhatsApp number).
 */
export async function apiUpdateProfile({ email, name, whatsapp }) {
  try {
    const res = await fetch(apiUrl('/api/auth/profile'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, whatsapp }),
    });

    if (res.ok) {
      return await res.json();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update profile.');
  } catch (err) {
    console.warn('Backend profile update failed, using client fallback:', err.message);
    return {
      status: 'success',
      message: 'Profile updated locally.',
      user: { email, name, whatsapp },
    };
  }
}

/**
 * RSVP for an event via backend.
 */
export async function apiRsvpEvent(eventId, name, email, role = 'Developer', answers = {}) {
  try {
    const res = await fetch(apiUrl(`/api/events/${eventId}/rsvp`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, answers }),
    });

    if (res.ok) {
      return await res.json();
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration could not be submitted.');
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn('Backend RSVP unavailable. Registration was not saved.');
      throw new Error('Registration service is unavailable. Please try again later.');
    }
    throw err;
  }
}

/**
 * Fetch all events from backend.
 */
export async function apiGetEvents(params = {}) {
  try {
    const qs = new URLSearchParams();
    if (params.category) qs.set('category', params.category);
    if (params.is_past !== undefined && params.is_past !== null) {
      qs.set('is_past', String(params.is_past));
    }
    const query = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(apiUrl(`/api/events${query}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch events from backend:', err.message);
  }
  return null;
}

/**
 * Fetch a single event by id.
 */
export async function apiGetEvent(eventId) {
  try {
    const res = await fetch(apiUrl(`/api/events/${eventId}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch event from backend:', err.message);
  }
  return null;
}

/**
 * Admin: Post / Create a new event.
 */
export async function apiCreateEvent(eventData) {
  try {
    const res = await fetch(apiUrl('/api/events'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      return await res.json();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create event.');
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    console.warn('Backend create event failed, using client mode:', err.message);
    const slug = (eventData.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return {
      id: slug || `event-${Date.now()}`,
      ...eventData,
      attendees: eventData.attendees ?? 0,
      registration_open: eventData.registration_open ?? true,
      created_at: new Date().toISOString(),
    };
  }
}

/**
 * Admin: Update / Edit existing event details.
 */
export async function apiUpdateEvent(eventId, eventData) {
  try {
    const res = await fetch(apiUrl(`/api/events/${eventId}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      return await res.json();
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update event.');
  } catch (err) {
    console.warn('Backend update event failed, using local update:', err.message);
    return { id: eventId, ...eventData };
  }
}

/**
 * Admin: Toggle event registration (Open / Closed).
 */
export async function apiToggleEventRegistration(eventId) {
  try {
    const res = await fetch(apiUrl(`/api/events/${eventId}/toggle-registration`), {
      method: 'PATCH',
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend toggle registration failed:', err.message);
  }
  return null;
}

/**
 * Admin: Delete event.
 */
export async function apiDeleteEvent(eventId) {
  try {
    const res = await fetch(apiUrl(`/api/events/${eventId}`), {
      method: 'DELETE',
    });

    if (res.ok || res.status === 204) {
      return { status: 'success', id: eventId };
    }
  } catch (err) {
    console.warn('Backend delete event failed:', err.message);
  }
  return { status: 'success', id: eventId };
}

/**
 * Netlify-friendly email fallback (FormSubmit.co).
 * Works without FastAPI — form data goes straight to NOTIFY email.
 * Set VITE_CONTACT_EMAIL in frontend/.env (e.g. your Gmail).
 */
/**
 * Collaborator applications are submitted to Netlify Forms on the same origin.
 * This avoids third-party FormSubmit CORS/preflight failures. Configure a
 * notification in Netlify: Forms -> collaborator-intake -> Form notifications.
 */
const COLLABORATE_FORM_NAME = 'collaborator-intake';

async function submitNetlifyForm(payload) {
  const body = new URLSearchParams({
    'form-name': COLLABORATE_FORM_NAME,
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(', ') : String(value ?? ''),
      ])
    ),
  });

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Netlify form submission failed (HTTP ${response.status}). Please try again.`);
  }
  return { status: 'success' };
}

/**
 * Collaborator: Submit an application.
 * Uses same-origin Netlify Forms, not the FormSubmit AJAX endpoint.
 */
export async function apiSubmitApplication(formData) {
  const payload = {
    fullName: formData.fullName || formData.name,
    email: formData.email,
    github: formData.github,
    discord: formData.discord,
    portfolio: formData.portfolio,
    role: formData.role,
    experience: formData.experience,
    location: formData.location,
    skills: formData.skills,
    goals: formData.goals,
    availability: formData.availability || formData.commitment,
    communicationPref: formData.communicationPref,
    bio: formData.bio || formData.pitch,
    featuredWork: formData.featuredWork,
    agreedToConduct: 'Yes',
  };

  await submitNetlifyForm(payload);
  return {
    id: `NETLIFY-${Date.now()}`,
    status: 'Under Review',
    email_sent: true,
  };
}

/**
 * Admin: Fetch collaborator applications.
 */
export async function apiGetApplications() {
  try {
    const res = await fetch(apiUrl('/api/applications'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend fetch applications failed:', err.message);
  }
  return null;
}

/**
 * Admin: Update collaborator application status (Accepted, Rejected, Under Review).
 */
export async function apiUpdateApplicationStatus(appId, status) {
  try {
    const res = await fetch(apiUrl(`/api/applications/${appId}/status`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend update application status failed:', err.message);
  }
  return { id: appId, status };
}

/**
 * Health check against backend.
 */
export async function apiHealth() {
  try {
    const res = await fetch(apiUrl('/api/health'));
    if (res.ok) return await res.json();
  } catch {
    /* offline */
  }
  return null;
}

/**
 * Join community (from Join Community modal).
 * Backend only if VITE_API_BASE_URL set; else FormSubmit email.
 */
export async function apiJoinCommunity(formData) {
  if (API_BASE_URL) {
    try {
      const res = await fetch(apiUrl('/api/community/join'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend community join failed, using email fallback:', err.message);
    }
  }

  await sendViaFormSubmit(
    {
      type: 'Community Join',
      name: formData.name,
      email: formData.email,
      github: formData.github,
      interest: formData.interest,
    },
    `[Code Vibe] New community join — ${formData.name || 'Someone'}`
  );
  return {
    status: 'success',
    message: `Welcome to The Code Vibe network, ${formData.name}!`,
    email_sent: true,
  };
}

/** Fetch event registrations for the admin dashboard. */
export async function apiGetEventRegistrations(eventId) {
  const res = await fetch(apiUrl(`/api/events/${eventId}/rsvps`));
  if (!res.ok) throw new Error('Unable to load registrations.');
  return res.json();
}
