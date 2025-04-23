'use strict';

const { sanitize } = require('@strapi/utils');
const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
  async register(ctx) {
    try {
      const { email, username, password, firstname, lastname, gender } = ctx.request.body;

      if (!email || !username || !password) {
        throw new ApplicationError('Missing required fields');
      }

      const pluginStore = strapi.store({
        type: 'plugin',
        name: 'users-permissions',
      });

      const settings = await pluginStore.get({ key: 'advanced' });

      const role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: settings.default_role } });

      const newUser = {
        email: email.toLowerCase(),
        username,
        password,
        role: role.id,
        firstname,
        lastname,
        gender,
      };

      const user = await strapi
        .query('plugin::users-permissions.user')
        .create({ data: newUser });

      const sanitizedUser = await sanitize.contentAPI.output(
        user,
        strapi.getModel('plugin::users-permissions.user')
      );

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizedUser,
      });
    } catch (err) {
      console.error('Register error:', err);
      ctx.send({
        error: 'Registration failed',
        details: err.message,
      }, 500);
    }
  },
};