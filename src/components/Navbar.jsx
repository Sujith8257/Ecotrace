import { History, Home, Leaf, LogOut, RefreshCw, User, X, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { signInWithGoogle, signOutUser, subscribeToAuth } from '../services/firebase';
import { getFootprintHistory } from '../services/supabase';

const formatHistoryDate = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

const getInitial = (user) => {
  const source = user?.displayName || user?.email || 'U';
  return source.trim().charAt(0).toUpperCase();
};

const Navbar = ({ currentScreen, setCurrentScreen, loadHistoryItem }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    return subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
  }, []);

  const goHome = () => {
    setCurrentScreen(0);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const scrollToLandingSection = (sectionId) => {
    setCurrentScreen(0);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleSignIn = async () => {
    setAuthError('');
    setAuthBusy(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setAuthError(error.code === 'auth/popup-closed-by-user' ? '' : 'Sign-in failed. Try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError('');
    setAuthBusy(true);

    try {
      await signOutUser();
      setHistoryOpen(false);
      setHistoryItems([]);
      if (setCurrentScreen) {
        setCurrentScreen(0);
      }
      setShowLogoutPopup(true);
      setTimeout(() => {
        setShowLogoutPopup(false);
      }, 1000);
    } catch (error) {
      console.error('Google sign-out failed:', error);
      setAuthError('Sign-out failed. Try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const openHistory = async () => {
    if (!user) {
      await handleSignIn();
      return;
    }

    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const items = await getFootprintHistory(user);
      setHistoryItems(items);
    } catch (error) {
      console.error('Loading footprint history failed:', error);
      setHistoryError('Could not load history. Check the Supabase function deployment.');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-2xl">
        <div className="section-container grid min-h-20 grid-cols-1 items-center gap-4 py-4 md:grid-cols-[1fr_auto_1fr] md:py-0">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') goHome();
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/10 border border-brand-green/20 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Leaf size={20} className="text-brand-green" />
            </div>
            <div>
              <div className="font-sans text-lg font-extrabold tracking-normal text-foreground">
                EcoTrace AI
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Practical climate baseline
              </div>
            </div>
          </div>

          <div className="order-3 flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-white/70 p-1 shadow-sm md:order-none">
            {[
              ['How it works', 'how-it-works'],
              ['Carbon footprint', 'carbon-footprint'],
              ['Why EcoTrace', 'why-ecotrace'],
            ].map(([label, sectionId]) => (
              <button
                key={sectionId}
                onClick={() => scrollToLandingSection(sectionId)}
                className="inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 sm:px-4 sm:text-sm"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setCurrentScreen(6)}
              className="inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-semibold text-brand-green bg-brand-green/10 transition-colors hover:bg-brand-green/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 sm:px-4 sm:text-sm"
            >
              Methodology
            </button>
          </div>

          <div className="flex items-center justify-start gap-2 sm:gap-3 md:justify-end">
            {currentScreen === 5 ? (
              <>
                <button
                  onClick={goHome}
                  className="hidden h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 md:inline-flex"
                >
                  <Home size={16} /> Home
                </button>
                <button
                  onClick={() => setCurrentScreen(1)}
                  className="hidden h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 md:inline-flex"
                >
                  <RefreshCw size={16} /> Update answers
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentScreen(1)}
                className="hidden h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 md:inline-flex"
              >
                Start
              </button>
            )}

            {user ? (
              <div className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white/85 px-2 pr-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-sm font-extrabold text-white">
                  {getInitial(user)}
                </div>
                <span className="max-w-[110px] truncate text-sm font-semibold text-foreground">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={openHistory}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-brand-green transition-colors hover:bg-secondary"
                >
                  <History size={15} /> History
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={authBusy}
                  title="Sign out"
                  aria-label="Sign out"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={authLoading || authBusy}
                title={authError || undefined}
                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50"
              >
                <User size={16} />
                {authBusy ? 'Please wait...' : 'Sign in'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {historyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1f16]/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[480px] rounded-[24px] border border-white/50 bg-white/90 p-8 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-white/70 pb-4">
              <div className="flex items-center gap-2 text-xl font-extrabold text-foreground">
                <History size={20} className="text-brand-green" /> Footprint History
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X size={14} /> Close
              </button>
            </div>

            {historyLoading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">Loading saved footprints...</div>
            ) : historyError ? (
              <div className="py-10 text-center text-sm text-red-500">{historyError}</div>
            ) : historyItems.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No saved footprints found. Complete an assessment to save one!
              </div>
            ) : (
              <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                {historyItems.map((item) => {
                  const score = item.result?.healthScore || item.result?.score;
                  return (
                    <div 
                      key={item.id} 
                      className="rounded-2xl bg-white p-4 shadow-sm cursor-pointer hover:border-brand-green border border-transparent transition-colors"
                      onClick={() => {
                        loadHistoryItem(item);
                        setHistoryOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-base font-extrabold text-foreground">
                              {Number(item.total_kg_co2e_month).toFixed(2)} kg CO2e
                            </div>
                            <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">
                              {formatHistoryDate(item.created_at)}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Score: {score ?? '-'} | Period: monthly
                          </div>
                        </div>
                        <span className="text-xl text-muted-foreground">›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none px-4">
          <div className="bg-white text-foreground px-6 py-4 rounded-full shadow-2xl border border-brand-green/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="h-8 w-8 rounded-full bg-brand-green/20 flex items-center justify-center">
              <Check size={16} className="text-brand-green" />
            </div>
            <span className="font-bold">Logout successful</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
