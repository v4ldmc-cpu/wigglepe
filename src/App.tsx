/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, UserCondition, RoutineSession } from './types';
import { HeaderBar } from './components/HeaderBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { SessionsModule } from './components/SessionsModule';
import { ProgressModule } from './components/ProgressModule';
import { WiggyChatModule } from './components/WiggyChatModule';
import { TestimonialsModule } from './components/TestimonialsModule';
import { CommunityModule } from './components/CommunityModule';
import { ContactLocationModule } from './components/ContactLocationModule';
import { UserProfileModal } from './components/UserProfileModal';
import { ConditionSelectorModal } from './components/ConditionSelectorModal';
import { Smartphone, Monitor } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-default',
  name: 'Paciente Wiggle',
  age: 48,
  condition: 'ankle_fracture',
  affectedLimb: 'Derecha',
  primaryGoal: 'Recuperar movilidad y flexión de tobillo sin dolor',
  painLevel: 3,
  streakDays: 4,
  totalReps: 145,
  totalMinutes: 62,
  completedSessionsCount: 5,
  onboardingCompleted: false, // will show onboarding modal first time!
  fontSize: 'normal',
  highContrast: false,
  voiceGuide: true,
};

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wiggle_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('sessions');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showConditionModal, setShowConditionModal] = useState<boolean>(false);
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(false);

  // Sync profile changes to localStorage
  useEffect(() => {
    localStorage.setItem('wiggle_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleOnboardingComplete = (completedProfile: UserProfile) => {
    setUserProfile(completedProfile);
  };

  const handleFinishSession = (
    session: RoutineSession,
    repsCompleted: number,
    minutesSpent: number
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      totalReps: prev.totalReps + repsCompleted,
      totalMinutes: prev.totalMinutes + minutesSpent,
      completedSessionsCount: prev.completedSessionsCount + 1,
      streakDays: prev.streakDays + 1,
    }));
  };

  const handleResetOnboarding = () => {
    setUserProfile((prev) => ({
      ...prev,
      onboardingCompleted: false,
    }));
  };

  // Font size multiplier classes
  const fontSizeClass =
    userProfile.fontSize === 'xlarge'
      ? 'text-lg sm:text-xl'
      : userProfile.fontSize === 'large'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  const highContrastClass = userProfile.highContrast
    ? 'contrast-125 bg-slate-200'
    : 'bg-slate-100';

  return (
    <div className={`min-h-screen ${highContrastClass} font-sans transition-colors duration-200`}>
      {/* Viewport Frame Mode Toggle (Mobile Mockup vs Full Fluid) */}
      <div className="fixed top-2 right-2 z-50 hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-slate-300 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
        <button
          type="button"
          onClick={() => setIsMobileFrameView(false)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
            !isMobileFrameView ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100'
          }`}
          title="Vista fluida completa"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Fluida</span>
        </button>
        <button
          type="button"
          onClick={() => setIsMobileFrameView(true)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
            isMobileFrameView ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100'
          }`}
          title="Marco de móvil interactivo"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Móvil</span>
        </button>
      </div>

      {/* Main Container: Mobile Frame or Full Container */}
      <div
        className={`${
          isMobileFrameView
            ? 'max-w-[440px] mx-auto my-4 rounded-[40px] shadow-2xl border-8 border-slate-800 overflow-hidden bg-white min-h-[850px] relative'
            : 'max-w-2xl mx-auto bg-white min-h-screen shadow-md relative'
        }`}
      >
        {/* Top Header Bar with Logo and Accessibility */}
        <HeaderBar
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onOpenProfileModal={() => setShowProfileModal(true)}
          onOpenConditionSelector={() => setShowConditionModal(true)}
        />

        {/* Tab Content Container */}
        <main className={`p-3.5 sm:p-5 ${fontSizeClass}`}>
          {activeTab === 'sessions' && (
            <SessionsModule
              userProfile={userProfile}
              onFinishSession={handleFinishSession}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressModule userProfile={userProfile} />
          )}

          {activeTab === 'wiggy' && (
            <WiggyChatModule userProfile={userProfile} />
          )}

          {activeTab === 'testimonials' && <TestimonialsModule />}

          {activeTab === 'community' && (
            <CommunityModule userProfile={userProfile} />
          )}

          {activeTab === 'contact' && (
            <ContactLocationModule userProfile={userProfile} />
          )}
        </main>

        {/* Bottom Mobile Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* First Turn / First Login Mandatory Onboarding Flow */}
        {!userProfile.onboardingCompleted && (
          <OnboardingModal
            initialProfile={userProfile}
            onComplete={handleOnboardingComplete}
          />
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <UserProfileModal
            userProfile={userProfile}
            onUpdate={handleUpdateProfile}
            onClose={() => setShowProfileModal(false)}
            onResetOnboarding={handleResetOnboarding}
          />
        )}

        {/* Condition Selector Modal */}
        {showConditionModal && (
          <ConditionSelectorModal
            currentCondition={userProfile.condition}
            onSelectCondition={(newCond: UserCondition) =>
              handleUpdateProfile({ condition: newCond })
            }
            onClose={() => setShowConditionModal(false)}
          />
        )}
      </div>
    </div>
  );
}
