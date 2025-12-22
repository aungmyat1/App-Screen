import React, { useState, useRef, useEffect, useCallback } from 'react';

// --- Helper Hooks ---

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
}: {
  queryKey: any[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
}): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    isLoading: false,
    error: null,
  });

  const keyString = JSON.stringify(queryKey);

  useEffect(() => {
    if (!enabled) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }

    let isMounted = true;
    setState(s => ({ ...s, isLoading: true, error: null }));

    queryFn()
      .then(data => {
        if (isMounted) setState({ data, isLoading: false, error: null });
      })
      .catch(error => {
        if (isMounted) setState({ data: undefined, isLoading: false, error });
      });

    return () => {
      isMounted = false;
    };
  }, [keyString, enabled]);

  return state;
}

// --- Icons ---

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const AppStoreIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const GooglePlayIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FeatureIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const icons: { [key: string]: React.ReactElement } = {
        'batch': <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
        'platform': <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM5 12h.01M19 12h.01M12 5h.01" />,
        'input': <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />,
        'output': <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
        'metadata': <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'api': <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {icons[icon]}
        </svg>
    );
};

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
    };

    return (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transform transition-all hover:scale-105 ${typeClasses[type]}`}>
            <p className="font-medium">{message}</p>
        </div>
    );
};

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);
    if (startIndex === -1) return <>{text}</>;
    const endIndex = startIndex + query.length;
    return (
        <>
            {text.substring(0, startIndex)}
            <strong className="font-extrabold text-primary-600 dark:text-primary-400">{text.substring(startIndex, endIndex)}</strong>
            {text.substring(endIndex)}
        </>
    );
};

// --- Types & Data ---

type User = { name: string; avatarUrl: string; };
type AppSuggestion = { name: string; publisher: string; icon: string; url: string; store: 'google' | 'apple'; rating?: number; downloads?: string; };

const mockApps: AppSuggestion[] = [
    { name: 'Google Maps', publisher: 'Google LLC', icon: '🗺️', url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps', store: 'google', rating: 4.7, downloads: '5B+' },
    { name: 'Instagram', publisher: 'Meta Platforms, Inc.', icon: '📸', url: 'https://play.google.com/store/apps/details?id=com.instagram.android', store: 'google', rating: 4.5, downloads: '5B+' },
    { name: 'TikTok', publisher: 'TikTok Pte. Ltd.', icon: '🎵', url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically', store: 'google', rating: 4.4, downloads: '1B+' },
    { name: 'WhatsApp Messenger', publisher: 'WhatsApp LLC', icon: '💬', url: 'https://play.google.com/store/apps/details?id=com.whatsapp', store: 'google', rating: 4.3, downloads: '5B+' },
    { name: 'Spotify', publisher: 'Spotify AB', icon: '🎧', url: 'https://play.google.com/store/apps/details?id=com.spotify.music', store: 'google', rating: 4.4, downloads: '1B+' },
    { name: 'Procreate', publisher: 'Savage Interactive Pty Ltd', icon: '🖌️', url: 'https://apps.apple.com/us/app/procreate/id425073498', store: 'apple', rating: 4.5, downloads: '10M+' },
    { name: 'ChatGPT', publisher: 'OpenAI', icon: '🤖', url: 'https://apps.apple.com/us/app/chatgpt/id6448311069', store: 'apple', rating: 4.9, downloads: '50M+' },
    { name: 'YouTube', publisher: 'Google LLC', icon: '▶️', url: 'https://apps.apple.com/us/app/youtube-watch-listen-stream/id544007664', store: 'apple', rating: 4.7, downloads: '1B+' },
];

const fetchAppSuggestions = async (query: string, store: 'google' | 'apple'): Promise<AppSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!query.trim()) return [];
    
    const isUrl = query.startsWith('http://') || query.startsWith('https://');
    if (isUrl) return [];

    const lowerCaseQuery = query.toLowerCase();
    const storeApps = mockApps.filter(app => app.store === store);
    return storeApps.filter(app =>
        app.name.toLowerCase().includes(lowerCaseQuery) ||
        app.publisher.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);
};

// --- Sub-components ---

const DarkModeToggle: React.FC<{ isDarkMode: boolean; toggle: () => void }> = ({ isDarkMode, toggle }) => (
    <button
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
        {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
        )}
    </button>
);

const Header: React.FC<{
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    currentUser: User | null;
    onLogin: () => void;
    onLogout: () => void;
}> = ({ isDarkMode, toggleDarkMode, currentUser, onLogin, onLogout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed w-full top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                <div className="text-xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-slate-900 dark:text-white">App<span className="text-primary-600 dark:text-primary-400">Screens</span></span>
                </div>
                
                <nav className="hidden md:flex space-x-8 text-sm font-medium">
                    <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors">Features</a>
                    <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors">Pricing</a>
                    <a href="#api" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors">API</a>
                </nav>

                <div className="flex items-center space-x-3">
                    <DarkModeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                    {currentUser ? (
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
                                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full ring-2 ring-slate-200 dark:ring-slate-800" />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-slate-500">Signed in as</p>
                                        <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                                    </div>
                                    <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={onLogin} className="text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:shadow-lg transition-all">
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

const Hero: React.FC<{ showToast: (message: string, type: 'success' | 'error') => void }> = ({ showToast }) => {
    const [appUrl, setAppUrl] = useState('');
    const [selectedStore, setSelectedStore] = useState<'google' | 'apple'>('google');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const suggestionsContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedAppUrl = useDebounce(appUrl, 300);
    const { data: suggestions = [], isLoading: isSearching } = useQuery({
        queryKey: ['suggestions', debouncedAppUrl, selectedStore],
        queryFn: () => fetchAppSuggestions(debouncedAppUrl, selectedStore),
        enabled: !!debouncedAppUrl.trim(),
    });

    useEffect(() => {
        setActiveIndex(-1); // Reset index whenever suggestions change
    }, [suggestions]);

    useEffect(() => {
        if (!debouncedAppUrl.trim()) {
            setShowSuggestions(false);
            return;
        }
        setShowSuggestions(true);
    }, [debouncedAppUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAppUrl(e.target.value);
        setError(null);
        setShowSuggestions(!!e.target.value.trim());
    };
    
    const handleInputFocus = () => {
        if (appUrl.trim()) setShowSuggestions(true);
    };

    const handleSuggestionClick = (app: AppSuggestion) => {
        setAppUrl(app.url);
        setShowSuggestions(false);
        setActiveIndex(-1);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionsContainerRef.current && !suggestionsContainerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;
        const count = suggestions.length;
        if (count === 0) return;

        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(p => (p + 1) % count); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(p => (p - 1 + count) % count); }
        else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSuggestionClick(suggestions[activeIndex]); }
        else if (e.key === 'Escape') { e.preventDefault(); setShowSuggestions(false); }
    };

    const handleDownload = async () => {
        if (!appUrl.trim()) { setError("Please enter a valid URL."); return; }
        setError(null);
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast('Download started successfully!', 'success');
        setIsLoading(false);
    };
    
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-[100px] -z-10" />
            
            <div className="container mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    New: API v2.0 available
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
                    App Screenshots. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">Instantly.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Download assets from Google Play & Apple App Store in seconds. High-quality original files ready for your next project.
                </p>

                <div className="max-w-3xl mx-auto relative" ref={suggestionsContainerRef} onKeyDown={handleKeyDown}>
                    <div className="bg-white dark:bg-slate-900/80 p-2 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-all focus-within:ring-4 focus-within:ring-primary-100/50">
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 ml-1">
                                <button onClick={() => setSelectedStore('google')} className={`p-2 rounded-xl transition-all ${selectedStore === 'google' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400'}`}>
                                    <GooglePlayIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => setSelectedStore('apple')} className={`p-2 rounded-xl transition-all ${selectedStore === 'apple' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400'}`}>
                                    <AppStoreIcon className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <input
                                ref={inputRef}
                                type="text"
                                value={appUrl}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                placeholder={selectedStore === 'google' ? "Search for apps or paste URL..." : "Search for apps or paste URL..."}
                                className="flex-1 w-full bg-transparent border-none outline-none text-lg px-4 py-3 text-slate-900 dark:text-white"
                                autoComplete="off"
                            />

                            <button
                                onClick={handleDownload}
                                disabled={isLoading || !appUrl}
                                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 disabled:opacity-50"
                            >
                                {isLoading ? <LoadingSpinner /> : 'Download'}
                            </button>
                        </div>
                    </div>
                    
                    {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}

                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 text-left overflow-hidden animate-fade-in">
                            {isSearching ? (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                                    <LoadingSpinner />
                                    <span className="text-sm">Searching...</span>
                                </div>
                            ) : suggestions.length > 0 ? (
                                <ul>
                                    {suggestions.map((app, index) => (
                                        <li key={app.url}
                                            onClick={() => handleSuggestionClick(app)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`p-4 flex items-center space-x-4 cursor-pointer transition-colors ${
                                                index === activeIndex ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            <span className="text-4xl">{app.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                    <HighlightMatch text={app.name} query={appUrl} />
                                                </p>
                                                <p className="text-sm text-slate-500 truncate">{app.publisher}</p>
                                            </div>
                                            <div className="hidden sm:flex items-center text-yellow-500 text-sm font-medium">
                                                <span>{app.rating}</span> <StarIcon className="ml-1" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-slate-500">No suggestions for "{appUrl}"</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const Features: React.FC = () => (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to analyze apps</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Built for speed and precision. Stop taking manual screenshots.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { icon: 'batch', title: 'Batch Downloads', description: 'Download screenshots from multiple apps simultaneously.' },
                    { icon: 'platform', title: 'Cross-Platform', description: 'Unified support for both Google Play and App Store.' },
                    { icon: 'output', title: 'High Resolution', description: 'Get original uncompressed assets directly from source.' },
                    { icon: 'metadata', title: 'Metadata Extraction', description: 'Automatically organize files by app version and locale.' },
                    { icon: 'api', title: 'Developer API', description: 'RESTful API to automate your competitive analysis.' },
                    { icon: 'input', title: 'Smart Search', description: 'Find apps by name, ID, or URL with our instant search.' },
                ].map((feature, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white mb-6">
                           <FeatureIcon icon={feature.icon} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Pricing: React.FC = () => (
    <section id="pricing" className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight">Simple Pricing</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Scale as you grow.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    { 
                        name: 'Free', 
                        price: '$0', 
                        features: ['10 screenshots/mo', 'Basic scraping', 'Play Store only'] 
                    },
                    { 
                        name: 'Pro', 
                        price: '$29', 
                        features: ['500 screenshots/mo', 'Both stores', 'Batch operations', 'API access'], 
                        primary: true 
                    },
                    { 
                        name: 'Enterprise', 
                        price: '$299', 
                        features: ['50,000 screenshots/mo', 'Everything', 'Priority support', 'Custom integration'] 
                    }
                ].map((plan) => (
                    <div key={plan.name} className={`p-8 rounded-3xl border ${plan.primary ? 'bg-slate-900 text-white border-slate-900 shadow-2xl ring-4 ring-primary-500/20 lg:-mt-4' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <div className="my-8">
                            <span className="text-5xl font-extrabold">{plan.price}</span>
                            <span className="text-lg opacity-60">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center text-sm">
                                    <CheckIcon className="w-5 h-5 mr-3 text-primary-500" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-xl font-bold ${plan.primary ? 'bg-white text-slate-900' : 'bg-slate-100 dark:bg-slate-800'}`}>Get Started</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Footer: React.FC = () => (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
                 <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center text-white text-xs">A</div>
                 <span className="font-bold">AppScreens</span>
            </div>
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} AppScreens Inc.</p>
        </div>
    </footer>
);

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onLoginSuccess: () => void; }> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    if (!isOpen) return null;
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        onLoginSuccess();
        setIsLoading(false);
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-8 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold">Welcome back</h3>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium">
                        <GoogleIcon /> Sign in with Google
                    </button>
                    <div className="relative flex py-2 items-center text-slate-400 text-xs uppercase">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="mx-2">Or</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500" />
                    <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold">
                        {isLoading ? <LoadingSpinner /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type, id: Date.now() });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <Header isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} currentUser={currentUser} onLogin={() => setIsAuthModalOpen(true)} onLogout={() => setCurrentUser(null)} />
            <main>
                <Hero showToast={showToast} />
                <Features />
                <Pricing />
            </main>
            <Footer />
            {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={() => { setCurrentUser({ name: 'User', avatarUrl: 'https://i.pravatar.cc/150?u=1' }); setIsAuthModalOpen(false); }} />
        </div>
    );
};

export default App;
