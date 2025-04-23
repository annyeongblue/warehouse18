'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::borrow-detail.borrow-detail', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching borrow-detail with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::borrow-detail.borrow-detail', id);
    if (!entry) {
      return ctx.notFound('Borrow-detail not found');
    }
    return entry;
  },
}));