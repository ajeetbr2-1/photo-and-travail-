<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Art Director - Emotional Portrait Generator

Generate ultra-realistic, cinematic emotional portraits with AI. This app analyzes your uploaded photos and creates 15-30 premium-quality variations showcasing different emotions, angles, and expressions with powerful titles.

View your app in AI Studio: https://ai.studio/apps/drive/1RD44NHdsKsm-H1rShVVAKpSaLajxmHYS

## API Services Used

This application uses **Google Gemini AI API** for image generation.

### Service Details:
- **Primary API**: Google Gemini AI (`@google/genai`)
- **Available Models**: 
  - `gemini-2.5-flash-image-preview` (Image Editing - Default)
  - `gemini-2.5-flash` (General Purpose)
- **API Key**: Get yours from [Google AI Studio](https://aistudio.google.com/)

📖 **[Complete API Documentation](./API_DOCUMENTATION.md)** - Detailed guide in English and Hindi (हिंदी में भी उपलब्ध)

## Features

✨ Generate 15-30 ultra-realistic emotional portraits  
🎭 Multiple emotions: Confidence, Visionary, Focus, Leadership  
📐 Various angles: Front, side, low-angle, profile views  
🎨 Cinematic lighting with 8K quality specifications  
📝 Copy blocks with titles, hashtags, and captions  
📱 Instagram/Facebook format (4:5 aspect ratio)  
💾 Individual and album download options

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
