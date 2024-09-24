import express from 'express'
import authorize from '../_middleware/authorize.js'
import { createRegion, getAllRegions, getRegion, updateRegion, deleteRegion, addModerator, removeModerator } from '../controllers/region.controller.js';
import { createDelegation, deleteDelegation, getAllDelegations, getAllDelegationsByRegion, getDelegation, updateDelegation } from '../controllers/delegation.controller.js';
import { addWorker, createCity, deleteCity, getAllCities, getCitiesByDelegations, getCity, getReportersByCityId, removeWorker, updateCity } from '../controllers/city.controller.js';
//import {uploadImage} from '../_middleware/multerConfig.js'

const router = express.Router()

// region routes
router.post('/regions', authorize(), createRegion);
router.get('/regions',  getAllRegions);
router.get('/regions/:id', authorize(), getRegion);
router.put('/regions/:id', authorize(), updateRegion);
router.delete('/regions/:id', authorize(), deleteRegion);
router.put('/regions/moderator/:regionId/:moderatorId', authorize(), addModerator);
router.put('/regions/removemoderator/:regionId/:moderatorId', authorize(), removeModerator);
router.get('/region/:regionId/reports', async (req, res) => {
    const { regionId } = req.params;
  
    try {
      const reports = await Report.find({ region: regionId });
      const workerCount = await User.countDocuments({ region: regionId });
  
      res.json({
        reportCount: reports.length,
        workerCount,
        reports,  // Contains the full report data
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching region reports' });
    }
  });

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
router.get('/cities/reporters/:cityId', authorize(), getReportersByCityId);
router.get('/cities/delegation/:delegId', authorize(), getCitiesByDelegations);
router.get('/cities/:id', authorize(), getCity);
router.put('/cities/:id', authorize(), updateCity);
router.delete('/cities/:id', authorize(), deleteCity);



export default router;