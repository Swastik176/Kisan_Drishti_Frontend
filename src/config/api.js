const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL || 'http://127.0.0.1:8000'
const CNN_API_BASE_URL = import.meta.env.VITE_CNN_API_BASE_URL || 'http://127.0.0.1:8001'
const CHATBOT_PATH = import.meta.env.VITE_CHATBOT_PATH || '/ask/chatbot'
const SENSOR_PREDICTION_PATH = import.meta.env.VITE_SENSOR_PREDICTION_PATH || '/predict'
const CNN_PREDICTION_PATH = import.meta.env.VITE_CNN_PREDICTION_PATH || '/cnn/predict'

export const API_BASE_URLS = {
  ML: ML_API_BASE_URL,
  CNN: CNN_API_BASE_URL,
}

export const API_ENDPOINTS = {
  CHATBOT: `${ML_API_BASE_URL}${CHATBOT_PATH}`,
  SENSOR_PREDICTION: `${ML_API_BASE_URL}${SENSOR_PREDICTION_PATH}`,
  CNN_PREDICTION: `${CNN_API_BASE_URL}${CNN_PREDICTION_PATH}`,
}

export default API_ENDPOINTS
