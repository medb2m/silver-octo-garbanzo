import express from 'express';
import { createReport, getAllReports, getReportById, getReportsByWorker, traiteReport } from '../controllers/report.controller.js';
import authorize from '../_middleware/authorize.js'
import {uploadImage}  from '../_middleware/multerConfig.js';

const router = express.Router();

router.post('/add', authorize(), uploadImage.array('images', 5), createReport);
router.get('/worker/:id', authorize(), getReportsByWorker);
router.get('/', authorize(), getAllReports);
router.get('/:reportId', authorize(), getReportById);
router.put('/traite/:reportId', authorize(), traiteReport)

export default router;