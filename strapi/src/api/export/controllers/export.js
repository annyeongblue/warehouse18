'use strict';

/**
 * export controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::export.export');
