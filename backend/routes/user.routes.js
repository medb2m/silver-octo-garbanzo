import express from 'express'
import Role from '../_helpers/role.js';
import authorize from '../_middleware/authorize.js';

import {
    authenticateSchema,
    authenticate,
    refreshToken,
    revokeTokenSchema,
    revokeToken,
    registerSchema,
    register,
    validateResetTokenSchema,
    validateResetToken,
    getAll,
    getById,
    createSchema,
    create,
    updateSchema,
    update,
    _delete,
    createAccountLink,
    createAccount,
    getModeratorByRegion
} from '../controllers/user.controller.js'
import { uploadImage } from '../_middleware/multerConfig.js'



const router = express.Router()

router.post('/create-link', authorize(), createAccountLink);
router.post('/register-link', createAccount);
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.post('/create-from-link/:token', createAccount);
router.put('/:id', authorize(), uploadImage.single("image"), updateSchema, update);
router.delete('/:id', authorize(), _delete);

// get users for delegation & regions ( moderator )
router.get('/moderator/:regionId', getModeratorByRegion)

export default router