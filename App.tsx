
import React, { useState, useRef, useEffect } from 'react';

// --- Helper Components & Icons ---
// To avoid re-rendering issues, these are defined outside the main App component.

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const AppStoreIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const GooglePlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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


// --- Page Sections ---

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">
          <span className="text-primary">App</span>Screens
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="text-gray-600 hover:text-primary transition">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-primary transition">Pricing</a>
          <a href="#api" className="text-gray-600 hover:text-primary transition">API</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-primary transition hidden sm:block">Log In</button>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition shadow-sm">
            Sign Up Free
          </button>
        </div>
      </div>
    </header>
  );
};

const Hero: React.FC = () => {
    const [appUrl, setAppUrl] = useState('');
    const [suggestions, setSuggestions] = useState<{ name: string; publisher: string; icon: string; url: string; }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Mock data for app suggestions
    const mockApps = [
        { name: 'Google Maps', publisher: 'Google LLC', icon: '🗺️', url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps' },
        { name: 'Instagram', publisher: 'Meta Platforms, Inc.', icon: '📸', url: 'https://play.google.com/store/apps/details?id=com.instagram.android' },
        { name: 'TikTok', publisher: 'TikTok Pte. Ltd.', icon: '🎵', url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically' },
        { name: 'WhatsApp Messenger', publisher: 'WhatsApp LLC', icon: '💬', url: 'https://play.google.com/store/apps/details?id=com.whatsapp' },
        { name: 'Spotify', publisher: 'Spotify AB', icon: '🎧', url: 'https://play.google.com/store/apps/details?id=com.spotify.music' },
        { name: 'Netflix', publisher: 'Netflix, Inc.', icon: '🎬', url: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setAppUrl(query);

        if (query.length > 0) {
            const filteredSuggestions = mockApps.filter(app =>
                app.name.toLowerCase().includes(query.toLowerCase()) ||
                app.publisher.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(filteredSuggestions.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };
    
    const handleSuggestionClick = (app: { url: string }) => {
        setAppUrl(app.url);
        setShowSuggestions(false);
    };

    const handleFocus = () => {
        if (appUrl.length > 0 && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    }

    // Effect to handle clicks outside the suggestions dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    The Easiest Way to Download <br /> <span className="text-primary">App Screenshots</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                    Instantly grab high-quality screenshots from the Apple App Store and Google Play Store. Perfect for developers, marketers, and ASO specialists.
                </p>
                <div className="mt-10 max-w-2xl mx-auto" ref={suggestionsRef}>
                    <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative flex-grow">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none space-x-2">
                                <AppStoreIcon />
                                <GooglePlayIcon />
                            </div>
                            <input
                                type="text"
                                value={appUrl}
                                onChange={handleInputChange}
                                onFocus={handleFocus}
                                placeholder="Enter App Store or Google Play URL/ID"
                                className="w-full pl-20 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-primary-500 focus:border-primary-500 transition text-lg"
                                autoComplete="off"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl text-left max-h-80 overflow-y-auto">
                                    {suggestions.map((app) => (
                                        <li 
                                            key={app.name} 
                                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4 border-b last:border-b-0"
                                            onMouseDown={() => handleSuggestionClick(app)}
                                        >
                                            <div className="text-3xl flex-shrink-0 w-10 text-center">{app.icon}</div>
                                            <div className="overflow-hidden">
                                                <div className="font-semibold text-gray-800 truncate">{app.name}</div>
                                                <div className="text-sm text-gray-500 truncate">{app.publisher}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition shadow-md"
                        >
                            Download Screenshots
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-gray-500">
                        10 free downloads. No credit card required.
                    </p>
                </div>
            </div>
        </section>
    );
};

const features = [
    { icon: 'batch', title: 'Batch Download', description: 'Process multiple apps simultaneously to save time.' },
    { icon: 'platform', title: 'Multi-Platform Support', description: 'Works seamlessly with both Google Play and the Apple App Store.' },
    { icon: 'input', title: 'Flexible Input Methods', description: 'Use an App ID, store URL, or even search by app name.' },
    { icon: 'output', title: 'Versatile Output Formats', description: 'Get screenshots as ZIP archives, organized folders, or via API.' },
    { icon: 'metadata', title: 'Metadata Extraction', description: 'Download app name, version, ratings, and description.' },
    { icon: 'api', title: 'Full-Featured API', description: 'Integrate our screenshot service directly into your workflow.' },
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        An All-in-One Screenshot Solution
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        We provide all the tools you need to streamline your app analysis and marketing efforts.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-50 mb-6">
                                <FeatureIcon icon={feature.icon} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const pricingPlans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for getting started.',
        features: ['10 downloads per month', 'Single app processing', 'Standard resolution', 'Email support'],
        popular: false,
    },
    {
        name: 'Starter',
        price: '$19',
        description: 'For individuals and small teams.',
        features: ['100 downloads per month', 'Batch processing (up to 5 apps)', 'High resolution downloads', 'API access (1000 req/mo)', 'Email support'],
        popular: false,
    },
    {
        name: 'Professional',
        price: '$49',
        description: 'For power users and businesses.',
        features: ['500 downloads per month', 'Batch processing (up to 20 apps)', 'All resolutions available', 'API access (10,000 req/mo)', 'Priority processing', 'Chrome extension access', 'Live chat support'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$149',
        description: 'For large-scale operations.',
        features: ['Unlimited downloads', 'Unlimited batch processing', 'White-label API', 'Dedicated account manager', 'Custom integrations', 'Phone support'],
        popular: false,
    },
];

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Choose the Plan That's Right for You
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Simple, transparent pricing that scales with your needs. No hidden fees.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-xl border p-8 flex flex-col relative ${plan.popular ? 'border-primary-500 border-2' : 'border-gray-200'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-gray-500 mt-2">{plan.description}</p>
                            <div className="mt-6">
                                <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                                {plan.price !== '$0' && <span className="text-lg font-medium text-gray-500">/month</span>}
                            </div>
                            <ul className="mt-8 space-y-4 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`w-full mt-8 py-3 rounded-lg font-semibold ${plan.popular ? 'bg-primary text-white hover:bg-primary-700' : 'bg-primary-50 text-primary hover:bg-primary-100'}`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ApiSection: React.FC = () => {
    return (
        <section id="api" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="bg-gray-800 rounded-xl p-8 md:p-12 lg:flex items-center justify-between">
                    <div className="lg:w-1/2 text-white">
                        <h2 className="text-3xl font-bold mb-4">Powerful API & Chrome Extension</h2>
                        <p className="text-gray-300 mb-8 max-w-lg">
                            Automate your screenshot workflow with our RESTful API or grab screenshots with a single click while browsing the app stores using our Chrome extension.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">Read API Docs</button>
                            <button className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition">Get Chrome Extension</button>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-12">
                        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                            <pre><code>
{`fetch('https://api.appscreens.io/v1/download', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps'
  })
})`}
                            </code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href="#features" className="hover:text-primary">Features</a></li>
                            <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                            <li><a href="#api" className="hover:text-primary">API</a></li>
                            <li><a href="#" className="hover:text-primary">Chrome Extension</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href="#" className="hover:text-primary">About Us</a></li>
                            <li><a href="#" className="hover:text-primary">Blog</a></li>
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                        </ul>
                    </div>
                     <div className="text-2xl font-bold text-gray-900">
                      <span className="text-primary">App</span>Screens
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} AppScreens. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  return (
    <div className="bg-gray-50">
        <Header />
        <main>
            <Hero />
            <Features />
            <Pricing />
            <ApiSection />
        </main>
        <Footer />
    </div>
  );
};

export default App;
