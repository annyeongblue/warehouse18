'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching order with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::order.order', id, ctx.query);
    if (!entry) {
      return ctx.notFound('Order not found');
    }
    return entry;
  },
}));