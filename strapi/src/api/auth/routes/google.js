module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/auth/google',
        handler: 'google.google',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  