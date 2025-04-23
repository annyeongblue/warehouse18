'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::import-detail.import-detail', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching import-detail with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::import-detail.import-detail', id);
    if (!entry) {
      return ctx.notFound('import-detail not found');
    }
    return entry;
  },
}));