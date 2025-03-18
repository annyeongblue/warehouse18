module.exports = [
  'strapi::logger', // Logs requests and errors
  'strapi::errors', // Error handling
  'strapi::security', // Security headers
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173'], // Allow requests from your React app
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
      headers: ['Content-Type', 'Authorization'], // Allowed headers
      credentials: true, // Allow cookies or auth headers to be sent
    },
  },
  'strapi::poweredBy', // Adds "Powered by Strapi" header
  'strapi::query', // Parses query strings
  'strapi::body', // Parses request bodies
  'strapi::session', // Session management
  'strapi::favicon', // Serves favicon
  'strapi::public', // Serves static files
];