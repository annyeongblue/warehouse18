'use strict';

const { google } = require('googleapis');
const { parseMultipartData, sanitizeEntity } = require('@strapi/utils');

module.exports = {
  async google(ctx) {
    const { token } = ctx.request.body;

    try {
      const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the client ID
      });

      const payload = ticket.getPayload();
      
      // Check if user already exists in the Strapi database, or create a new one
      let user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: payload.email } });

      if (!user) {
        user = await strapi.query('plugin::users-permissions.user').create({
          data: {
            username: payload.name,
            email: payload.email,
            provider: 'google',
            confirmed: true,
          },
        });
      }

      // Create a JWT token for the user
      const jwt = strapi.plugin('users-permissions').services.jwt.issue({ id: user.id });

      // Return the user and JWT
      ctx.send({ jwt, user });
    } catch (err) {
      ctx.throw(400, 'Invalid Google token');
    }
  },
};
