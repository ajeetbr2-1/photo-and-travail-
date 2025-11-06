# API Documentation / API दस्तावेज़ीकरण

## Overview / सारांश

This application uses Google's Gemini AI API to generate ultra-realistic emotional portrait variations.

यह एप्लिकेशन अल्ट्रा-रियलिस्टिक इमोशनल पोर्ट्रेट वेरिएशन बनाने के लिए Google की Gemini AI API का उपयोग करता है।

---

## API Service Used / उपयोग की गई API सेवा

### **Google Gemini AI API**

**Package**: `@google/genai` (version 1.14.0)

**Service File**: `services/geminiService.ts`

**Purpose**: Generates AI-powered image transformations with text prompts

**उद्देश्य**: टेक्स्ट प्रॉम्प्ट के साथ AI-संचालित इमेज ट्रांसफॉर्मेशन बनाता है

---

## Available AI Models / उपलब्ध AI मॉडल

The application supports two Gemini models that you can select:

एप्लिकेशन दो Gemini मॉडल्स को सपोर्ट करता है जिन्हें आप चुन सकते हैं:

### 1. **gemini-2.5-flash-image-preview** (Default / डिफ़ॉल्ट)
   - **Type**: Image Editing Model
   - **Best for**: Transforming and editing existing photos
   - **Features**: 
     - High-quality image generation
     - Fast processing speed
     - Optimized for portrait transformations
   - **उपयोग**: फोटो को एडिट और ट्रांसफॉर्म करने के लिए

### 2. **gemini-2.5-flash** 
   - **Type**: General Purpose Model
   - **Best for**: Text and general content generation
   - **Features**:
     - Versatile across different tasks
     - Good for complex prompts
     - Balanced performance
   - **उपयोग**: सामान्य उद्देश्य के लिए

---

## How to Get API Key / API Key कैसे प्राप्त करें

### Step 1: Visit Google AI Studio
**URL**: https://aistudio.google.com/

### Step 2: Sign in
- Sign in with your Google account
- अपने Google अकाउंट से साइन इन करें

### Step 3: Create API Key
1. Click on "Get API Key" button
2. Select or create a Google Cloud project
3. Click "Create API Key"
4. Copy the generated API key

**हिंदी में**:
1. "Get API Key" बटन पर क्लिक करें
2. Google Cloud प्रोजेक्ट चुनें या बनाएं
3. "Create API Key" पर क्लिक करें
4. जनरेट की गई API key को कॉपी करें

### Step 4: Use in Application
- Paste the API key in the "Gemini API Key" field in the app
- The key is stored locally in your browser for convenience
- एप में "Gemini API Key" फील्ड में API key पेस्ट करें

---

## Configuration Options / कॉन्फ़िगरेशन विकल्प

### In the Application UI / एप्लिकेशन UI में:

1. **Gemini API Key** (Required / आवश्यक)
   - Your personal API key from Google AI Studio
   - Stored locally in browser's localStorage
   - Google AI Studio से आपकी व्यक्तिगत API key

2. **AI Model Selection** (Optional / वैकल्पिक)
   - Choose between two Gemini models
   - Default: `gemini-2.5-flash-image-preview`
   - दो Gemini मॉडल में से चुनें

3. **Number of Portraits** (15-30)
   - Controls how many emotional variations to generate
   - Default: 20 portraits
   - कितने इमोशनल वेरिएशन बनाने हैं यह नियंत्रित करता है

---

## API Integration Details / API एकीकरण विवरण

### Code Location / कोड स्थान:
- **Service**: `services/geminiService.ts`
- **Main App**: `App.tsx`
- **Component**: `components/PolaroidCard.tsx`

### Key Functions / मुख्य फंक्शन:

#### 1. `generateDecadeImage()` 
**File**: `services/geminiService.ts`

**Parameters**:
- `imageDataUrl`: Base64 encoded image
- `prompt`: Text prompt for AI generation
- `apiKey`: Your Gemini API key
- `model`: Selected AI model name

**Returns**: Base64 encoded generated image

**Features**:
- Automatic retry mechanism (3 attempts)
- Fallback prompt system
- Error handling

---

## Emotional Portrait Configuration / इमोशनल पोर्ट्रेट कॉन्फ़िगरेशन

The app comes pre-configured with 30 emotion/angle/title combinations:

एप 30 इमोशन/एंगल/टाइटल कॉम्बिनेशन के साथ पहले से कॉन्फ़िगर है:

### Emotions / इमोशन्स:
1. **Confidence** / आत्मविश्वास
2. **Visionary / Genius mode** / दूरदर्शी / जीनियस मोड
3. **Focus & Determination** / फोकस और दृढ़ संकल्प
4. **Calm / Leader / Elite personality** / शांत / नेता / एलीट व्यक्तित्व

### Angles / कोण:
- Front view / सामने का दृश्य
- Side angle / साइड एंगल
- Low-angle power shot / नीचे से पावर शॉट
- Profile view / प्रोफाइल व्यू
- Three-quarter angle / तीन-चौथाई कोण

### Sample Titles / नमूना टाइटल:
- "Best AI In The World – 2025"
- "Designed To Lead"
- "Vision Beyond Limits"
- "Elite Mindset"
- (and 26 more)

---

## API Pricing / API मूल्य निर्धारण

**Note**: Google Gemini API has free tier and paid options

- **Free Tier**: Limited requests per minute
- **Paid Tier**: Higher rate limits and priority processing

**Visit**: https://ai.google.dev/pricing for current pricing

**नोट**: Google Gemini API में फ्री टियर और पेड ऑप्शन हैं

---

## Other Services / अन्य सेवाएं

### Frontend Libraries / फ्रंटएंड लाइब्रेरीज़:

1. **React 19.1.1** - UI framework
2. **Framer Motion 12.23.12** - Animations
3. **TailwindCSS** - Styling (via CDN)
4. **Vite 6.2.0** - Build tool

### No Additional APIs Required / कोई अतिरिक्त API की आवश्यकता नहीं

This application **only** uses Google Gemini AI API. No other external APIs are needed.

यह एप्लिकेशन **केवल** Google Gemini AI API का उपयोग करता है। कोई अन्य बाहरी API की आवश्यकता नहीं है।

---

## API Alternatives / API विकल्प

If you want to use different AI services, you would need to modify the code:

यदि आप विभिन्न AI सेवाओं का उपयोग करना चाहते हैं, तो आपको कोड को संशोधित करना होगा:

### Potential Alternatives:
1. **OpenAI DALL-E** - Image generation API
2. **Stability AI** - Stable Diffusion API
3. **Midjourney** - (API access limited)
4. **Replicate** - Multiple AI models API

**Note**: Switching to these would require code modifications in `services/geminiService.ts`

---

## Troubleshooting / समस्या निवारण

### Common Issues / सामान्य समस्याएं:

1. **"API Key is required"** / "API Key आवश्यक है"
   - Solution: Enter your Gemini API key in the configuration
   - समाधान: कॉन्फ़िगरेशन में अपनी Gemini API key दर्ज करें

2. **"Failed to generate image"** / "इमेज जनरेट करने में विफल"
   - Check your API key is valid
   - Ensure you have API quota remaining
   - Try the alternative model
   - अपनी API key मान्य है यह जांचें

3. **Rate Limit Exceeded** / रेट लिमिट पार हो गई
   - Wait a few minutes before trying again
   - Consider upgrading to paid tier
   - कुछ मिनट प्रतीक्षा करें

---

## Security / सुरक्षा

- API key is stored in browser's localStorage only
- Never shared with any third-party servers
- All API calls are direct to Google's servers
- API key केवल ब्राउज़र के localStorage में स्टोर है
- किसी तीसरे पक्ष के सर्वर के साथ कभी साझा नहीं किया जाता

---

## Support / समर्थन

For Google Gemini API support:
- Documentation: https://ai.google.dev/docs
- Community: https://github.com/google/generative-ai-js

For app-specific issues:
- Check the GitHub repository
- Create an issue with details

---

## Summary / सारांश

**Used API Service / उपयोग की गई API सेवा**: Google Gemini AI only

**API Models Available / उपलब्ध API मॉडल**: 
- gemini-2.5-flash-image-preview (Image editing)
- gemini-2.5-flash (General purpose)

**API Key Source / API Key स्रोत**: https://aistudio.google.com/

**Other External APIs / अन्य बाहरी API**: None (कोई नहीं)
