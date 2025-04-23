'use strict';

/**
 * item-test service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::item-test.item-test');
