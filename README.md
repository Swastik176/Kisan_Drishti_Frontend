# Kisan Drishti - AI Krishi Mitra

A modern, responsive React frontend application for an AI-powered agricultural assistant platform developed by Infyra Innovations LLP.

## Features

- **Landing Page**: Beautiful hero section with crop field background
- **Chatbot Page**: Interactive AI chat interface with Hindi/English language support
- **Simulation Page**: Editable parameter table for crop simulation with ML and LLM predictions
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop devices
- **Multilingual Support**: English and Hindi language switching with persistent language preference
- **Infyra Innovations Logo**: Integrated company logo throughout the application

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM
- Axios
- React Context API (for language management)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Backend API Configuration

The application is configured to connect to backend APIs at `http://127.0.0.1:8000`. You can update the base URL in:

- **API Configuration**: `src/config/api.js` - Update `VITE_API_BASE_URL` environment variable or modify the default value

Alternatively, create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### API Endpoints

1. **POST /api/chatbot**
   - Request Body:
     ```json
     {
       "message": "user message",
       "language": "en" | "hi"
     }
     ```
   - Response:
     ```json
     {
       "response": "AI response text"
     }
     ```

2. **POST /local-ai/predict** (Crop Simulation)
   - Purpose: Predicts crop health condition using sensor data. Combines both local ML model and local LLM model.
   - Request Body:
     ```json
     {
       "soil_moisture": 18,
       "soil_temperature": 26,
       "air_temperature": 38,
       "humidity": 30,
       "rainfall": 0,
       "soil_ph": 8.1,
       "ec": 1.8,
       "nitrogen": 9,
       "phosphorus": 7,
       "potassium": 80,
       "leaf_wetness": 0.8,
       "ndvi": 0.3,
       "plant_color_index": 25
     }
     ```
   - Response:
     ```json
     {
       "local_ml_prediction": {
         "predicted_class": 1,
         "predicted_condition": "moderate",
         "confidence": 0.9538,
         "message": "⚠ Moderate conditions. Monitor farm environment."
       },
       "local_llm_explanation": {
         "condition": "moderate",
         "confidence": 0.9538,
         "problems_detected": [
           "soil_moisture is too LOW (18.0)",
           "air_temperature is too HIGH (38.0)"
         ],
         "ai_advice": [
           "Increase irrigation immediately.",
           "Use shade nets or irrigate in the early morning."
         ],
         "explanation": "Crop condition is predicted as 'MODERATE'..."
       }
     }
     ```

### Simulation Parameters

The simulation page includes 13 parameters:
- Soil Moisture (%)
- Soil Temperature (°C)
- Air Temperature (°C)
- Humidity (%)
- Rainfall (mm)
- Soil pH
- Electrical Conductivity (dS/m)
- Nitrogen (kg/ha)
- Phosphorus (kg/ha)
- Potassium (kg/ha)
- Leaf Wetness (0-1)
- NDVI (Normalized Difference Vegetation Index, 0-1)
- Plant Color Index (0-100)

## Project Structure

```
├── assets/
│   └── logo.jpg                # Infyra Innovations logo
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar component
│   │   ├── AboutModal.jsx      # About modal popup
│   │   └── Logo.jsx            # Logo component with Infyra Innovations branding
│   ├── config/
│   │   └── api.js              # API endpoint configuration
│   ├── context/
│   │   └── LanguageContext.jsx # Language context for persistent language state
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Chatbot.jsx         # Chatbot page
│   │   └── Simulation.jsx      # Simulation page with ML/LLM predictions
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- `kisan-green`: Primary green color (#22c55e)
- `kisan-dark-green`: Dark green for headers (#16a34a)
- `kisan-darker-green`: Darker green variant (#15803d)

### Logo
The Infyra Innovations logo is located at `assets/logo.jpg`. Update the Logo component in `src/components/Logo.jsx` if you need to change the logo path or styling.

### Language Support
Language preference is stored in `localStorage` and persists across page reloads. Default language is English. The language context is managed in `src/context/LanguageContext.jsx`.

### Simulation Parameters
Edit the `parameters` array in `src/pages/Simulation.jsx` to add, remove, or modify simulation parameters. Currently configured with 13 parameters matching the backend API requirements.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is developed for Infyra Innovations LLP.

