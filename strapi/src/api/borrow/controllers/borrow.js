'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::borrow.borrow', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching borrow with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::borrow.borrow', id);
    if (!entry) {
      return ctx.notFound('borrow not found');
    }
    return entry;
  },
}));