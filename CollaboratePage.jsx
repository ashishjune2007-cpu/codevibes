import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import { apiSubmitApplication } from '../services/api';

const POPULAR_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Rust',
  'Go',
  'Tailwind CSS',
  'PostgreSQL',
  'GraphQL',
  'Docker',
  'Kubernetes',
  'PyTorch / AI',
  'WebGPU',
  'Solidity',
  'C++',
  'AWS / GCP',
];

const ROLE_OPTIONS = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend / Systems Engineer',
  'AI / Machine Learning Engineer',
  'DevOps & Cloud Architect',
  'Mobile Developer (React Native / Flutter / iOS / Android)',
  'UI/UX & Product Designer',
  'Web3 / Smart Contract Developer',
  'Open Source Contributor / QA',
];

const EXPERIENCE_OPTIONS = [
  'Student / Beginner (< 1 year)',
  'Junior Developer (1 - 2 years)',
  'Mid-Level Engineer (3 - 5 years)',
  'Senior Engineer (5 - 8 years)',
  'Lead / Staff / Architect (8+ years)',
];

const GOAL_OPTIONS = [
  { id: 'pod', label: 'Join an active open-source project pod', icon: 'rocket_launch' },
  { id: 'pair', label: 'Pair programming & live code reviews', icon: 'code_blocks' },
  { id: 'side', label: 'Co-found a side project or hackathon team', icon: 'lightbulb' },
  { id: 'lead', label: 'Lead my own project & recruit builders', icon: 'groups' },
  { id: 'mentor', label: 'Mentorship, peer review & knowledge sharing', icon: 'school' },
];

const AVAILABILITY_OPTIONS = [
  '< 5 hours / week (Casual / Part-time)',
  '5 - 10 hours / week (Active Contributor)',
  '10 - 20 hours / week (Dedicated Sprint)',
  '20+ hours / week (Intensive / Full Co-build)',
];

const COMM_OPTIONS = [
  'Async-first (GitHub Issues, PRs, Discord chat)',
  'Sync-heavy (Live voice huddles, screen sharing, pair programming)',
  'Hybrid (Weekly sprint standup + async updates)',
];

export default function CollaboratePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    github: '',
    discord: '',
    portfolio: '',
    role: 'Full Stack Developer',
    experience: 'Mid-Level Engineer (3 - 5 years)',
    location: '',
    skills: ['React', 'TypeScript', 'Node.js'],
    goals: ['Join an active open-source project pod'],
    availability: '5 - 10 hours / week (Active Contributor)',
    communicationPref: 'Async-first (GitHub Issues, PRs, Discord chat)',
    bio: '',
    featuredWork: '',
    agreedToConduct: false,
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      }
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const addCustomSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setCustomSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const toggleGoal = (goalLabel) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goalLabel);
      if (exists) {
        if (prev.goals.length === 1) return prev; // Keep at least one
        return { ...prev, goals: prev.goals.filter((g) => g !== goalLabel) };
      }
      return { ...prev, goals: [...prev.goals, goalLabel] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      showToast('Please enter your full name or developer handle.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!formData.github.trim()) {
      showToast('Please provide your GitHub profile or handle.');
      return;
    }
    if (formData.skills.length === 0) {
      showToast('Please select or add at least one tech skill.');
      return;
    }
    if (formData.goals.length === 0) {
      showToast('Please select at least one collaboration goal.');
      return;
    }
    if (!formData.bio.trim() || formData.bio.trim().length < 15) {
      showToast('Please write a brief bio or introduction (at least 15 characters).');
      return;
    }
    if (!formData.agreedToConduct) {
      showToast('Please agree to the Community Code of Conduct before connecting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiSubmitApplication({
        fullName: formData.fullName,
        name: formData.fullName,
        email: formData.email,
        github: formData.github,
        discord: formData.discord,
        portfolio: formData.portfolio,
        role: formData.role,
        experience: formData.experience,
        location: formData.location,
        skills: formData.skills,
        goals: formData.goals,
        availability: formData.availability,
        commitment: formData.availability,
        communicationPref: formData.communicationPref,
        bio: formData.bio,
        pitch: formData.bio,
        featuredWork: formData.featuredWork,
      });

      const receiptId = response?.id || `CV-POD-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionReceipt({
        id: receiptId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        data: { ...formData },
      });
      setIsSubmitted(true);
      showToast('Connection details submitted! Welcome to The Code Vibe network.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('Submission error: ' + (err.message || 'Please check your connection and retry.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionReceipt(null);
    setFormData({
      fullName: '',
      email: '',
      github: '',
      discord: '',
      portfolio: '',
      role: 'Full Stack Developer',
      experience: 'Mid-Level Engineer (3 - 5 years)',
      location: '',
      skills: ['React', 'TypeScript', 'Node.js'],
      goals: ['Join an active open-source project pod'],
      availability: '5 - 10 hours / week (Active Contributor)',
      communicationPref: 'Async-first (GitHub Issues, PRs, Discord chat)',
      bio: '',
      featuredWork: '',
      agreedToConduct: false,
    });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)]">
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Top Hero Section */}
      <div className="relative w-full overflow-hidden hero-mesh-canvas py-10 sm:py-12 px-4 sm:px-6 lg:px-12 border-b border-[#c2c6d7]/30">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full telemetry-chip text-on-surface-variant font-mono-sm text-mono-sm shadow-card-default">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <span className="font-semibold text-on-surface text-xs sm:text-sm">
              COLLABORATOR INTAKE // BUILDER CONNECT
            </span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Connect as a <span className="gradient-text-radiant">Collaborator</span>
          </h1>

          <p className="font-body-md text-body-md sm:font-body-lg sm:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Looking to build real software with passionate engineers, join an active open-source pod, or pair-program on ambitious ideas? Fill out your details below to get connected with fellow builders.
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative">
        {isSubmitted && submissionReceipt ? (
          /* SUCCESS STATE */
          <div className="glass-elevated border-t border-l border-white/90 border-r border-b border-[#c2c6d7]/40 rounded-3xl p-8 sm:p-12 shadow-card-hover flex flex-col items-center text-center space-y-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full gradient-core-action shadow-glow-cyan flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-mono-sm text-mono-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>RECEIPT: {submissionReceipt.id} • {submissionReceipt.date}</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Connection Request Dispatched!
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
                Thank you, <strong className="text-on-surface font-semibold">{submissionReceipt.data.fullName}</strong>. Your profile has been ingested into The Code Vibe network. Community maintainers and pod leads will reach out via email or Discord with matching collaboration opportunities.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="w-full max-w-2xl text-left bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-[#c2c6d7]/35 shadow-card-default space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#c2c6d7]/20">
                <div>
                  <div className="text-xs uppercase tracking-wider font-mono-sm text-outline font-semibold">
                    Developer Handle
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {submissionReceipt.data.fullName}
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[rgba(0,229,255,0.15)] border border-[rgba(0,229,255,0.40)] text-[#006875] font-mono-sm text-mono-sm font-semibold">
                  {submissionReceipt.data.role}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-outline font-mono-sm text-xs uppercase block">GitHub:</span>
                  <span className="font-medium text-on-surface">
                    {submissionReceipt.data.github}
                  </span>
                </div>
                <div>
                  <span className="text-outline font-mono-sm text-xs uppercase block">Email:</span>
                  <span className="font-medium text-on-surface">
                    {submissionReceipt.data.email}
                  </span>
                </div>
                {submissionReceipt.data.discord && (
                  <div>
                    <span className="text-outline font-mono-sm text-xs uppercase block">Discord:</span>
                    <span className="font-medium text-on-surface">
                      {submissionReceipt.data.discord}
                    </span>
                  </div>
                )}
                {submissionReceipt.data.location && (
                  <div>
                    <span className="text-outline font-mono-sm text-xs uppercase block">Location / Timezone:</span>
                    <span className="font-medium text-on-surface">
                      {submissionReceipt.data.location}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-outline font-mono-sm text-xs uppercase block">Availability:</span>
                  <span className="font-medium text-on-surface">
                    {submissionReceipt.data.availability}
                  </span>
                </div>
                <div>
                  <span className="text-outline font-mono-sm text-xs uppercase block">Experience:</span>
                  <span className="font-medium text-on-surface">
                    {submissionReceipt.data.experience}
                  </span>
                </div>
              </div>

              {/* Stack tags */}
              <div className="pt-2">
                <span className="text-outline font-mono-sm text-xs uppercase block mb-1.5">Registered Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {submissionReceipt.data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-md bg-white border border-[#c2c6d7]/40 text-on-surface font-mono-sm text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="pt-2">
                <span className="text-outline font-mono-sm text-xs uppercase block mb-1.5">Collaboration Goals:</span>
                <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant">
                  {submissionReceipt.data.goals.map((g, idx) => (
                    <li key={idx} className="font-body-md text-body-md">{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white/80 border border-[#c2c6d7]/40 text-on-surface font-label-ui text-label-ui hover:bg-white shadow-card-default transition-all cursor-pointer"
              >
                Submit Another Response
              </button>
              <Link
                to="/events"
                className="btn-gradient-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-label-ui text-label-ui shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Explore Community Events</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : (
          /* COLLABORATOR FORM */
          <form
            name="collaborator-intake"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
            className="glass-base border-t border-l border-white/85 border-r border-b border-[#c2c6d7]/35 rounded-3xl p-6 sm:p-10 shadow-card-default space-y-10"
          >
            <input type="hidden" name="form-name" value="collaborator-intake" />
            {/* Section 1: Developer Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#c2c6d7]/30">
                <div className="w-8 h-8 rounded-lg gradient-core-action text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">person</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    1. Developer Identity & Contact
                  </h2>
                  <p className="font-mono-sm text-mono-sm text-outline">
                    Tell us who you are and how teammates can reach you.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Full Name / Handle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Chen or @achen"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. alex@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    GitHub Profile / Handle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline font-mono-sm text-sm">
                      github.com/
                    </span>
                    <input
                      type="text"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="username"
                      required
                      className="w-full pl-28 pr-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="discord"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Discord or Telegram Handle
                  </label>
                  <input
                    type="text"
                    id="discord"
                    name="discord"
                    value={formData.discord}
                    onChange={handleInputChange}
                    placeholder="e.g. alexchen#1234 or @alexchen"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="portfolio"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Portfolio / Personal Website / LinkedIn (Optional)
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.dev"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Role & Seniority */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#c2c6d7]/30">
                <div className="w-8 h-8 rounded-lg gradient-core-action text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    2. Role & Experience Level
                  </h2>
                  <p className="font-mono-sm text-mono-sm text-outline">
                    Specify your domain expertise and timezone.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="role"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Primary Role / Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  >
                    {EXPERIENCE_OPTIONS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="location"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Location & Timezone
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco (PST / UTC-8) or Bangalore (IST / UTC+5:30)"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Tech Stack & Skills */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#c2c6d7]/30">
                <div className="w-8 h-8 rounded-lg gradient-core-action text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">code</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    3. Tech Stack & Superpowers
                  </h2>
                  <p className="font-mono-sm text-mono-sm text-outline">
                    Select technologies you love or add custom languages, frameworks & tools.
                  </p>
                </div>
              </div>

              {/* Clickable popular pills */}
              <div>
                <label className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-2">
                  Popular Technologies (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg font-mono-sm text-mono-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'btn-gradient-primary shadow-sm'
                            : 'bg-white/80 text-on-surface border border-[#c2c6d7]/40 hover:bg-white shadow-xs'
                        }`}
                      >
                        {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Skill Input */}
              <div>
                <label
                  htmlFor="customSkillInput"
                  className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                >
                  Add Custom Tool or Technology
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="customSkillInput"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    placeholder="e.g. Svelte, Elixir, Kafka, WebAssembly..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none text-on-surface font-body-md"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-5 py-2.5 rounded-xl bg-white/90 border border-[#c2c6d7]/40 hover:bg-white text-on-surface font-label-ui text-label-ui font-semibold shadow-xs cursor-pointer"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Selected skills summary */}
              <div>
                <span className="font-mono-sm text-xs text-outline uppercase tracking-wider block mb-2">
                  Selected Skills ({formData.skills.length}):
                </span>
                <div className="flex flex-wrap gap-2 p-3 bg-black/5 rounded-xl border border-white/50 min-h-[44px] items-center">
                  {formData.skills.length === 0 ? (
                    <span className="text-on-surface-variant text-sm font-mono-sm italic">
                      No skills selected yet. Click above or type a custom tool.
                    </span>
                  ) : (
                    formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#c2c6d7]/50 text-on-surface font-mono-sm text-xs shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-500 cursor-pointer font-bold ml-0.5 text-outline"
                          title={`Remove ${skill}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Collaboration Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#c2c6d7]/30">
                <div className="w-8 h-8 rounded-lg gradient-core-action text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">handshake</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    4. Collaboration Goals & Availability
                  </h2>
                  <p className="font-mono-sm text-mono-sm text-outline">
                    What kind of collaboration are you looking for?
                  </p>
                </div>
              </div>

              {/* Goal Cards */}
              <div className="space-y-2">
                <label className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1">
                  What are you looking to do? (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map((g) => {
                    const isSelected = formData.goals.includes(g.label);
                    return (
                      <div
                        key={g.id}
                        onClick={() => toggleGoal(g.label)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[rgba(0,229,255,0.12)] border-[rgba(0,229,255,0.40)] text-[#006875] shadow-xs'
                            : 'bg-white/70 border-[#c2c6d7]/35 text-on-surface hover:bg-white'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl ${
                            isSelected ? 'text-[#0056c5]' : 'text-outline'
                          }`}
                        >
                          {g.icon}
                        </span>
                        <span className="font-body-md text-sm font-medium flex-1">
                          {g.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by div
                          className="accent-[#0056c5] cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label
                    htmlFor="availability"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Weekly Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="communicationPref"
                    className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                  >
                    Communication Style <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="communicationPref"
                    name="communicationPref"
                    value={formData.communicationPref}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                  >
                    {COMM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Bio & Projects */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[#c2c6d7]/30">
                <div className="w-8 h-8 rounded-lg gradient-core-action text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    5. About You & What You Want to Build
                  </h2>
                  <p className="font-mono-sm text-mono-sm text-outline">
                    Share your vision, project ideas, or what kind of problems get you excited.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                >
                  Brief Bio & Collaboration Pitch <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell potential collaborators what you're passionate about, what tech you're currently mastering, or an open-source project idea you'd love to pair on..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md resize-y"
                />
                <span className="text-xs text-outline font-mono-sm">
                  {formData.bio.length} characters (recommended min: 15)
                </span>
              </div>

              <div>
                <label
                  htmlFor="featuredWork"
                  className="block font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold mb-1.5"
                >
                  Featured Repositories or Recent Projects (Optional)
                </label>
                <input
                  type="text"
                  id="featuredWork"
                  name="featuredWork"
                  value={formData.featuredWork}
                  onChange={handleInputChange}
                  placeholder="e.g. https://github.com/yourname/awesome-project"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#c2c6d7]/50 focus:border-[#0056c5] focus:ring-2 focus:ring-[#0056c5]/20 outline-none transition-all text-on-surface font-body-md"
                />
              </div>
            </div>

            {/* Section 6: Conduct & Submit */}
            <div className="space-y-6 pt-4 border-t border-[#c2c6d7]/30">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-white/60 border border-[#c2c6d7]/30 cursor-pointer hover:bg-white/80 transition-colors">
                <input
                  type="checkbox"
                  name="agreedToConduct"
                  checked={formData.agreedToConduct}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 accent-[#0056c5] rounded cursor-pointer"
                  required
                />
                <span className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  I agree to uphold <strong>The Code Vibe Code of Conduct</strong>: treating all collaborators with respect, maintaining transparent communication, and keeping open-source codebases clean, inclusive, and well-documented.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-on-surface-variant hover:text-on-surface font-label-ui text-label-ui hover:bg-white/60 transition-colors cursor-pointer"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gradient-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-label-ui text-label-ui font-semibold shadow-glow-cyan active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                      <span>Dispatching Profile...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      <span>Send Connection Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
