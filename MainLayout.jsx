import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AtmosphereOrbs from './AtmosphereOrbs';
import JoinCommunityModal from '../ui/JoinCommunityModal';
import AuthModal from '../ui/AuthModal';
import ProfileModal from '../ui/ProfileModal';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/Jp2xLed8Z7q5wpljKA2SKe';

export default function MainLayout() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isGlassVariant = location.pathname === '/events';

  const redirectToWhatsApp = () => {
    window.open(WHATSAPP_COMMUNITY_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Dynamic Ambient Mesh Glow Background (omitted on home page) */}
      {!isHomePage && (
        <AtmosphereOrbs variant={isGlassVariant ? 'glass' : 'default'} />
      )}

      {/* Floating Header */}
      <Navbar onOpenJoinModal={redirectToWhatsApp} />

      {/* Main Page Outlet */}
      <main className="flex-1 w-full pt-16">
        <Outlet context={{ openJoinModal: redirectToWhatsApp }} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Join Community Onboarding Modal */}
      <JoinCommunityModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />

      {/* Global Auth / Verified Login Modal */}
      <AuthModal />

      {/* Global Builder Profile Edit Modal */}
      <ProfileModal />
    </div>
  );
}
