'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::import.import', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching import with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::import.import', id);
    if (!entry) {
      return ctx.notFound('import not found');
    }
    return entry;
  },
}));