'use strict';

/**
 * user-1 service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-1.user-1');
