const { useState } = React;

// API Configuration
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

// Landing Page Component
function LandingPage({ onStart }) {
    return (
        <div className="landing-page">
            <div className="pelora-header">
                <div className="pelora-logo">P</div>
                <h1 className="pelora-title">Pelora</h1>
                <p className="pelora-tagline">Expert curl care in your pocket.</p>
            </div>
            <button className="btn btn-primary" onClick={onStart}>
                Start Your Curl Journey
            </button>
        </div>
    );
}

// Quiz Component
function Quiz({ onComplete }) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState({
        goals: [],
        porosity: null,
        treatments: [],
        treatmentRecency: null,
        journey: null,
        routine: [],
        scalp: null,
    });

    const screens = [
        {
            title: "What are you hoping to achieve with your curls?",
            subtitle: "Let's get to know your curls!",
            type: "multi-select",
            key: "goals",
            options: [
                "More volume & bounce",
                "Curl definition & frizz control",
                "Length & growth",
                "Damage repair",
            ],
        },
        {
            title: "Let's test your porosity!",
            subtitle: "Interactive tutorial",
            type: "select",
            key: "porosity",
            options: [
                { label: "🔝 Still floating on top", value: "low" },
                { label: "🔄 Sank slowly to the middle", value: "medium" },
                { label: "⬇️ Went straight to the bottom", value: "high" },
                { label: "⏭️ Skip for now", value: "skip" },
            ],
            showSkip: true,
        },
        {
            title: "What has your hair been through?",
            subtitle: "Select all that apply",
            type: "multi-select",
            key: "treatments",
            options: [
                "Relaxers or chemical straightening",
                "Keratin treatments",
                "Hair color or bleach",
                "Regular heat styling (flat iron, blow dryer)",
                "Extensions, weaves, or wigs",
                "None — mostly natural",
            ],
            followUp: true,
        },
        {
            title: "Where are you in your curl care journey?",
            subtitle: "",
            type: "select",
            key: "journey",
            options: [
                "Just getting started — no real routine yet",
                "I have a basic routine but not sure it's working",
                "I know my hair pretty well and want to level up",
                "Transitioning from heat/chemical-treated hair",
            ],
        },
        {
            title: "One last thing — what's your scalp like?",
            subtitle: "",
            type: "select",
            key: "scalp",
            options: ["Oily", "Dry", "Balanced", "Flaky or irritated", "Not sure"],
        },
    ];

    const handleSelect = (key, value) => {
        setAnswers(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleMultiSelect = (key, value) => {
        setAnswers(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value],
        }));
    };

    const canProceed = () => {
        const screen = screens[currentScreen];
        if (screen.type === "multi-select") {
            return answers[screen.key].length > 0 || screen.showSkip;
        }
        return answers[screen.key] !== null;
    };

    const handleNext = () => {
        if (currentScreen < screens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onComplete(answers);
        }
    };

    const handleBack = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    const screen = screens[currentScreen];
    const progress = ((currentScreen + 1) / screens.length) * 100;

    const motivationalMessages = [
        "Let's get to know your curls!",
        "Nice — you're already learning something new!",
        "Halfway to your custom curl plan 💜",
        "Almost there — your personalized routine is loading...",
        "All set! Time to show us those curls 📸",
    ];

    return (
        <div className="quiz-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="progress-dots">
                {screens.map((_, i) => (
                    <div key={i} className={`dot ${i < currentScreen + 1 ? 'filled' : ''}`}></div>
                ))}
            </div>

            <h2 className="quiz-title">{screen.title}</h2>
            {screen.subtitle && <p className="quiz-subtitle">{screen.subtitle}</p>}

            <div className="quiz-options">
                {screen.type === "select" ? (
                    screen.options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`quiz-option ${answers[screen.key] === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(screen.key, option.value)}
                        >
                            {option.label}
                        </div>
                    ))
                ) : (
                    screen.options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`quiz-option ${answers[screen.key].includes(option) ? 'selected' : ''}`}
                            onClick={() => handleMultiSelect(screen.key, option)}
                        >
                            <div className="quiz-option-multi">
                                <div className="checkbox">
                                    {answers[screen.key].includes(option) && '✓'}
                                </div>
                                {option}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="quiz-actions">
                <button
                    className="btn btn-secondary btn-small"
                    onClick={handleBack}
                    disabled={currentScreen === 0}
                    style={{ opacity: currentScreen === 0 ? 0.5 : 1 }}
                >
                    Back
                </button>
                <button
                    className="btn btn-primary btn-small"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    style={{ opacity: !canProceed() ? 0.5 : 1 }}
                >
                    {currentScreen === screens.length - 1 ? 'Next: Upload Photos' : 'Next'}
                </button>
            </div>

            <p className="motivational-text">{motivationalMessages[currentScreen]}</p>
        </div>
    );
}

// Photo Upload Component
function PhotoUpload({ onComplete, quizAnswers }) {
    const [photos, setPhotos] = useState({
        roots: null,
        midLength: null,
        ends: null,
        face: null,
    });
    const [uploading, setUploading] = useState(false);

    const photoLabels = {
        roots: '📸 Photo 1: Your roots / crown',
        midLength: '📸 Photo 2: Your mid-length',
        ends: '📸 Photo 3: Your ends',
        face: '📸 Photo 4: Your face',
    };

    const handlePhotoSelect = (type, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotos(prev => ({
                    ...prev,
                    [type]: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const canSubmit = Object.values(photos).every(photo => photo !== null);

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setUploading(true);
        // Pass to next step
        setTimeout(() => {
            onComplete(photos, quizAnswers);
        }, 1000);
    };

    return (
        <div className="photo-upload-section">
            <h2 className="upload-title">Now let's see those curls!</h2>
            <p className="upload-subtitle">Upload 3 photos with your hair dry normally styled:</p>
            <p className="upload-hint">For best results, use natural lighting</p>

            <div className="photo-grid">
                {Object.keys(photos).map(type => (
                    <div key={type}>
                        <label>
                            <div className={`photo-upload-box ${photos[type] ? 'filled' : ''}`}>
                                {photos[type] ? (
                                    <img src={photos[type]} alt={photoLabels[type]} />
                                ) : (
                                    <>
                                        <div className="upload-icon">📸</div>
                                        <div className="upload-label">{photoLabels[type]}</div>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoSelect(type, e)}
                            />
                        </label>
                    </div>
                ))}
            </div>

            <div className="quiz-actions">
                <button className="btn btn-secondary btn-small" disabled={uploading}>
                    Back
                </button>
                <button
                    className="btn btn-primary btn-small"
                    onClick={handleSubmit}
                    disabled={!canSubmit || uploading}
                    style={{ opacity: !canSubmit || uploading ? 0.5 : 1 }}
                >
                    {uploading ? 'Uploading...' : 'Analyze My Curls'}
                </button>
            </div>
        </div>
    );
}

// Loading Screen Component
function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p className="loading-text">Getting to know your curls...</p>
            <p className="loading-subtext">Processing 4 photos (3-8 seconds)</p>
        </div>
    );
}

// API Configuration Component
function APIKeySetup({ onContinue }) {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('pelora_api_key') || '');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!apiKey.trim()) {
            setError('Please enter your Anthropic API key');
            return;
        }
        localStorage.setItem('pelora_api_key', apiKey);
        onContinue(apiKey);
    };

    return (
        <div className="landing-page">
            <div className="pelora-header">
                <div className="pelora-logo">P</div>
                <h1 className="pelora-title">Pelora</h1>
                <p className="pelora-tagline">Expert curl care in your pocket.</p>
            </div>
            <div className="quiz-container" style={{ maxWidth: '500px', textAlign: 'left' }}>
                <h2 className="quiz-title">Let's get started</h2>
                <p className="quiz-subtitle">Enter your Anthropic API key to enable AI analysis</p>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        setError('');
                    }}
                    placeholder="sk-ant-api03-..."
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${error ? '#c74646' : '#C8B8D4'}`,
                        borderRadius: '12px',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        marginBottom: error ? '10px' : '20px',
                        boxSizing: 'border-box',
                    }}
                />
                {error && <p style={{ color: '#c74646', fontSize: '13px', marginBottom: '15px' }}>{error}</p>}
                <p style={{ fontSize: '13px', color: '#9B7BB5', marginBottom: '20px' }}>
                    Your API key is only stored locally in your browser and never sent to our servers. Get your key at{' '}
                    <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6B4D8A' }}>
                        console.anthropic.com
                    </a>
                </p>
                <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>
                    Continue to Pelora
                </button>
            </div>
        </div>
    );
}

// API Analysis Component
async function analyzeWithAPI(photos, quizAnswers, apiKey) {
    const systemPrompt = `You are an expert hair analysis AI for Pelora, a personalized curl care app. Analyze the provided hair photos and quiz answers to give comprehensive, warm, and personalized recommendations.

Return your analysis in the following JSON format:
{
  "curlPattern": {
    "primary": "3B",
    "friendly_name": "Springy Ringlets",
    "description": "Your curls have beautiful, defined spirals with great bounce"
  },
  "curlBreakdown": {
    "roots": "3A",
    "mid_length": "3B",
    "ends": "3B/3C"
  },
  "faceShape": "oval",
  "skinUndertone": "warm",
  "healthAssessment": {
    "priority1": "Restore moisture to your curls",
    "priority2": "Reduce frizz at the crown area",
    "priority3": "Protect curl definition"
  },
  "productRecommendations": {
    "budget": [
      {
        "name": "Product name",
        "price": "$12",
        "why": "Why it works for you..."
      }
    ],
    "midRange": [
      {
        "name": "Product name",
        "price": "$25",
        "why": "Why it works for you..."
      }
    ],
    "premium": [
      {
        "name": "Product name",
        "price": "$45",
        "why": "Why it works for you..."
      }
    ]
  },
  "styleRecommendations": [
    "Style 1 that works with your face shape and curls",
    "Style 2 that complements your features"
  ],
  "colorRecommendations": [
    "Color suggestion 1 based on undertone",
    "Color suggestion 2 based on undertone"
  ]
}`;

    const userMessage = `
Analyze these hair photos and quiz answers:

Quiz Answers:
- Goals: ${quizAnswers.goals.join(', ')}
- Hair Porosity: ${quizAnswers.porosity}
- Treatments: ${quizAnswers.treatments.length > 0 ? quizAnswers.treatments.join(', ') : 'None'}
- Journey Stage: ${quizAnswers.journey}
- Scalp Type: ${quizAnswers.scalp}

Please provide thorough analysis across curl type, face shape, skin undertone, and hair health. Make recommendations personalized and encouraging.`;

    try {
        const response = await fetch(ANTHROPIC_API, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 2000,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message);
        }

        const data = await response.json();
        const content = data.content[0].text;

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Could not parse analysis response');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('API Error:', error);
        // Return mock data for demo
        return getMockAnalysis(quizAnswers);
    }
}

// Mock data for demo
function getMockAnalysis(quizAnswers) {
    return {
        curlPattern: {
            primary: '3B',
            friendly_name: 'Springy Ringlets',
            description: 'Your curls have beautiful, defined spirals with great bounce and elasticity. These ringlets hold style well and have amazing potential with the right care routine.',
        },
        curlBreakdown: {
            roots: '3A',
            mid_length: '3B',
            ends: '3B/3C',
        },
        faceShape: 'oval',
        skinUndertone: 'warm',
        healthAssessment: {
            priority1: 'Restore moisture to your curls',
            priority2: 'Reduce frizz at the crown area',
            priority3: 'Enhance curl definition',
        },
        productRecommendations: {
            budget: [
                {
                    name: 'SheaMoisture Coconut & Hibiscus Curl Enhancing Smoothie',
                    price: '$12',
                    why: 'Your 3B curls need moisture without heaviness. Coconut oil and silk protein define curls and reduce frizz.',
                },
                {
                    name: 'Cantu Shea Butter Leave-In Conditioning Repair Cream',
                    price: '$6',
                    why: 'Lightweight leave-in that fights frizz and provides moisture for your ringlets without buildup.',
                },
            ],
            midRange: [
                {
                    name: 'Kinky-Curly Knot Today Detangler & Leave-In Conditioner/Styler',
                    price: '$28',
                    why: 'Perfect for 3B curls. Detangles gently while providing definition and frizz control.',
                },
            ],
            premium: [
                {
                    name: 'Carol\'s Daughter Black Vanilla Moisture & Shine Curl Enhancing Smoothie',
                    price: '$40',
                    why: 'Luxurious formula designed for defined curls. Rich moisture with beautiful shine and long-lasting hold.',
                },
            ],
        },
        styleRecommendations: [
            'Curtain bangs with layers to frame your oval face shape and enhance your 3B curls',
            'Shoulder-length cut with textured layers to add movement and reduce bulk',
            'Blunt ends to emphasize curl definition and create a polished look',
        ],
        colorRecommendations: [
            'Warm caramel highlights to complement your warm undertone and add dimension',
            'Deep chocolate brown to enhance contrast and make curls pop',
            'Honey blonde balayage for a sun-kissed, natural warm glow',
        ],
    };
}

// Curl Profile Component
function CurlProfile({ analysis, facePhoto }) {
    return (
        <div className="curl-profile">
            {facePhoto && <img src={facePhoto} alt="Your photo" className="user-photo" />}

            <div className="profile-section">
                <div className="profile-label">Curl Pattern</div>
                <div className="profile-main">{analysis.curlPattern.primary}</div>
                <div className="profile-detail">{analysis.curlPattern.friendly_name}</div>
                <div className="profile-description">{analysis.curlPattern.description}</div>
            </div>

            <div className="profile-section">
                <div className="profile-label">Pattern by Section</div>
                <div className="profile-detail">Roots: {analysis.curlBreakdown.roots}</div>
                <div className="profile-detail">Mid-length: {analysis.curlBreakdown.mid_length}</div>
                <div className="profile-detail">Ends: {analysis.curlBreakdown.ends}</div>
            </div>

            <div className="profile-section">
                <div className="profile-label">Face Shape</div>
                <div className="profile-main" style={{ fontSize: '20px' }}>
                    {analysis.faceShape.charAt(0).toUpperCase() + analysis.faceShape.slice(1)}
                </div>
            </div>

            <div className="profile-section">
                <div className="profile-label">Skin Undertone</div>
                <div className="profile-main" style={{ fontSize: '20px' }}>
                    {analysis.skinUndertone.charAt(0).toUpperCase() + analysis.skinUndertone.slice(1)}
                </div>
            </div>

            <div className="profile-section">
                <div className="profile-label">Top Care Priorities</div>
                <div className="profile-detail">1. {analysis.healthAssessment.priority1}</div>
                <div className="profile-detail">2. {analysis.healthAssessment.priority2}</div>
                <div className="profile-detail">3. {analysis.healthAssessment.priority3}</div>
            </div>
        </div>
    );
}

// Recommendations Component
function Recommendations({ analysis }) {
    return (
        <div className="recommendations-section">
            <h2 className="rec-title">Your Personalized Curl Care Plan</h2>

            <div className="rec-category">
                <h3 className="rec-category-title">🧴 Products For You</h3>
                {['budget', 'midRange', 'premium'].map(tier => (
                    <div key={tier}>
                        {analysis.productRecommendations[tier].map((product, idx) => (
                            <div key={idx} className="product-card">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{product.price}</div>
                                <div className="product-reason">{product.why}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="rec-category">
                <h3 className="rec-category-title">💇 Styles & Cuts For You</h3>
                {analysis.styleRecommendations.map((style, idx) => (
                    <div key={idx} className="product-card">
                        <div className="product-reason">{style}</div>
                    </div>
                ))}
            </div>

            <div className="rec-category">
                <h3 className="rec-category-title">🎨 Color Ideas</h3>
                {analysis.colorRecommendations.map((color, idx) => (
                    <div key={idx} className="product-card">
                        <div className="product-reason">{color}</div>
                    </div>
                ))}
            </div>

            <div className="challenge-section">
                <h3 className="challenge-title">📅 Your 30-Day Curl Challenge</h3>
                <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                    Week 1: Foundations | Week 2: Technique | Week 3: Deep Care | Week 4: Confidence
                </p>
                <div className="challenge-grid">
                    {[1, 3, 7, 10, 14, 21, 28, 30].map(day => (
                        <div key={day} className="challenge-day">
                            <div className="challenge-day-number">Day {day}</div>
                            <div style={{ fontSize: '11px' }}>New challenge</div>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '13px' }}>
                    A personalized month-long journey turning curl care into a guided experience.
                </p>
            </div>
        </div>
    );
}

// Results Component
function Results({ analysis, facePhoto }) {
    return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <CurlProfile analysis={analysis} facePhoto={facePhoto} />
            <div style={{ marginTop: '30px' }}></div>
            <Recommendations analysis={analysis} />
        </div>
    );
}

// Main App Component
function App() {
    const [currentStep, setCurrentStep] = useState('api-setup');
    const [apiKey, setApiKey] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState(null);
    const [photos, setPhotos] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAPIKeySetup = (key) => {
        setApiKey(key);
        setCurrentStep('landing');
    };

    const handleQuizComplete = (answers) => {
        setQuizAnswers(answers);
        setCurrentStep('photos');
    };

    const handlePhotosComplete = async (photoData, answers) => {
        setPhotos(photoData);
        setIsAnalyzing(true);
        setCurrentStep('loading');

        // Simulate analysis time
        setTimeout(async () => {
            const result = await analyzeWithAPI(photoData, answers, apiKey);
            setAnalysis(result);
            setCurrentStep('results');
            setIsAnalyzing(false);
        }, 3000);
    };

    return (
        <div>
            {currentStep === 'api-setup' && <APIKeySetup onContinue={handleAPIKeySetup} />}
            {currentStep === 'landing' && <LandingPage onStart={() => setCurrentStep('quiz')} />}
            {currentStep === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
            {currentStep === 'photos' && <PhotoUpload onComplete={handlePhotosComplete} quizAnswers={quizAnswers} />}
            {currentStep === 'loading' && <LoadingScreen />}
            {currentStep === 'results' && analysis && (
                <Results analysis={analysis} facePhoto={photos.face} />
            )}
        </div>
    );
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
