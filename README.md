# Kisan Drishti - AI Krishi Mitra

A modern, responsive React frontend application for an AI-powered agricultural assistant platform.

## Features

- **Landing Page**: Beautiful hero section with crop field background
- **Chatbot Page**: Interactive AI chat interface with Hindi/English language support
- **Simulation Page**: Editable parameter table for crop simulation with range validation
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop devices
- **Multilingual Support**: English and Hindi language switching

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- React Router DOM
- Axios

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

The application is configured to connect to backend APIs. Update the API endpoints in:

- **Chatbot**: `src/pages/Chatbot.jsx` - Line with `axios.post('http://localhost:8000/api/chatbot', ...)`
- **Simulation**: `src/pages/Simulation.jsx` - Line with `axios.post('http://localhost:8000/api/simulation', ...)`

### API Endpoints Expected

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

2. **POST /api/simulation**
   - Request Body:
     ```json
     {
       "parameters": {
         "temperature": 25,
         "humidity": 60,
         "soil_ph": 6.5,
         "nitrogen": 100,
         "phosphorus": 50,
         "potassium": 75,
         "rainfall": 800,
         "irrigation": 400
       },
       "language": "en" | "hi"
     }
     ```
   - Response:
     ```json
     {
       "result": "simulation results"
     }
     ```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar component
│   │   └── AboutModal.jsx      # About modal popup
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Chatbot.jsx         # Chatbot page
│   │   └── Simulation.jsx      # Simulation page
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
- `kisan-green`: Primary green color
- `kisan-dark-green`: Dark green for headers
- `kisan-darker-green`: Darker green variant

### Simulation Parameters
Edit the `parameters` array in `src/pages/Simulation.jsx` to add, remove, or modify simulation parameters.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is developed for Infyra Innovations LLP.

