import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SosModal } from './components/SosModal';
import { SplashWelcomeFlow } from './components/SplashWelcomeFlow';
import { DashboardView } from './components/DashboardView';
import { JournalView } from './components/JournalView';
import { EpdsView } from './components/EpdsView';
import { BreathingView } from './components/BreathingView';
import { LibraryView } from './components/LibraryView';
import { CommunityView } from './components/CommunityView';
import { ResourcesView } from './components/ResourcesView';
import { SettingsView } from './components/SettingsView';
import { ClinicalProfileForm } from './components/ClinicalProfileForm';
import { UserProfile, JournalEntry, EpdsResult, MoodType, ClinicalHealthData } from './types';

export default function App() {
  // Load saved profile or default guest
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('atulado_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      uid: `usr_${Date.now()}`,
      displayName: 'Ruth Cerna',
      isGuest: true,
      pregnancyOrPostpartumStatus: 'gestational',
      hasConsented: false,
      syncEnabled: false,
      clinicalProfile: {
        fullName: 'Ruth Cerna',
        age: 28,
        weightKg: 62,
        heightCm: 165,
        lastPeriodStartDate: '2026-07-10',
        periodDurationDays: 3,
        cycleDurationDays: 28,
        contraceptiveMethod: 'Ninguno / Ciclo Natural',
        healthConditions: ['Diabetes', 'Obesidad'],
      }
    };
  });

  // Journal entries persistent state (Room Database local simulation)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('atulado_journal_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'entry_1',
        timestamp: Date.now() - 86400000,
        dateStr: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        mood: 'calm',
        intensity: 3,
        tags: ['#sueño', '#gratitud'],
        note: 'Hoy logré descansar un par de horas seguidas. El ejercicio de respiración me ayudó mucho a relajar el pecho antes de dormir.',
        syncedToCloud: true
      },
      {
        id: 'entry_2',
        timestamp: Date.now() - 172800000,
        dateStr: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        mood: 'anxious',
        intensity: 4,
        tags: ['#ansiedad', '#sobrecarga'],
        note: 'Sentí bastante opresión al atardecer. Llamé a mi mamá para desahogarme un rato.',
        syncedToCloud: false
      },
      {
        id: 'entry_3',
        timestamp: Date.now() - 259200000,
        dateStr: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        mood: 'overwhelmed',
        intensity: 4,
        tags: ['#sobrecarga', '#cuerpo'],
        note: 'Día con bastante cansancio físico y dudas. Hice una pausa de respiración profunda.',
        syncedToCloud: true
      },
      {
        id: 'entry_4',
        timestamp: Date.now() - 345600000,
        dateStr: new Date(Date.now() - 345600000).toISOString().split('T')[0],
        mood: 'calm',
        intensity: 2,
        tags: ['#esperanza', '#fuerza'],
        note: 'Caminé un rato al aire libre y me sentí renovada.',
        syncedToCloud: true
      }
    ];
  });

  // EPDS persistent results state
  const [epdsResults, setEpdsResults] = useState<EpdsResult[]>(() => {
    const saved = localStorage.getItem('atulado_epds_results');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Navigation and Modal States
  const [activeTab, setActiveTab] = useState<'home' | 'journal' | 'community' | 'resources'>('home');
  const [activeSubView, setActiveSubView] = useState<'none' | 'epds' | 'breathing' | 'settings' | 'clinical_profile'>('none');
  const [isSosOpen, setIsSosOpen] = useState(false);

  // Logout Handler (Resets auth state to return to welcome/re-entry flow)
  const handleLogout = () => {
    setUserProfile((prev) => ({
      ...prev,
      hasConsented: false
    }));
    setActiveSubView('none');
    setActiveTab('home');
  };

  // Save Clinical Profile Handler
  const handleSaveClinicalProfile = (clinicalData: ClinicalHealthData) => {
    setUserProfile((prev) => ({
      ...prev,
      displayName: clinicalData.fullName || prev.displayName,
      clinicalProfile: clinicalData
    }));
    setActiveSubView('none');
  };

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('atulado_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Sync journal entries to localStorage
  useEffect(() => {
    localStorage.setItem('atulado_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Sync EPDS results
  useEffect(() => {
    localStorage.setItem('atulado_epds_results', JSON.stringify(epdsResults));
  }, [epdsResults]);

  // Handle Journal Save
  const handleSaveJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'timestamp' | 'syncedToCloud'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: `entry_${Date.now()}`,
      timestamp: Date.now(),
      syncedToCloud: userProfile.syncEnabled
    };
    setJournalEntries([newEntry, ...journalEntries]);
  };

  // Handle Quick Mood Check-in from Dashboard
  const handleQuickMoodCheckin = (mood: MoodType) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newEntry: JournalEntry = {
      id: `checkin_${Date.now()}`,
      timestamp: Date.now(),
      dateStr,
      mood,
      intensity: mood === 'radiant' ? 5 : mood === 'calm' ? 3 : 4,
      tags: ['#checkin_rapido'],
      note: `Check-in rápido de estado emocional: ${mood}`,
      syncedToCloud: userProfile.syncEnabled
    };
    setJournalEntries([newEntry, ...journalEntries]);
  };

  const handleDeleteEntry = (id: string) => {
    setJournalEntries(journalEntries.filter(e => e.id !== id));
  };

  const handleSaveEpds = (result: EpdsResult) => {
    setEpdsResults([result, ...epdsResults]);
  };

  // Onboarding Complete Handler
  const handleOnboardingComplete = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile({
      ...userProfile,
      ...updatedProfile,
      hasConsented: true
    });
  };

  // Export Data JSON
  const handleExportData = () => {
    const data = {
      profile: userProfile,
      journalEntries,
      epdsResults,
      exportedAt: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `A_TU_LADO_Copia_Seguridad_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear Local Data
  const handleClearData = () => {
    if (window.confirm('¿Estás segura de eliminar todos tus registros locales de diario y cuestionarios?')) {
      localStorage.clear();
      setJournalEntries([]);
      setEpdsResults([]);
      setUserProfile({
        uid: `usr_${Date.now()}`,
        displayName: 'María G.',
        isGuest: true,
        pregnancyOrPostpartumStatus: 'gestational',
        hasConsented: false,
        syncEnabled: false
      });
    }
  };

  // Check if onboarding is needed
  if (!userProfile.hasConsented) {
    return (
      <SplashWelcomeFlow
        initialProfile={userProfile}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#2D2D2D] sans flex flex-col antialiased selection:bg-[#E8DCC4] selection:text-[#5A5A40]">
      {/* Top Navbar */}
      <Navbar
        userProfile={userProfile}
        activeTab={activeTab}
        onOpenSettings={() => setActiveSubView('settings')}
        onOpenClinicalProfile={() => setActiveSubView('clinical_profile')}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-20">
        {/* Render Active View or Subview */}
        {activeSubView === 'clinical_profile' ? (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSubView('none')}
              className="text-xs font-bold text-[#5A5A40] hover:underline mb-2 flex items-center gap-1"
            >
              ← Volver
            </button>
            <ClinicalProfileForm
              initialData={
                userProfile.clinicalProfile || {
                  fullName: userProfile.displayName || 'Ruth Cerna',
                  age: 28,
                  weightKg: 62,
                  heightCm: 165,
                  lastPeriodStartDate: '2026-07-10',
                  periodDurationDays: 3,
                  cycleDurationDays: 28,
                  contraceptiveMethod: 'Ninguno / Ciclo Natural',
                  healthConditions: ['Diabetes', 'Obesidad'],
                }
              }
              onSave={handleSaveClinicalProfile}
              onCancel={() => setActiveSubView('none')}
            />
          </div>
        ) : activeSubView === 'settings' ? (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSubView('none')}
              className="text-xs font-bold text-[#5A5A40] hover:underline mb-2 flex items-center gap-1"
            >
              ← Volver al inicio
            </button>
            <SettingsView
              userProfile={userProfile}
              onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
              onExportData={handleExportData}
              onClearData={handleClearData}
              onLogout={handleLogout}
              onOpenClinicalProfile={() => setActiveSubView('clinical_profile')}
            />
          </div>
        ) : activeSubView === 'epds' ? (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSubView('none')}
              className="text-xs font-bold text-[#5A5A40] hover:underline mb-2 flex items-center gap-1"
            >
              ← Volver al Dashboard
            </button>
            <EpdsView
              onSaveResult={handleSaveEpds}
              onOpenSos={() => setIsSosOpen(true)}
            />
          </div>
        ) : activeSubView === 'breathing' ? (
          <div className="space-y-4">
            <button
              onClick={() => setActiveSubView('none')}
              className="text-xs font-bold text-[#5A5A40] hover:underline mb-2 flex items-center gap-1"
            >
              ← Volver al Dashboard
            </button>
            <BreathingView />
          </div>
        ) : (
          /* Primary Navigation Tabs */
          <>
            {activeTab === 'home' && (
              <DashboardView
                userProfile={userProfile}
                recentEntries={journalEntries}
                latestEpds={epdsResults[0]}
                onQuickMoodCheckin={handleQuickMoodCheckin}
                onOpenBreathing={() => setActiveSubView('breathing')}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenEpdsTest={() => setActiveSubView('epds')}
                onOpenSos={() => setIsSosOpen(true)}
                onOpenClinicalProfile={() => setActiveSubView('clinical_profile')}
              />
            )}

            {activeTab === 'journal' && (
              <JournalView
                entries={journalEntries}
                onSaveEntry={handleSaveJournalEntry}
                onDeleteEntry={handleDeleteEntry}
                syncEnabled={userProfile.syncEnabled}
              />
            )}

            {activeTab === 'community' && <CommunityView />}

            {activeTab === 'resources' && (
              <div className="space-y-8">
                <ResourcesView />
                <LibraryView />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveSubView('none');
          setActiveTab(tab);
        }}
        onOpenSos={() => setIsSosOpen(true)}
      />

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        userProfile={userProfile}
        onOpenBreathing={() => setActiveSubView('breathing')}
      />
    </div>
  );
}
