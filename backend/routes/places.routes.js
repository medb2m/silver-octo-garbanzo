import express from 'express'
import authorize from '../_middleware/authorize.js'
import { createRegion, getAllRegions, getRegion, updateRegion, deleteRegion } from '../controllers/region.controller.js';
import { createDelegation, deleteDelegation, getAllDelegations, getAllDelegationsByRegion, getDelegation, updateDelegation } from '../controllers/delegation.controller.js';
import { addWorker, createCity, deleteCity, getAllCities, getCitiesByDelegations, getCity, getWorkers, removeWorker, updateCity } from '../controllers/city.controller.js';
//import {uploadImage} from '../_middleware/multerConfig.js'

const router = express.Router()

// region routes
router.post('/regions', authorize(), createRegion);
router.get('/regions',  getAllRegions);
router.get('/regions/:id', authorize(), getRegion);
router.put('/regions/:id', authorize(), updateRegion);
router.delete('/regions/:id', authorize(), deleteRegion);

// delegation routes
router.post('/delegations', authorize(), createDelegation);
router.get('/delegations', getAllDelegations);
router.get('/delegations/region/:regionId', authorize(), getAllDelegationsByRegion);
router.get('/delegations/:id', authorize(), getDelegation);
router.put('/delegations/:id', authorize(), updateDelegation);
router.delete('/delegations/:id', authorize(), deleteDelegation);

// cities routes
router.put('/cities/worker/:cityId/:workerId', authorize(), addWorker);
router.put('/cities/remworker/:cityId/:workerId', authorize(), removeWorker);
router.post('/cities', authorize(), createCity);
router.get('/cities', getAllCities);
router.get('/cities/workers/:cityId', authorize(), getWorkers);
router.get('/cities/delegation/:delegId', authorize(), getCitiesByDelegations);
router.get('/cities/:id', authorize(), getCity);
router.put('/cities/:id', authorize(), updateCity);
router.delete('/cities/:id', authorize(), deleteCity);


export default router;