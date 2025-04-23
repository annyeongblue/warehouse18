'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::repair.repair', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching repair with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::repair.repair', id, ctx.query);
    if (!entry) {
      return ctx.notFound('Repair not found');
    }
    return entry;
  },
}));