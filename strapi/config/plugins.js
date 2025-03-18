// Strapi Backend Configuration
// config/plugins.js
module.exports = ({ env }) => ({
  // ...
  'users-permissions': {
    config: {
      providers: {
        google: {
          enabled: true,
          icon: 'google',
          key: env('112296741986-89e0pq0c0cat277c7bg1g6csnbgl0sq5.apps.googleusercontent.com'),
          secret: env('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'),
          callback: `${env('STRAPI_URL', 'http://localhost:1337')}/api/connect/google/callback`,
          redirectUri: "http://localhost:1337/api/connect/google/callback",
          scope: ["email", "profile"],
          // Optional: Redirect to React after auth
          successRedirect: "http://localhost:5173/dashboard",
          errorRedirect: "http://localhost:1337/api/connect/google/callback",
        },
      },
    },
  },
});