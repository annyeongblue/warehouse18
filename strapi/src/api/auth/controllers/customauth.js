'use strict';

const { sanitize } = require('@strapi/utils');
const axios = require('axios');

module.exports = {
  async googleToken(ctx) {
    const { access_token } = ctx.request.body;

    if (!access_token) {
      return ctx.badRequest('No access token provided');
    }

    try {
      // Verify the Google token
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`
      );
      const googleUser = googleResponse.data;

      // Find or create the user in Strapi
      const [user] = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { email: googleUser.email },
      });

      let strapiUser;
      if (!user) {
        strapiUser = await strapi.entityService.create('plugin::users-permissions.user', {
          data: {
            username: googleUser.email.split('@')[0],
            email: googleUser.email,
            provider: 'google',
            confirmed: true,
            role: 1, // Adjust role ID as needed
          },
        });
      } else {
        strapiUser = user;
      }

      // Generate JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: strapiUser.id,
      });

      return ctx.send({ jwt, user: sanitize.contentAPI.output(strapiUser) });
    } catch (error) {
      return ctx.badRequest('Invalid Google token', error);
    }
  },
};