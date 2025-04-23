'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::repair-detail.repair-detail', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching repair-detail with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::repair-detail.repair-detail', id, ctx.query);
    if (!entry) {
      return ctx.notFound('Repair detail not found');
    }
    return entry;
  },
}));