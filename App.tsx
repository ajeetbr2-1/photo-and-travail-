/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateDecadeImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import { createAlbumPage } from './lib/albumUtils';
import Footer from './components/Footer';

const GHOST_POLAROIDS_CONFIG = [
  { initial: { x: "-150%", y: "-100%", rotate: -30 }, transition: { delay: 0.2 } },
  { initial: { x: "150%", y: "-80%", rotate: 25 }, transition: { delay: 0.4 } },
  { initial: { x: "-120%", y: "120%", rotate: 45 }, transition: { delay: 0.6 } },
  { initial: { x: "180%", y: "90%", rotate: -20 }, transition: { delay: 0.8 } },
  { initial: { x: "0%", y: "-200%", rotate: 0 }, transition: { delay: 0.5 } },
  { initial: { x: "100%", y: "150%", rotate: 10 }, transition: { delay: 0.3 } },
];

// Emotional portrait configurations
const EMOTIONS_CONFIG = [
  { emotion: "Confidence", angle: "front view", title: "Best AI In The World – 2025" },
  { emotion: "Visionary / Genius mode", angle: "slight side angle", title: "Designed To Lead" },
  { emotion: "Focus & Determination", angle: "front view, intense gaze", title: "Vision Beyond Limits" },
  { emotion: "Calm / Leader / Elite personality", angle: "front view", title: "Elite Mindset" },
  { emotion: "Confidence", angle: "low-angle power shot", title: "Unstoppable Force" },
  { emotion: "Visionary / Genius mode", angle: "profile view", title: "Future Architect" },
  { emotion: "Focus & Determination", angle: "three-quarter angle", title: "Relentless Focus" },
  { emotion: "Calm / Leader / Elite personality", angle: "front view, relaxed", title: "Born To Inspire" },
  { emotion: "Confidence", angle: "slight angle from below", title: "Game Changer" },
  { emotion: "Visionary / Genius mode", angle: "front view", title: "Innovation Personified" },
  { emotion: "Focus & Determination", angle: "side profile", title: "Driven By Purpose" },
  { emotion: "Calm / Leader / Elite personality", angle: "front view, powerful", title: "Leadership Redefined" },
  { emotion: "Confidence", angle: "direct front, commanding", title: "Success Embodied" },
  { emotion: "Visionary / Genius mode", angle: "side angle", title: "Thinking Ahead" },
  { emotion: "Focus & Determination", angle: "front view", title: "Precision & Power" },
  { emotion: "Calm / Leader / Elite personality", angle: "slight side view", title: "Elegant Authority" },
  { emotion: "Confidence", angle: "front view", title: "Breaking Barriers" },
  { emotion: "Visionary / Genius mode", angle: "low angle", title: "Strategic Genius" },
  { emotion: "Focus & Determination", angle: "front view, intense", title: "Laser Focused" },
  { emotion: "Calm / Leader / Elite personality", angle: "front view", title: "Timeless Excellence" },
  { emotion: "Confidence", angle: "three-quarter view", title: "Fearless Leader" },
  { emotion: "Visionary / Genius mode", angle: "front view", title: "Next Generation" },
  { emotion: "Focus & Determination", angle: "profile", title: "Mission Driven" },
  { emotion: "Calm / Leader / Elite personality", angle: "front view", title: "Pure Excellence" },
  { emotion: "Confidence", angle: "front view", title: "Champion Mentality" },
  { emotion: "Visionary / Genius mode", angle: "side view", title: "Revolutionary Mind" },
  { emotion: "Focus & Determination", angle: "front view", title: "Achieving Greatness" },
  { emotion: "Calm / Leader / Elite personality", angle: "front view", title: "Influential Power" },
  { emotion: "Confidence", angle: "slight angle", title: "Limitless Potential" },
  { emotion: "Visionary / Genius mode", angle: "front view", title: "Mastermind" },
];


type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
    title?: string;
    emotion?: string;
}

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-yellow-400";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black";
const inputClasses = "w-full bg-white/10 border-2 border-white/80 rounded-sm p-2 text-center font-permanent-marker text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400";


const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

// Generates random positions for a scattered look on desktop
const generatePositions = (count: number) => {
    return Array.from({ length: count }, () => ({
        top: `${5 + Math.random() * 50}%`,
        left: `${10 + Math.random() * 70}%`, // Avoid edges
        rotate: Math.random() * 24 - 12, // Random rotation between -12 and 12 deg
    }));
};

function App() {
    const [userApiKey, setUserApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image-preview');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    // State for emotional portraits
    const [numPortraits, setNumPortraits] = useState('20');
    const [portraitConfigs, setPortraitConfigs] = useState<typeof EMOTIONS_CONFIG>([]);
    const [cardPositions, setCardPositions] = useState<{top: string, left: string, rotate: number}[]>([]);

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini-api-key');
        if (savedKey) {
            setUserApiKey(savedKey);
        }
    }, []);

    const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value;
        setUserApiKey(key);
        localStorage.setItem('gemini-api-key', key);
    };


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({}); // Clear previous results
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage || !userApiKey) return;

        const numImages = parseInt(numPortraits, 10);
    
        if (isNaN(numImages) || numImages < 15 || numImages > 30) {
            alert("Please enter a valid number of portraits (between 15 and 30).");
            return;
        }
    
        // Select portraits from the config
        const selectedConfigs = EMOTIONS_CONFIG.slice(0, numImages);
        setPortraitConfigs(selectedConfigs);
        setCardPositions(generatePositions(selectedConfigs.length));

        setIsLoading(true);
        setAppState('generating');
        
        const initialImages: Record<string, GeneratedImage> = {};
        selectedConfigs.forEach((config, index) => {
            const key = `portrait-${index}`;
            initialImages[key] = { status: 'pending', title: config.title, emotion: config.emotion };
        });
        setGeneratedImages(initialImages);

        const concurrencyLimit = 2; // Process two at a time
        const portraitsQueue = selectedConfigs.map((config, index) => ({ config, index }));

        const processPortrait = async (item: { config: typeof EMOTIONS_CONFIG[0], index: number }) => {
            const key = `portrait-${item.index}`;
            try {
                const prompt = `You are an expert AI Art Director with 40+ years of experience in commercial photography, cinematic lighting, portrait aesthetics, and emotional storytelling.

Create an ultra-realistic, premium quality (8K + DSLR Depth) portrait photograph of the person in this image with the following specifications:

EMOTION: ${item.config.emotion}
ANGLE: ${item.config.angle}

STYLE REQUIREMENTS:
- Ultra-realistic, premium quality with professional DSLR depth of field
- Cinematic lighting with dramatic contrast and sharp details
- Glossy, perfect skin texture (no smoothing blur)
- Futuristic / Elite / Super-premium feel
- Professional color grading with film look
- Add depth, highlights, and rim light on hair and face
- Minimal, cinematic or blurred bokeh background

EXPRESSION: The person should display ${item.config.emotion} with subtle, natural expressions (not exaggerated). Their face should clearly show this emotion through their eyes, jawline, and overall demeanor.

CRITICAL: Maintain 100% facial identity consistency. The person must be instantly recognizable as the same individual from the uploaded photo. Keep exact face structure, eyes, jawline, hairstyle, and skin texture.

OUTPUT: A photorealistic portrait in 4:5 aspect ratio (portrait format, perfect for Instagram/Facebook) showing the person clearly with the specified emotion and angle.`;
                
                const resultUrl = await generateDecadeImage(uploadedImage, prompt, userApiKey, selectedModel);
                setGeneratedImages(prev => ({
                    ...prev,
                    [key]: { status: 'done', url: resultUrl, title: item.config.title, emotion: item.config.emotion },
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                setGeneratedImages(prev => ({
                    ...prev,
                    [key]: { status: 'error', error: errorMessage, title: item.config.title, emotion: item.config.emotion },
                }));
                console.error(`Failed to generate portrait ${key}:`, err);
            }
        };

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (portraitsQueue.length > 0) {
                const item = portraitsQueue.shift();
                if (item) {
                    await processPortrait(item);
                }
            }
        });

        await Promise.all(workers);

        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerateDecade = async (key: string) => {
        if (!uploadedImage || !userApiKey) return;

        if (generatedImages[key]?.status === 'pending') return;
        
        console.log(`Regenerating portrait ${key}...`);

        // Find the config for this portrait
        const index = parseInt(key.replace('portrait-', ''));
        const config = portraitConfigs[index];
        if (!config) return;

        setGeneratedImages(prev => ({ ...prev, [key]: { status: 'pending', title: config.title, emotion: config.emotion } }));

        try {
            const prompt = `You are an expert AI Art Director with 40+ years of experience in commercial photography, cinematic lighting, portrait aesthetics, and emotional storytelling.

Create an ultra-realistic, premium quality (8K + DSLR Depth) portrait photograph of the person in this image with the following specifications:

EMOTION: ${config.emotion}
ANGLE: ${config.angle}

STYLE REQUIREMENTS:
- Ultra-realistic, premium quality with professional DSLR depth of field
- Cinematic lighting with dramatic contrast and sharp details
- Glossy, perfect skin texture (no smoothing blur)
- Futuristic / Elite / Super-premium feel
- Professional color grading with film look
- Add depth, highlights, and rim light on hair and face
- Minimal, cinematic or blurred bokeh background

EXPRESSION: The person should display ${config.emotion} with subtle, natural expressions (not exaggerated). Their face should clearly show this emotion through their eyes, jawline, and overall demeanor.

CRITICAL: Maintain 100% facial identity consistency. The person must be instantly recognizable as the same individual from the uploaded photo. Keep exact face structure, eyes, jawline, hairstyle, and skin texture.

OUTPUT: A photorealistic portrait in 4:5 aspect ratio (portrait format, perfect for Instagram/Facebook) showing the person clearly with the specified emotion and angle.`;
            
            const resultUrl = await generateDecadeImage(uploadedImage, prompt, userApiKey, selectedModel);
            setGeneratedImages(prev => ({
                ...prev,
                [key]: { status: 'done', url: resultUrl, title: config.title, emotion: config.emotion },
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setGeneratedImages(prev => ({
                ...prev,
                [key]: { status: 'error', error: errorMessage, title: config.title, emotion: config.emotion },
            }));
            console.error(`Failed to regenerate portrait ${key}:`, err);
        }
    };
    
    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImages({});
        setAppState('idle');
    };

    const handleDownloadIndividualImage = (key: string) => {
        const image = generatedImages[key];
        if (image?.status === 'done' && image.url) {
            const link = document.createElement('a');
            link.href = image.url;
            link.download = `emotional-portrait-${key}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDownloadAlbum = async () => {
        setIsDownloading(true);
        try {
            const imageData = Object.entries(generatedImages)
                .filter(([, image]) => image.status === 'done' && image.url)
                .reduce((acc, [key, image]) => {
                    acc[image!.title || key] = image!.url!;
                    return acc;
                }, {} as Record<string, string>);

            if (Object.keys(imageData).length < portraitConfigs.length) {
                alert("Please wait for all images to finish generating before downloading the album.");
                return;
            }

            const albumDataUrl = await createAlbumPage(imageData);

            const link = document.createElement('a');
            link.href = albumDataUrl;
            link.download = 'emotional-portraits-album.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to create or download album:", error);
            alert("Sorry, there was an error creating your album. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };
    
    const rangeInputClasses = "w-32 bg-white/10 border-2 border-white/80 rounded-sm p-2 text-center font-permanent-marker text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

    return (
        <main className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]"></div>
            
            <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
                <div className="text-center mb-8">
                    <h1 className="text-6xl md:text-8xl font-caveat font-bold text-neutral-100">AI Art Director</h1>
                    <p className="font-permanent-marker text-neutral-300 mt-2 text-xl tracking-wide">Generate ultra-realistic emotional portraits.</p>
                </div>
                
                 {/* Configuration Section */}
                <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-6 mb-8 flex flex-col gap-4 text-white shadow-lg">
                    <h2 className="font-permanent-marker text-2xl text-center text-yellow-400 mb-2">Configuration</h2>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="api-key" className="font-permanent-marker text-lg text-neutral-300">Gemini API Key</label>
                        <input
                            id="api-key"
                            type="password"
                            value={userApiKey}
                            onChange={handleApiKeyChange}
                            placeholder="Enter your API Key here"
                            className={inputClasses}
                        />
                    </div>
                     <div className="flex flex-col gap-2">
                        <label htmlFor="model-select" className="font-permanent-marker text-lg text-neutral-300">AI Model</label>
                        <select
                            id="model-select"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className={`${inputClasses} cursor-pointer`}
                        >
                            <option value="gemini-2.5-flash-image-preview">gemini-2.5-flash-image-preview (Edit)</option>
                            <option value="gemini-2.5-flash">gemini-2.5-flash (General)</option>
                        </select>
                    </div>
                </div>


                {appState === 'idle' && (
                     <div className="relative flex flex-col items-center justify-center w-full">
                        {GHOST_POLAROIDS_CONFIG.map((config, index) => (
                             <motion.div
                                key={index}
                                className="absolute w-80 h-[26rem] rounded-md p-4 bg-neutral-100/10 blur-sm"
                                initial={config.initial}
                                animate={{
                                    x: "0%", y: "0%", rotate: (Math.random() - 0.5) * 20,
                                    scale: 0,
                                    opacity: 0,
                                }}
                                transition={{
                                    ...config.transition,
                                    ease: "circOut",
                                    duration: 2,
                                }}
                            />
                        ))}
                        <motion.div
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: 2, duration: 0.8, type: 'spring' }}
                             className="flex flex-col items-center"
                        >
                            <label htmlFor="file-upload" className={`cursor-pointer group transform hover:scale-105 transition-transform duration-300 ${!userApiKey && 'cursor-not-allowed opacity-60'}`}>
                                 <PolaroidCard 
                                     caption={!userApiKey ? "API Key Required" : "Click to begin"}
                                     status="done"
                                 />
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} disabled={!userApiKey} />
                            <p className="mt-8 font-permanent-marker text-neutral-500 text-center max-w-xs text-lg">
                                 {userApiKey ? 'Click the polaroid to upload your photo and generate cinematic emotional portraits.' : 'Please enter your Gemini API Key above to begin.'}
                            </p>
                        </motion.div>
                    </div>
                )}

                {appState === 'image-uploaded' && uploadedImage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                         <PolaroidCard 
                            imageUrl={uploadedImage} 
                            caption="Your Photo" 
                            status="done"
                         />

                        <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-6 my-4 flex flex-col items-center justify-center gap-6 text-white shadow-lg">
                            <div className="flex flex-col items-center">
                                <label htmlFor="num-portraits" className="font-permanent-marker text-lg text-neutral-300 mb-2">Number of Portraits</label>
                                <input 
                                    id="num-portraits" 
                                    type="number" 
                                    min="15" 
                                    max="30" 
                                    value={numPortraits} 
                                    onChange={(e) => setNumPortraits(e.target.value)} 
                                    className={rangeInputClasses}
                                />
                                <p className="mt-2 text-sm text-neutral-400 font-permanent-marker">Generate 15-30 emotional portrait variations</p>
                            </div>
                        </div>

                         <div className="flex items-center gap-4">
                            <button onClick={handleReset} className={secondaryButtonClasses}>
                                Different Photo
                            </button>
                            <button onClick={handleGenerateClick} className={primaryButtonClasses} disabled={isLoading || !userApiKey}>
                                {isLoading ? "Generating..." : "Generate"}
                            </button>
                         </div>
                    </motion.div>
                )}

                {(appState === 'generating' || appState === 'results-shown') && (
                     <>
                        {isMobile ? (
                            <div className="w-full max-w-sm flex-1 overflow-y-auto mt-4 space-y-8 p-4">
                                {Object.keys(generatedImages).map((key) => (
                                    <div key={key} className="flex justify-center">
                                         <PolaroidCard
                                            caption={generatedImages[key]?.title || key}
                                            status={generatedImages[key]?.status || 'pending'}
                                            imageUrl={generatedImages[key]?.url}
                                            error={generatedImages[key]?.error}
                                            onShake={handleRegenerateDecade}
                                            onDownload={handleDownloadIndividualImage}
                                            isMobile={isMobile}
                                            showTitleOverlay={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div ref={dragAreaRef} className="relative w-full max-w-5xl h-[600px] mt-4">
                                {Object.keys(generatedImages).map((key, index) => {
                                    const { top, left, rotate } = cardPositions[index] || { top: '50%', left: '50%', rotate: 0 };
                                    return (
                                        <motion.div
                                            key={key}
                                            drag
                                            dragConstraints={dragAreaRef}
                                            dragMomentum={false}
                                            className="absolute cursor-grab active:cursor-grabbing"
                                            style={{ top, left }}
                                            initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 0 }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: 1, 
                                                y: 0,
                                                rotate: `${rotate}deg`,
                                            }}
                                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.15 }}
                                        >
                                            <PolaroidCard 
                                                dragConstraintsRef={dragAreaRef}
                                                caption={generatedImages[key]?.title || key}
                                                status={generatedImages[key]?.status || 'pending'}
                                                imageUrl={generatedImages[key]?.url}
                                                error={generatedImages[key]?.error}
                                                onShake={handleRegenerateDecade}
                                                onDownload={handleDownloadIndividualImage}
                                                isMobile={isMobile}
                                                showTitleOverlay={true}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                         <div className="h-20 mt-4 flex items-center justify-center">
                            {appState === 'results-shown' && (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <button 
                                        onClick={handleDownloadAlbum} 
                                        disabled={isDownloading} 
                                        className={`${primaryButtonClasses}`}
                                    >
                                        {isDownloading ? 'Creating Album...' : 'Download Album'}
                                    </button>
                                    <button onClick={handleReset} className={secondaryButtonClasses}>
                                        Start Over
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default App;