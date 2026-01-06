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

// --- Utils ---

const APP_STORE_PATTERNS = {
    google: /^(https?:\/\/)?play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9._]+/,
    apple: /^(https?:\/\/)?apps\.apple\.com\/([a-z]{2}\/)?app\/[a-zA-Z0-9-]+\/id[0-9]+/
};

const validateAppStoreUrl = (url: string): { isValid: boolean; store?: 'google' | 'apple' } => {
    const trimmed = url.trim();
    if (APP_STORE_PATTERNS.google.test(trimmed)) return { isValid: true, store: 'google' };
    if (APP_STORE_PATTERNS.apple.test(trimmed)) return { isValid: true, store: 'apple' };
    return { isValid: false };
};

const isPotentialUrl = (text: string): boolean => {
    return text.includes('play.google.com') || text.includes('apps.apple.com') || text.startsWith('http');
};

// --- Icons ---

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
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

type SortOption = 'rating' | 'downloads' | 'date';

type User = { name: string; avatarUrl: string; };
type AppSuggestion = { 
    name: string; 
    publisher: string; 
    icon: string; 
    url: string; 
    store: 'google' | 'apple'; 
    rating: number; 
    downloads: string;
    releaseDate: string; // ISO format
};

const mockApps: AppSuggestion[] = [
    { name: 'Google Maps', publisher: 'Google LLC', icon: '🗺️', url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps', store: 'google', rating: 4.7, downloads: '5B+', releaseDate: '2010-09-14' },
    { name: 'Instagram', publisher: 'Meta Platforms, Inc.', icon: '📸', url: 'https://play.google.com/store/apps/details?id=com.instagram.android', store: 'google', rating: 4.5, downloads: '5B+', releaseDate: '2012-04-03' },
    { name: 'TikTok', publisher: 'TikTok Pte. Ltd.', icon: '🎵', url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically', store: 'google', rating: 4.4, downloads: '1B+', releaseDate: '2017-09-14' },
    { name: 'WhatsApp Messenger', publisher: 'WhatsApp LLC', icon: '💬', url: 'https://play.google.com/store/apps/details?id=com.whatsapp', store: 'google', rating: 4.3, downloads: '5B+', releaseDate: '2010-10-18' },
    { name: 'Spotify', publisher: 'Spotify AB', icon: '🎧', url: 'https://play.google.com/store/apps/details?id=com.spotify.music', store: 'google', rating: 4.4, downloads: '1B+', releaseDate: '2008-10-07' },
    { name: 'Procreate', publisher: 'Savage Interactive Pty Ltd', icon: '🖌️', url: 'https://apps.apple.com/us/app/procreate/id425073498', store: 'apple', rating: 4.5, downloads: '10M+', releaseDate: '2011-03-16' },
    { name: 'ChatGPT', publisher: 'OpenAI', icon: '🤖', url: 'https://apps.apple.com/us/app/chatgpt/id6448311069', store: 'apple', rating: 4.9, downloads: '50M+', releaseDate: '2023-05-18' },
    { name: 'YouTube', publisher: 'Google LLC', icon: '▶️', url: 'https://apps.apple.com/us/app/youtube-watch-listen-stream/id544007664', store: 'apple', rating: 4.7, downloads: '1B+', releaseDate: '2012-09-11' },
    { name: 'Slack', publisher: 'Slack Technologies', icon: '💼', url: 'https://play.google.com/store/apps/details?id=com.Slack', store: 'google', rating: 4.2, downloads: '100M+', releaseDate: '2013-08-12' },
    { name: 'Notion', publisher: 'Notion Labs, Inc.', icon: '📓', url: 'https://apps.apple.com/us/app/notion-notes-projects-docs/id1232780281', store: 'apple', rating: 4.8, downloads: '20M+', releaseDate: '2018-06-05' },
];

const parseDownloads = (d: string) => {
    const num = parseFloat(d);
    if (d.includes('B')) return num * 1_000_000_000;
    if (d.includes('M')) return num * 1_000_000;
    if (d.includes('K')) return num * 1_000;
    return num;
};

const fetchAppSuggestions = async (query: string, store: 'google' | 'apple' | 'both', sortBy: SortOption): Promise<AppSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const q = query.trim();
    if (!q) return [];
    
    // If it looks like a direct URL, don't show search suggestions
    if (isPotentialUrl(q)) return [];

    const lowerCaseQuery = q.toLowerCase();
    
    // Filter
    let filtered = mockApps.filter(app => {
        const matchesStore = store === 'both' || app.store === store;
        const matchesQuery = app.name.toLowerCase().includes(lowerCaseQuery) || 
                             app.publisher.toLowerCase().includes(lowerCaseQuery);
        return matchesStore && matchesQuery;
    });

    // Sort
    filtered.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'downloads') return parseDownloads(b.downloads) - parseDownloads(a.downloads);
        if (sortBy === 'date') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        return 0;
    });

    return filtered.slice(0, 8);
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
    currentView: 'home' | 'api';
    setView: (view: 'home' | 'api') => void;
}> = ({ isDarkMode, toggleDarkMode, currentUser, onLogin, onLogout, currentView, setView }) => {
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
                <button onClick={() => setView('home')} className="text-xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-slate-900 dark:text-white">App<span className="text-primary-600 dark:text-primary-400">Screens</span></span>
                </button>
                
                <nav className="hidden md:flex space-x-8 text-sm font-medium">
                    <button onClick={() => setView('home')} className={`transition-colors ${currentView === 'home' ? 'text-primary-600 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600'}`}>Home</button>
                    <a href="#features" onClick={() => setView('home')} className="text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors">Features</a>
                    <a href="#pricing" onClick={() => setView('home')} className="text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors">Pricing</a>
                    <button onClick={() => setView('api')} className={`transition-colors ${currentView === 'api' ? 'text-primary-600 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600'}`}>API</button>
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

// --- API Documentation Section ---

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'javascript' }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group mt-4">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={copyToClipboard}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-md text-xs border border-slate-700 transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 p-5 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-800/50">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const ApiDocs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('js');

    const examples = {
        curl: `curl -X GET "https://api.appscreens.io/v2/screenshots?app_id=com.instagram.android" \\
  -H "X-API-Key: YOUR_API_KEY"`,
        js: `const response = await fetch('https://api.appscreens.io/v2/screenshots?app_id=com.instagram.android', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});
const data = await response.json();
console.log(data.screenshots);`,
        python: `import requests

headers = {'X-API-Key': 'YOUR_API_KEY'}
url = "https://api.appscreens.io/v2/screenshots"
params = {"app_id": "com.instagram.android"}

response = requests.get(url, headers=headers, params=params)
print(response.json())`
    };

    return (
        <section className="pt-32 pb-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="sticky top-24 space-y-1">
                            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Introduction</p>
                            <a href="#intro" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Overview</a>
                            <a href="#authentication" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Authentication</a>
                            
                            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mt-8 mb-3">Endpoints</p>
                            <a href="#search" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">Search Apps</a>
                            <a href="#screenshots" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">Get Screenshots</a>
                            
                            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mt-8 mb-3">System</p>
                            <a href="#errors" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Error Codes</a>
                            <a href="#rate-limits" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Rate Limits</a>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div id="intro" className="mb-16">
                            <h1 className="text-4xl font-extrabold mb-4">API Documentation</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                                Welcome to the AppScreens API. Our REST API allows you to automate screenshot collection, metadata extraction, and competitive research for any app on the Google Play Store or Apple App Store.
                            </p>
                            <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl flex items-center gap-3">
                                <div className="text-primary-600 font-mono text-sm font-bold">BASE URL:</div>
                                <code className="text-primary-700 dark:text-primary-300 font-mono text-sm select-all">https://api.appscreens.io/v2</code>
                            </div>
                        </div>

                        <div id="authentication" className="mb-16 scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                The AppScreens API uses API Keys to authenticate requests. You can find your API Key in your <a href="#" className="text-primary-600 hover:underline">Account Dashboard</a>. Your API Key should be included in all API requests in the HTTP header.
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <p className="text-sm font-semibold mb-2">Header Example:</p>
                                <code className="text-slate-800 dark:text-slate-200 font-mono text-sm">X-API-Key: YOUR_API_KEY</code>
                            </div>
                        </div>

                        <div id="screenshots" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg border border-green-200 dark:border-green-800">GET</span>
                                <h2 className="text-2xl font-bold">/screenshots</h2>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                Retrieve high-resolution screenshot URLs for a specific application.
                            </p>

                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Query Parameters</h3>
                            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl mb-8">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Parameter</th>
                                            <th className="px-4 py-3 font-semibold">Type</th>
                                            <th className="px-4 py-3 font-semibold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-primary-600">app_id</td>
                                            <td className="px-4 py-3 text-slate-500">string</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400"><span className="text-red-500 font-bold mr-2">Required.</span> The bundle ID or package name (e.g., com.instagram.android)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-primary-600">store</td>
                                            <td className="px-4 py-3 text-slate-500">string</td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Either <code className="text-xs px-1 bg-slate-100 dark:bg-slate-800 rounded">google</code> or <code className="text-xs px-1 bg-slate-100 dark:bg-slate-800 rounded">apple</code>. Defaults to <code className="text-xs px-1 bg-slate-100 dark:bg-slate-800 rounded">google</code>.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8">
                                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-1">
                                    {(['js', 'curl', 'python'] as const).map(tab => (
                                        <button 
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                                                activeTab === tab 
                                                ? 'border-primary-500 text-primary-600' 
                                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            {tab === 'js' ? 'JavaScript' : tab === 'curl' ? 'cURL' : 'Python'}
                                        </button>
                                    ))}
                                </div>
                                <CodeBlock code={examples[activeTab]} />
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Response Example</h3>
                                <CodeBlock code={`{
  "status": "success",
  "app_id": "com.instagram.android",
  "screenshots": [
    {
      "url": "https://play-lh.googleusercontent.com/...",
      "type": "phone",
      "index": 0
    },
    ...
  ],
  "meta": {
    "version": "315.0.0",
    "last_updated": "2024-05-20"
  }
}`} />
                            </div>
                        </div>

                        <div id="rate-limits" className="mb-16 scroll-mt-24 p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                To ensure stability, we implement rate limits on our API. If you exceed these limits, the API will respond with a <code className="text-red-500">429 Too Many Requests</code> status code.
                            </p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="font-medium">Free Plan</span>
                                    <span className="text-slate-500 font-mono">10 requests / minute</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                    <span className="font-medium">Pro Plan</span>
                                    <span className="text-slate-500 font-mono">1,000 requests / minute</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-medium">Enterprise</span>
                                    <span className="text-slate-500 font-mono">Unlimited</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Sub-components (Rest) ---

const Hero: React.FC<{ showToast: (message: string, type: 'success' | 'error') => void }> = ({ showToast }) => {
    const [appUrl, setAppUrl] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const suggestionsContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedAppUrl = useDebounce(appUrl, 300);
    const { data: suggestions = [], isLoading: isSearching } = useQuery({
        queryKey: ['suggestions', debouncedAppUrl],
        queryFn: () => fetchAppSuggestions(debouncedAppUrl, 'both', 'rating'),
        enabled: !!debouncedAppUrl.trim(),
    });

    useEffect(() => {
        setActiveIndex(-1);
    }, [suggestions]);

    useEffect(() => {
        if (!debouncedAppUrl.trim()) {
            setShowSuggestions(false);
            return;
        }
        setShowSuggestions(true);
    }, [debouncedAppUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAppUrl(value);
        setError(null);
        
        // Show suggestions only if it's NOT a direct URL
        if (value.trim() && !isPotentialUrl(value.trim())) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };
    
    const handleInputFocus = () => {
        if (appUrl.trim() && !isPotentialUrl(appUrl.trim())) setShowSuggestions(true);
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
        const trimmed = appUrl.trim();
        if (!trimmed) {
            setError("Search for an app or paste a store link.");
            return;
        }

        const { isValid, store } = validateAppStoreUrl(trimmed);
        
        if (!isValid) {
            if (isPotentialUrl(trimmed)) {
                setError("Please provide a valid App Store or Play Store app link.");
            } else {
                setError("Select an app from the search results or paste a valid store link.");
            }
            return;
        }

        setError(null);
        setIsLoading(true);
        // Simulation of processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast(`Download started for ${store === 'google' ? 'Play Store' : 'App Store'} app!`, 'success');
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
                    New: High-Res ASO Tools v2.2
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
                    App Screenshots. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">Instantly.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Download assets from Google Play & Apple App Store in seconds. High-quality original files ready for your next project.
                </p>

                <div className="max-w-3xl mx-auto relative" ref={suggestionsContainerRef} onKeyDown={handleKeyDown}>
                    {/* Primary Input Container */}
                    <div className={`bg-white dark:bg-slate-900/80 p-2 rounded-3xl shadow-2xl border ${error ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'} backdrop-blur-sm transition-all focus-within:ring-4 ${error ? 'focus-within:ring-red-100/50' : 'focus-within:ring-primary-100/50'} group`}>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex-1 w-full relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={appUrl}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    placeholder="Search apps or paste a store URL..."
                                    className="w-full bg-transparent border-none outline-none text-lg pl-12 pr-4 py-4 text-slate-900 dark:text-white"
                                    autoComplete="off"
                                />
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={isLoading || !appUrl.trim()}
                                className={`w-full sm:w-auto px-10 py-4 rounded-2xl ${error ? 'bg-slate-500' : 'bg-primary-600 hover:bg-primary-700'} text-white font-bold text-lg shadow-xl ${error ? 'shadow-slate-500/30' : 'shadow-primary-500/30'} disabled:opacity-50 transition-all transform active:scale-95`}
                            >
                                {isLoading ? <LoadingSpinner /> : 'Download'}
                            </button>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 py-2 px-4 rounded-xl animate-shake">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-20 text-left overflow-hidden animate-fade-in ring-1 ring-black/5">
                            <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {isSearching ? 'Searching...' : `${suggestions.length} apps found`}
                                </span>
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
                                    Search suggestions
                                </span>
                            </div>
                            {isSearching ? (
                                <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-4">
                                    <LoadingSpinner />
                                    <span className="text-sm font-bold tracking-tight">Searching app database...</span>
                                </div>
                            ) : suggestions.length > 0 ? (
                                <ul className="max-h-[400px] overflow-y-auto">
                                    {suggestions.map((app, index) => (
                                        <li key={app.url}
                                            onClick={() => handleSuggestionClick(app)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`p-5 flex items-center space-x-5 cursor-pointer transition-all border-b last:border-none border-slate-50 dark:border-slate-800 ${
                                                index === activeIndex ? 'bg-primary-50 dark:bg-primary-900/30 scale-[0.99] rounded-xl mx-2 my-1 border-transparent' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            <span className="text-4xl flex-shrink-0 bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">{app.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-extrabold text-slate-900 dark:text-slate-100 truncate text-lg tracking-tight">
                                                        <HighlightMatch text={app.name} query={appUrl} />
                                                    </p>
                                                    <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${app.store === 'google' ? 'text-green-600' : 'text-blue-500'}`}>
                                                        {app.store === 'google' ? <GooglePlayIcon className="w-3.5 h-3.5" /> : <AppStoreIcon className="w-3.5 h-3.5" />}
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 truncate">{app.publisher}</p>
                                                <div className="flex items-center gap-3 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5 text-yellow-600">
                                                        <StarIcon className="w-3.5 h-3.5" /> {app.rating}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{app.downloads} DLs</span>
                                                    <span>•</span>
                                                    <span>v{new Date(app.releaseDate).getFullYear()}.{new Date(app.releaseDate).getMonth() + 1}</span>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block">
                                                <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all shadow-md">
                                                    Select
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">No apps matching your query</p>
                                    <p className="text-sm text-slate-500 mt-2">Try different keywords or paste a direct store URL.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
                    transform: translate3d(0, 0, 0);
                }
            ` }} />
        </section>
    );
};

const Features: React.FC = () => (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to analyze apps</h2>
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
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white mb-6 group-hover:scale-110 transition-transform">
                           <FeatureIcon icon={feature.icon} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
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
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Simple Pricing</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Scale as you grow.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    { name: 'Hobby', price: '$0', features: ['10 downloads/mo', 'Standard Quality'] },
                    { name: 'Pro', price: '$29', features: ['Unlimited downloads', 'High Res Source', 'API Access'], primary: true },
                    { name: 'Team', price: '$99', features: ['Unlimited Seats', 'Dedicated API Key', 'Priority Support'] }
                ].map((plan) => (
                    <div key={plan.name} className={`p-8 rounded-3xl border transition-all ${plan.primary ? 'bg-slate-900 text-white border-slate-900 shadow-2xl ring-4 ring-primary-500/20 lg:-mt-4 relative overflow-hidden' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                        {plan.primary && <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-black px-4 py-1 rotate-45 translate-x-3 translate-y-3">POPULAR</div>}
                        <h3 className={`text-2xl font-bold ${plan.primary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.name}</h3>
                        <div className="my-8">
                            <span className="text-5xl font-extrabold">{plan.price}</span>
                            <span className="text-lg opacity-60">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center text-sm">
                                    <CheckIcon className={`w-5 h-5 mr-3 ${plan.primary ? 'text-primary-400' : 'text-primary-500'}`} />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.primary ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Get Started</button>
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
                 <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                 <span className="font-bold text-slate-900 dark:text-white">AppScreens</span>
            </div>
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} AppScreens Inc. All rights reserved.</p>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-8 rounded-3xl shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign in to your account</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <GoogleIcon /> Sign in with Google
                    </button>
                    <div className="relative flex py-2 items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="mx-2">Or with Email</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" />
                    <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors">
                        {isLoading ? <LoadingSpinner /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<'home' | 'api'>('home');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type, id: Date.now() });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">
            <Header 
                isDarkMode={isDarkMode} 
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                currentUser={currentUser} 
                onLogin={() => setIsAuthModalOpen(true)} 
                onLogout={() => setCurrentUser(null)} 
                currentView={currentView}
                setView={setCurrentView}
            />
            <main>
                {currentView === 'home' ? (
                    <>
                        <Hero showToast={showToast} />
                        <Features />
                        <Pricing />
                    </>
                ) : (
                    <ApiDocs />
                )}
            </main>
            <Footer />
            {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onLoginSuccess={() => { 
                    setCurrentUser({ name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=alex' }); 
                    setIsAuthModalOpen(false); 
                    showToast('Logged in successfully!', 'success');
                }} 
            />
        </div>
    );
};

export default App;