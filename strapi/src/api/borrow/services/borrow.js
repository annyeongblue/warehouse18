'use strict';

/**
 * borrow service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::borrow.borrow');
