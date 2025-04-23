'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::item.item', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching item with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::item.item', id);
    if (!entry) {
      return ctx.notFound('Item not found');
    }
    return entry;
  },
}));