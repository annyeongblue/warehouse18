'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::export-detail.export-detail', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching export-detail with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::export-detail.export-detail', id);
    if (!entry) {
      return ctx.notFound('export-detail not found');
    }
    return entry;
  },
}));