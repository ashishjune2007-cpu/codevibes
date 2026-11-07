import React, { useState, useEffect } from 'react';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/ui/SearchBar';
import Toast from '../components/ui/Toast';
import { apiGetEvents } from '../services/api';
import { EVENTS_PAGE_ITEMS } from '../data/mockData';

/**
 * EventsPage Component
 * Implements Electric Glass & Precision Syntax for community events and workshops.
 */
export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [events, setEvents] = useState(EVENTS_PAGE_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const backendEvents = await apiGetEvents();
      if (!cancelled && Array.isArray(backendEvents) && backendEvents.length > 0) {
        // Normalize backend shape to what EventCard expects
        const normalized = backendEvents.map((e) => ({
          ...e,
          category: (e.category || 'workshop').toLowerCase(),
          categoryLabel: e.categoryLabel || e.category || 'Workshop',
          description: e.description || '',
          title: e.title || 'Untitled Event',
        }));
        setEvents(normalized);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const normalizeCat = (c) => {
    const s = (c || '').toLowerCase();
    if (s.includes('hack')) return 'hackathon';
    if (s.includes('workshop') || s.includes('hands')) return 'workshop';
    if (s.includes('talk') || s.includes('knowledge') || s.includes('tech')) return 'talk';
    if (s.includes('meet')) return 'meetup';
    return s;
  };

  const countBy = (key) =>
    key === 'all' ? events.length : events.filter((e) => normalizeCat(e.category) === key).length;

  const categories = [
    { key: 'all', label: `All Events (${countBy('all')})` },
    { key: 'hackathon', label: `Hackathons (${countBy('hackathon')})` },
    { key: 'workshop', label: `Workshops (${countBy('workshop')})` },
    { key: 'talk', label: `Tech Talks (${countBy('talk')})` },
    { key: 'meetup', label: `Meetups (${countBy('meetup')})` },
  ];

  const filteredEvents = events.filter((event) => {
    const cat = (event.category || '').toLowerCase();
    const matchesCategory = selectedCategory === 'all' || normalizeCat(event.category) === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (event.title || '').toLowerCase().includes(query) ||
      (event.description || '').toLowerCase().includes(query) ||
      (event.categoryLabel || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* Header Section: Discoverability & Filter Toolbar */}
        <section className="space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                Community Events &amp; Workshops
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Learn, compete, and level up with fellow developers across hackathons, deep-dive workshops, and tech talks.
              </p>
            </div>
          </div>

          {/* Search & Dynamic Filter Suite */}
          <div className="p-4 sm:p-6 rounded-2xl glass-base border-t border-l border-white/80 border-r border-b border-[#c2c6d7]/35 shadow-card-default space-y-4">
            <div className="flex flex-col lg:flex-row gap-space-md items-center justify-between">
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search events by topic, technology, or speaker..."
                id="eventSearchInput"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 overflow-x-auto">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`category-btn px-4 py-1.5 rounded-full font-label-ui text-label-ui transition-all cursor-pointer ${
                      isActive
                        ? 'btn-gradient-primary shadow-sm'
                        : 'bg-white/70 hover:bg-white text-on-surface border border-white/80 shadow-xs'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Upcoming Events Grid */}
        <section className="space-y-space-md pb-16">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Upcoming Scheduled Sessions
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Deep technical immersion hosted weekly by community leads.
              </p>
            </div>
            <div className="font-mono-sm text-mono-sm text-on-surface-variant hidden sm:block">
              Showing{' '}
              <span className="font-semibold text-on-surface">
                {filteredEvents.length} of {events.length}
              </span>{' '}
              confirmed sessions
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpenDetails={() => showToast(`Opening ${event.title}`)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bento-card flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-5xl text-outline">event_busy</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                No sessions match your filter
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Try clearing search terms or selecting 'All Events'.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn-gradient-primary mt-2 px-5 py-2 rounded-lg font-label-ui text-label-ui cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
