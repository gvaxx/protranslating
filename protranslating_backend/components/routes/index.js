const express = require('express');
const router = express.Router();
const clientValidator = require('../validators/client')
const ObjectIdInParamValidator = require('../validators/common')
const providerValidator = require('../validators/provider')
const clientController = require('../controller/client')
const providerController = require('../controller/provider')
/**
 * Provider_Id
 * @typedef {object} Provider_Id
 * @property {string} id - 6115913e29a4ee5f2e687a4d
 */

/**
 * Client
 * @typedef {object} Client
 * @property {string} name - client name
 * @property {string} phone - USer telephone
 * @property {string} email - Client Email
 * @property {array<Provider_Id>} providers - Providers by id
 */

/**
 * GET /clients
 * @summary Get list of clients
 * @return {array<Client>} 200 - Return list of clients and providers
 * @return {object} 500 - Unhandled error
 */
router.get('/clients', clientController.getAllClients)

/**
 * Client_Assignment
 * @typedef {object} Client_Assignment
 * @property {string} id - 6115913e29a4ee5f2e687a4d
 * @property {string} name - Client name
 * @property {string} phone - 9999999999
 * @property {string} email - test@test.com
 * @property {array<object>} providers - [{"id": "6115913e29a4ee5f2e687a4d"}]
 *
 */

/**
 * GET /clients/{id}
 * @summary Get client by id
 * @param {string} id.path.required - Client id
 * @return {Client_Assignment} 200 - Return client by Id
 * @return {object} 400 - The request entity is not correct
 * @return {object} 404 - Client with Id not found
 * @return {object} 500 - Unhandled error
 */
router.get('/clients/:id', ObjectIdInParamValidator, clientController.getClientById)

/**
 * POST /clients
 * @summary Create client
 * @param {Client} request.body.required - Client body
 * @return {Client_Assignment} 200 - Successful client creation
 * @return {object} 400 - The request entity is not correct
 * @return {object} 500 - Unhandled error
 */
router.post('/clients', clientValidator, clientController.createClient)

/**
 * PUT /clients/{id}
 * @summary Update client by id
 * @param {string} id.path.required - Client id
 * @param {Client_Assignment} request.body.required - Client fields
 * @return {Client_Assignment} 200 - Return client by Id
 * @return {object} 400 - The request entity is not correct
 * @return {object} 404 - Client with Id not found
 * @return {object} 500 - Unhandled error
 */
router.put('/clients/:id', clientValidator.concat(ObjectIdInParamValidator), clientController.updateClientById)

/**
 * DELETE /clients/{id}
 * @summary Delete client by id
 * @param {string} id.path.required - Client id
 * @return {object} 204 - Client successfully deleted
 * @return {object} 400 - The request entity is not correct
 * @return {object} 404 - Client with Id not found
 * @return {object} 500 - Unhandled error
 */
router.delete('/clients/:id', ObjectIdInParamValidator, clientController.deleteClientById)


/**
 * Provider
 * @typedef {object} Provider
 * @property {string} name - Provider name
 *
 */

/**
 * Provider_Assignment
 * @typedef {object} Provider_Assignment
 * @property {string} id - 6115913e29a4ee5f2e687a4d
 * @property {string} name - Provider name
 */
/**
 * POST /providers
 * @summary Create provider
 * @param {Provider} request.body.required - Provider body
 * @return {Provider_Assignment} 200 - Provider successfully created
 * @return {object} 400 - The request entity is not correct
 * @return {object} 500 - Unhandled error
 */
router.post('/providers', providerValidator, providerController.createProvider)



/**
 * GET /providers
 * @summary Get all providers
 * @return {Provider_Assignment} 200 - Return list of providers
 * @return {object} 400 - The request entity is not correct
 * @return {object} 500 - Unhandled error
 */
router.get('/providers', providerController.getAllProviders)

/**
 * PUT /providers/{id}
 * @summary Update provider by id
 * @param {string} id.path.required - Client id
 * @param {Provider} request.body.required - Provider body
 * @return {Provider_Assignment} 200 - Provider successfully updated
 * @return {object} 400 - The request entity is not correct
 * @return {object} 404 - Provider with Id not found
 * @return {object} 500 - Unhandled error
 */
router.put('/providers/:id', providerValidator.concat(ObjectIdInParamValidator), providerController.updateProviderById)

/**
 * DELETE /providers/{id}
 * @summary Delete provider by id
 * @param {string} id.path.required - Client id
 * @return {object} 204 - Provider successfully deleted
 * @return {object} 400 - The request entity is not correct
 * @return {object} 404 - Provider with Id not found
 * @return {object} 500 - Unhandled error
 */
router.delete('/providers/:id', ObjectIdInParamValidator, providerController.deleteProviderById)

module.exports = router;
