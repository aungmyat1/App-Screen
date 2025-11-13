
import React, { useState, useRef, useEffect } from 'react';

// --- Helper Components & Icons ---
// To avoid re-rendering issues, these are defined outside the main App component.

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
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
    // Fix: Replaced `JSX.Element` with `React.ReactElement` to resolve "Cannot find namespace 'JSX'" error.
    const icons: { [key: string]: React.ReactElement } = {
        'batch': <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
        'platform': <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM5 12h.01M19 12h.01M12 5h.01" />,
        'input': <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />,
        'output': <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
        'metadata': <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'api': <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {icons[icon]}
        </svg>
    );
};

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
    };
    
    const Icon = type === 'success' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${typeClasses[type]}`}>
            <div className="flex-shrink-0">{Icon}</div>
            <p className="font-medium">{message}</p>
            <button onClick={onClose} aria-label="Dismiss" className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query) {
        return <>{text}</>;
    }
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex === -1) {
        return <>{text}</>;
    }

    const endIndex = startIndex + query.length;
    
    return (
        <>
            {text.substring(0, startIndex)}
            <strong className="font-bold text-primary-700 dark:text-primary-400">{text.substring(startIndex, endIndex)}</strong>
            {text.substring(endIndex)}
        </>
    );
};


// --- Mock Data & API ---
type AppSuggestion = { name: string; publisher: string; icon: string; url: string; store: 'google' | 'apple'; };

const mockApps: AppSuggestion[] = [
    // Google Play
    { name: 'Google Maps', publisher: 'Google LLC', icon: '🗺️', url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps', store: 'google' },
    { name: 'Instagram', publisher: 'Meta Platforms, Inc.', icon: '📸', url: 'https://play.google.com/store/apps/details?id=com.instagram.android', store: 'google' },
    { name: 'TikTok', publisher: 'TikTok Pte. Ltd.', icon: '🎵', url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically', store: 'google' },
    { name: 'WhatsApp Messenger', publisher: 'WhatsApp LLC', icon: '💬', url: 'https://play.google.com/store/apps/details?id=com.whatsapp', store: 'google' },
    { name: 'Spotify', publisher: 'Spotify AB', icon: '🎧', url: 'https://play.google.com/store/apps/details?id=com.spotify.music', store: 'google' },
    { name: 'YouTube', publisher: 'Google LLC', icon: '▶️', url: 'https://play.google.com/store/apps/details?id=com.google.android.youtube', store: 'google' },
    // Apple App Store
    { name: 'Procreate', publisher: 'Savage Interactive Pty Ltd', icon: '🖌️', url: 'https://apps.apple.com/us/app/procreate/id425073498', store: 'apple' },
    { name: 'Notability', publisher: 'Ginger Labs', icon: '📝', url: 'https://apps.apple.com/us/app/notability/id360593530', store: 'apple' },
    { name: 'Goodnotes 6', publisher: 'Time Base Technology Limited', icon: '📓', url: 'https://apps.apple.com/us/app/goodnotes-6/id1444383602', store: 'apple' },
    { name: 'Things 3', publisher: 'Cultured Code GmbH & Co. KG', icon: '✅', url: 'https://apps.apple.com/us/app/things-3/id904280696', store: 'apple' },
];

const fetchAppSuggestions = async (query: string, store: 'google' | 'apple'): Promise<AppSuggestion[]> => {
    // Simulate network delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!query.trim()) {
        return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    const storeApps = mockApps.filter(app => app.store === store);
    return storeApps.filter(app =>
        app.name.toLowerCase().includes(lowerCaseQuery) ||
        app.publisher.toLowerCase().includes(lowerCaseQuery)
    );
};

const DarkModeToggle: React.FC<{ isDarkMode: boolean; toggle: () => void }> = ({ isDarkMode, toggle }) => {
    return (
        <button
            onClick={toggle}
            className="w-12 h-6 rounded-full p-1 bg-gray-300 dark:bg-gray-700 relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label={isDarkMode ? 'Activate light mode' : 'Activate dark mode'}
        >
            <span className="sr-only">Toggle dark mode</span>
            <div
                className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out"
                style={{ transform: isDarkMode ? 'translateX(24px)' : 'translateX(0)' }}
            />
            {/* Icons inside the button track */}
             <div className="absolute inset-0 flex items-center justify-between px-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-yellow-500 transition-opacity ${isDarkMode ? 'opacity-0' : 'opacity-100'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-gray-200 transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-3.536a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM3.05 11.536a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zm.464 4.95l-.707.707a1 1 0 101.414 1.414l.707-.707a1 1 0 10-1.414-1.414zM16.95 6.464a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        </button>
    );
};


// --- Page Sections ---

const Header: React.FC<{ isDarkMode: boolean; toggleDarkMode: () => void }> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <span className="text-primary">App</span>Screens
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition">Features</a>
          <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition">Pricing</a>
          <a href="#api" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition">API</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button type="button" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition hidden sm:block">Log In</button>
          <button type="button" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition shadow-sm">
            Sign Up Free
          </button>
          <DarkModeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
        </div>
      </div>
    </header>
  );
};

const Hero: React.FC<{ showToast: (message: string, type: 'success' | 'error') => void }> = ({ showToast }) => {
    const [appUrl, setAppUrl] = useState('');
    const [selectedStore, setSelectedStore] = useState<'google' | 'apple'>('google');
    const [suggestions, setSuggestions] = useState<AppSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const suggestionsContainerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeoutRef = useRef<number | null>(null);

    // Debounced effect for fetching app suggestions
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        if (appUrl.trim() === '') {
            setShowSuggestions(false);
            setSuggestions([]);
            return;
        }

        const googleIdRegex = /^([a-zA-Z0-9_]{1,}\.)+[a-zA-Z0-9_]{1,}$/;
        const appleIdRegex = /^\d{9,10}$/;
        const isUrl = appUrl.startsWith('http://') || appUrl.startsWith('https://');
        
        if (isUrl || googleIdRegex.test(appUrl) || appleIdRegex.test(appUrl)) {
            setShowSuggestions(false);
            return;
        }

        setIsSearching(true);
        setShowSuggestions(true);
        setActiveIndex(-1);

        debounceTimeoutRef.current = window.setTimeout(async () => {
            const results = await fetchAppSuggestions(appUrl, selectedStore);
            setSuggestions(results);
            setIsSearching(false);
        }, 250); // 250ms debounce delay

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [appUrl, selectedStore]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAppUrl(e.target.value);
        setError(null);
    };

    const handleSuggestionClick = (app: AppSuggestion) => {
        setAppUrl(app.url);
        setShowSuggestions(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };
    
    // Hide suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsContainerRef.current && !suggestionsContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Scroll active suggestion into view
    useEffect(() => {
        if (activeIndex < 0 || !listboxRef.current) return;
    
        const activeItem = listboxRef.current.querySelector(`#suggestion-item-${activeIndex}`);
        if (activeItem) {
            activeItem.scrollIntoView({
                block: 'nearest',
            });
        }
    }, [activeIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % suggestions.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                break;
            case 'Enter':
                if (activeIndex >= 0) {
                    e.preventDefault();
                    handleSuggestionClick(suggestions[activeIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                setActiveIndex(-1);
                break;
        }
    };

    const fetchScreenshotsFromApi = async (url: string): Promise<Blob> => {
        console.log(`Simulating API call for URL: ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() > 0.15) { // 85% success rate
            const zipContent = `This is a simulated ZIP file for the app at ${url}. It contains screenshots.`;
            return new Blob([zipContent], { type: 'application/zip' });
        } else {
            throw new Error('Failed to fetch screenshots from the server.');
        }
    };

    const handleDownload = async () => {
        setError(null);
        setIsLoading(true);

        const googlePlayUrlRegex = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=([a-zA-Z0-9._-]+)/;
        const appleStoreUrlRegex = /^https:\/\/apps\.apple\.com\/[a-z]{2,3}\/app\/[a-zA-Z0-9-]+\/id(\d+)/;
        const googleIdRegex = /^([a-zA-Z0-9_]{1,}\.)+[a-zA-Z0-9_]{1,}$/;
        const appleIdRegex = /^\d{9,10}$/;
        
        let finalUrl = '';
        const trimmedInput = appUrl.trim();

        // --- Validation and URL construction ---
        // A. Check for specific ID formats first
        if (googleIdRegex.test(trimmedInput)) {
            if (selectedStore === 'google') {
                finalUrl = `https://play.google.com/store/apps/details?id=${trimmedInput}`;
            } else {
                setError("This looks like a Google Play ID. Please switch to the Google Play selector.");
                setIsLoading(false); return;
            }
        } else if (appleIdRegex.test(trimmedInput)) {
            if (selectedStore === 'apple') {
                finalUrl = `https://apps.apple.com/us/app/id${trimmedInput}`;
            } else {
                setError("This looks like an Apple App ID. Please switch to the Apple App Store selector.");
                setIsLoading(false); return;
            }
        }
        // B. If not an ID, check for full URLs
        else if (trimmedInput.includes('play.google.com')) {
            if (googlePlayUrlRegex.test(trimmedInput)) {
                if (selectedStore === 'google') {
                    finalUrl = trimmedInput;
                } else {
                    setError('Incorrect store selected. You provided a Google Play URL; please switch the selector.');
                    setIsLoading(false); return;
                }
            } else {
                setError("Invalid Google Play URL. Please use a full app details URL, e.g., '.../details?id=...'.");
                setIsLoading(false); return;
            }
        } else if (trimmedInput.includes('apps.apple.com')) {
            if (appleStoreUrlRegex.test(trimmedInput)) {
                if (selectedStore === 'apple') {
                    finalUrl = trimmedInput;
                } else {
                    setError('Incorrect store selected. You provided an Apple App Store URL; please switch the selector.');
                    setIsLoading(false); return;
                }
            } else {
                setError("Invalid Apple App Store URL. Please use a full app details URL, e.g., '.../app/app-name/id...'.");
                setIsLoading(false); return;
            }
        }
        // C. If not a recognized ID or URL, treat as a search term
        else {
            try {
                const results = await fetchAppSuggestions(trimmedInput, selectedStore);
                if (results.length > 0) {
                    finalUrl = results[0].url; // Use the first result
                } else {
                    setError(`Could not find an app matching "${trimmedInput}" in the ${selectedStore === 'google' ? 'Google Play Store' : 'Apple App Store'}.`);
                    setIsLoading(false); return;
                }
            } catch (err) {
                setError('Failed to search for the app. Please try again.');
                setIsLoading(false); return;
            }
        }

        if (!finalUrl) {
             setError(`Please enter a valid URL, App ID, or app name for the selected store.`);
             setIsLoading(false);
             return;
        }

        // --- Perform Download ---
        try {
            const blob = await fetchScreenshotsFromApi(finalUrl);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const appName = finalUrl.split('/').pop()?.split('?')[0] || 'app';
            link.download = `app-screenshots-${appName}-${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            showToast('Download started successfully!', 'success');
            setAppUrl('');
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            showToast(`Download failed: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStoreChange = (store: 'google' | 'apple') => {
        if (selectedStore !== store) {
            setSelectedStore(store);
            setError(null);
        }
    };

    return (
        <section className="bg-white dark:bg-gray-800 py-20 md:py-32">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    Download App Screenshots in <span className="text-primary">Seconds</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Instantly grab high-quality screenshots from any app on the Google Play Store or Apple App Store. Perfect for designers, developers, and marketers.
                </p>
                <div className="mt-10 max-w-2xl mx-auto relative" ref={suggestionsContainerRef} onKeyDown={handleKeyDown}>
                    <div role="radiogroup" aria-label="Select app store" className="mb-2 flex justify-center p-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg max-w-sm mx-auto">
                        <button
                            role="radio"
                            aria-checked={selectedStore === 'google'}
                            onClick={() => handleStoreChange('google')}
                            className={`w-full py-2 rounded-md transition-all duration-200 ease-in-out text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-gray-700 ${
                                selectedStore === 'google' ? 'bg-white dark:bg-gray-900 text-primary dark:text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <GooglePlayIcon className="h-5 w-5" />
                                <span>Google Play</span>
                            </span>
                        </button>
                        <button
                            role="radio"
                            aria-checked={selectedStore === 'apple'}
                            onClick={() => handleStoreChange('apple')}
                            className={`w-full py-2 rounded-md transition-all duration-200 ease-in-out text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-gray-700 ${
                                selectedStore === 'apple' ? 'bg-white dark:bg-gray-900 text-primary dark:text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <AppStoreIcon className="h-5 w-5" />
                                <span>Apple App Store</span>
                            </span>
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Input app name, app ID, or app store URL</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={appUrl}
                            onChange={handleInputChange}
                            onFocus={() => { 
                                const googleIdRegex = /^([a-zA-Z0-9_]{1,}\.)+[a-zA-Z0-9_]{1,}$/;
                                const appleIdRegex = /^\d{9,10}$/;
                                const isUrl = appUrl.startsWith('http://') || appUrl.startsWith('https://');
                                if (appUrl.trim() && !isUrl && !googleIdRegex.test(appUrl) && !appleIdRegex.test(appUrl)) {
                                    setShowSuggestions(true);
                                }
                             }}
                            placeholder="Input app name, app ID, or app store URL..."
                            className={`flex-grow px-5 py-4 text-lg rounded-md border-2 transition focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-primary'}`}
                            aria-label="App name, App ID, or App Store URL"
                            aria-invalid={!!error}
                            aria-describedby={error ? "url-error" : undefined}
                            autoComplete="off"
                            role="combobox"
                            aria-expanded={showSuggestions && suggestions.length > 0}
                            aria-controls="suggestion-listbox"
                            aria-activedescendant={activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined}
                        />
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={isLoading || !appUrl}
                            className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 text-lg font-semibold rounded-md hover:bg-primary-700 transition shadow-lg disabled:bg-primary-300 dark:disabled:bg-primary-800 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <LoadingSpinner /> : null}
                            {isLoading ? 'Downloading...' : 'Download Screenshots'}
                        </button>
                    </div>
                    {error && <p id="url-error" className="mt-2 text-red-600 dark:text-red-400 text-left">{error}</p>}

                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 text-left overflow-y-auto max-h-80">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Searching...</div>
                            ) : suggestions.length > 0 ? (
                                <ul ref={listboxRef} role="listbox" id="suggestion-listbox" aria-label="App suggestions">
                                    {suggestions.map((app, index) => (
                                        <li key={app.url}
                                            id={`suggestion-item-${index}`}
                                            role="option"
                                            aria-selected={index === activeIndex}
                                            tabIndex={-1}
                                            onClick={() => handleSuggestionClick(app)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`p-4 flex items-center space-x-4 cursor-pointer focus:outline-none ${
                                                index === activeIndex ? 'bg-primary-50 dark:bg-primary-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <span className="text-2xl" aria-hidden="true">{app.icon}</span>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                                    <HighlightMatch text={app.name} query={appUrl} />
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <HighlightMatch text={app.publisher} query={appUrl} />
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">No results found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const features = [
    { icon: 'batch', title: 'Batch Downloads', description: 'Download all screenshots from multiple apps at once with a simple list of URLs.' },
    { icon: 'platform', title: 'Cross-Platform', description: 'Supports both the Google Play Store and the Apple App Store seamlessly.' },
    { icon: 'input', title: 'Flexible Input', description: 'Provide app names, IDs, or direct store URLs. We find the app for you.' },
    { icon: 'output', title: 'High Resolution', description: 'Get the highest quality screenshots available on the app stores, perfect for presentations.' },
    { icon: 'metadata', title: 'Organized Output', description: 'Screenshots are neatly organized into folders named after the app for easy management.' },
    { icon: 'api', title: 'Developer API', description: 'Integrate screenshot downloading into your own services with our powerful and simple REST API.' },
];

const Features: React.FC = () => (
    <section id="features" className="py-20 dark:bg-gray-900">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Why Choose AppScreens?</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Our service is packed with features designed to save you time and effort.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <div key={feature.icon} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow dark:shadow-none dark:border dark:border-gray-700">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-6">
                           <FeatureIcon icon={feature.icon} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


const pricingPlans = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        features: ['10 downloads per month', 'Standard resolution', 'Community support'],
        buttonText: 'Start for Free',
        primary: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: '/month',
        features: ['Unlimited downloads', 'High resolution', 'Batch processing', 'API access (1000 calls/mo)', 'Priority email support'],
        buttonText: 'Get Started',
        primary: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        features: ['Everything in Pro', 'Unlimited API calls', 'Dedicated account manager', 'Custom integrations', '24/7 support'],
        buttonText: 'Contact Sales',
        primary: false,
    },
];

const Pricing: React.FC = () => (
  <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the plan that's right for you. No hidden fees, ever.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className={`border rounded-lg p-8 flex flex-col ${plan.primary ? 'border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20 relative' : 'border-gray-200 dark:border-gray-700'}`}>
            {plan.primary && <span className="absolute top-0 right-8 -mt-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{plan.period}</span>
            </div>
            <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-300 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button type="button" className={`mt-8 w-full py-3 rounded-md font-semibold transition ${plan.primary ? 'bg-primary text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials: React.FC = () => {
    const testimonials = [
        {
            quote: "AppScreens has been a game-changer for our ASO process. The speed and quality are unmatched. We save hours every week!",
            name: "Sarah L.",
            role: "Marketing Manager @ AppCo",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
        },
        {
            quote: "The developer API is incredibly easy to use. We integrated it into our CI/CD pipeline to automate our store listing updates.",
            name: "Mike R.",
            role: "Lead iOS Developer @ MobileFirst",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
        },
        {
            quote: "As a freelance designer, I need to quickly grab screenshots for mockups. This tool is simple, fast, and reliable. Highly recommended.",
            name: "Jessica P.",
            role: "UI/UX Designer",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d"
        }
    ];

    const logos = [
        { name: "TechCrunch", src: "https://tailwindui.com/img/logos/158x48/techcrunch-gray-900.svg", darkSrc: "https://tailwindui.com/img/logos/158x48/techcrunch-white.svg" },
        { name: "Forbes", src: "https://tailwindui.com/img/logos/158x48/forbes-gray-900.svg", darkSrc: "https://tailwindui.com/img/logos/158x48/forbes-white.svg" },
        { name: "Tuple", src: "https://tailwindui.com/img/logos/158x48/tuple-gray-900.svg", darkSrc: "https://tailwindui.com/img/logos/158x48/tuple-white.svg" },
        { name: "Statamic", src: "https://tailwindui.com/img/logos/158x48/statamic-gray-900.svg", darkSrc: "https://tailwindui.com/img/logos/158x48/statamic-white.svg" },
        { name: "Transistor", src: "https://tailwindui.com/img/logos/158x48/transistor-gray-900.svg", darkSrc: "https://tailwindui.com/img/logos/158x48/transistor-white.svg" },
    ];

    return (
        <section className="py-20 dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Trusted by Developers Worldwide</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our users are saying.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.name} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700">
                            <p className="text-gray-700 dark:text-gray-300 before:content-['“'] before:text-4xl before:font-serif before:text-gray-300 dark:before:text-gray-600 before:mr-1 before:-ml-4 after:content-['”'] after:text-4xl after:font-serif after:text-gray-300 dark:after:text-gray-600 after:ml-1">
                                {testimonial.quote}
                            </p>
                            <div className="mt-6 flex items-center">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-20">
                    <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-4">
                        {logos.map(logo => (
                           <picture key={logo.name}>
                                <source srcSet={logo.darkSrc} media="(prefers-color-scheme: dark)" />
                                <img className="h-10 opacity-60 dark:opacity-80" src={logo.src} alt={logo.name} />
                           </picture>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


const ApiSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'google' | 'apple'>('google');
    const [copyStatus, setCopyStatus] = useState('Copy');

    const codeExamples = {
        google: `POST /v1/screenshots
Host: api.appscreens.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "url": "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
  "format": "zip"
}`,
        apple: `POST /v1/screenshots
Host: api.appscreens.com
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "url": "https://apps.apple.com/us/app/procreate/id425073498",
  "format": "zip"
}`
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(codeExamples[activeTab]).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    };

    return (
        <section id="api" className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Powerful Developer API</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Automate your workflows by integrating our screenshot service directly into your applications. Our REST API is simple, robust, and well-documented.
                        </p>
                        <div className="mt-8 space-y-4 text-gray-800 dark:text-gray-200">
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                                <span><strong>Simple Endpoints:</strong> Easy-to-understand endpoints for fetching app data and screenshots.</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                                <span><strong>Secure Authentication:</strong> Protect your access with secure API keys.</span>
                            </div>
                            <div className="flex items-start">
                                <CheckIcon className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                                <span><strong>Scalable Infrastructure:</strong> Built to handle high volumes of requests without breaking a sweat.</span>
                            </div>
                        </div>
                        <button type="button" className="mt-8 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700 transition shadow-sm font-semibold">
                            Read API Docs
                        </button>
                    </div>
                    <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                        {/* Tabs */}
                        <div className="bg-gray-800/50 p-2 flex border-b border-gray-700">
                            <button
                                onClick={() => { setActiveTab('google'); setCopyStatus('Copy'); }}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary ${activeTab === 'google' ? 'bg-primary/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Google Play
                            </button>
                            <button
                                onClick={() => { setActiveTab('apple'); setCopyStatus('Copy'); }}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary ${activeTab === 'apple' ? 'bg-primary/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Apple App Store
                            </button>
                        </div>
                        {/* Code Content */}
                        <div className="relative p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-xs transition-colors"
                                aria-label="Copy code snippet"
                            >
                                {copyStatus === 'Copy' ? (
                                    <>
                                        <CopyIcon className="w-4 h-4" />
                                        <span>Copy</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400">Copied!</span>
                                    </>
                                )}
                            </button>
                            <pre><code className="whitespace-pre-wrap">{codeExamples[activeTab]}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-bold">AppScreens</h3>
                    <p className="mt-2 text-gray-400 text-sm">The fastest way to get app screenshots.</p>
                </div>
                <div>
                    <h4 className="font-semibold">Product</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                        <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                        <li><a href="#api" className="text-gray-400 hover:text-white transition">API</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Company</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Legal</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} AppScreens. All rights reserved.
            </div>
        </div>
    </footer>
);


const App: React.FC = () => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check for saved preference in localStorage, otherwise check system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, id: Date.now() });
    };

    const handleCloseToast = () => {
        setToast(null);
    };
    
    return (
        <div className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main>
                <Hero showToast={showToast} />
                <Features />
                <Pricing />
                <Testimonials />
                <ApiSection />
            </main>
            <Footer />
            {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={handleCloseToast} />}
        </div>
    );
};

export default App;
