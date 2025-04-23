'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::export.export', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching export with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::export.export', id);
    if (!entry) {
      return ctx.notFound('export not found');
    }
    return entry;
  },
}));