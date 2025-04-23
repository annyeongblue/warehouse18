'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::unit.unit', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    console.log(`Fetching unit with ID: ${id}`); // Debugging
    const entry = await strapi.entityService.findOne('api::unit.unit', id);
    if (!entry) {
      return ctx.notFound('Unit not found');
    }
    return entry;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    console.log(`Updating unit with ID: ${id}`, data); // Debugging

    // Verify the unit exists
    const entry = await strapi.entityService.findOne('api::unit.unit', id);
    if (!entry) {
      return ctx.notFound('Unit not found');
    }

    // Perform the update
    const updatedEntry = await strapi.entityService.update('api::unit.unit', id, {
      data,
    });

    return updatedEntry;
  },

  async delete(ctx) {
    const { id } = ctx.params;
    console.log(`Deleting unit with ID: ${id}`); // Debugging
    try {
      // Verify the unit exists
      const entry = await strapi.entityService.findOne('api::unit.unit', id);
      if (!entry) {
        return ctx.notFound('Unit not found');
      }
      // Perform the deletion
      await strapi.entityService.delete('api::unit.unit', id);
      return ctx.deleted(); // 204 No Content
    } catch (error) {
      console.error(`Error deleting unit with ID: ${id}`, error);
      return ctx.internalServerError('An error occurred while deleting the unit');
    }
  }
}));