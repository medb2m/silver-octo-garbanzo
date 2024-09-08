import express from 'express';
import { createSocial, deleteSocial, getAllSocial, getSocialById, traiteSocial, updateSocial } from '../controllers/social.controller.js';
import authorize from '../_middleware/authorize.js'

const router = express.Router();

router.post('/add', authorize(), createSocial);
router.get('/', authorize(), getAllSocial);
router.get('/:socialId', authorize(), getSocialById);
router.put('/update/:socialId', authorize(), updateSocial)
router.put('/traite/:socialId', authorize(), traiteSocial)
router.delete('/delete/:socialId', authorize(), deleteSocial)

export default router;