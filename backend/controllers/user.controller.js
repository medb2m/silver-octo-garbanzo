import Joi from 'joi';
import validateRequest from '../_middleware/validate-request.js'
import UserService from './user.service.js'
import Role from '../_helpers/role.js';

import crypto from 'crypto'
import Token from '../models/token.model.js'

import Region from '../models/region.model.js'
import Delegation from '../models/delegation.model.js'

// create link begin
export async function createAccountLink(req, res) {

    const { role } = req.body
    const token = crypto.randomBytes(40).toString('hex')
    const expiresIn = 24 * 60 * 60 

    const tokenDoc = new Token({
        token,
        expiresAt: Date.now() + expiresIn * 1000,
        role
    })

    await tokenDoc.save()


    res.json(tokenDoc);
}

export async function createAccount(req, res) {
    const { token } = req.params

    const tokenDoc = await Token.findOne({ token, expiresAt: { $gt: Date.now() } })
    if (!tokenDoc) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
    let userl 
    UserService.create(req.body)
        .then(user => userl = user)


    await Token.deleteOne({ _id: tokenDoc._id });
    res.json({ message: 'Account created successfully.', userl});
}
// create link end 


export function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

export function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    UserService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

export function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    UserService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

export function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

export function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    UserService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

export function registerSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        fullName: Joi.string().required(),
        cin: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

export function register(req, res, next) {
    if (req.file){
        req.body.image = `https://${req.get('host')}/img/${req.file.filename}`
    }
    let message = ''
    UserService.register(req.body, message)
        .then(() => res.json({ message: message }))
        .catch(next);
}


export function validateResetTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    })
    validateRequest(req, next, schema);
}

export function validateResetToken(req, res, next) {
    UserService.validateResetToken(req.body)
        .then(() => res.json({ message: 'Token is valid' }))
        .catch(next);
}



export function getAll(req, res, next) {
    UserService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

export function getById(req, res, next) {
    // users can get their own User and admins can get any User
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    UserService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(next);
}

export function createSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        fullName: Joi.string().required(),
        cin: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.User, Role.ModeratorRegion, Role.ModeratorDelegation).required(),
        moderatorRegion: Joi.string().when('role', {
            is: Role.ModeratorRegion,
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow(null, '')
        }),
        moderatorDelegation: Joi.string().when('role', {
            is: Role.ModeratorDelegation,
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow(null, '')
        }),
        city: Joi.string().when('role', {
            is: Role.User,
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow(null, '')
        }),
    });
    validateRequest(req, next, schema);
}

        export function create(req, res, next) {
            try {
                UserService.create(req.body)
                    .then(user => res.json(user))
                    .catch(err => {
                        console.log('Error during user creation:', err);
                        next(err);  // Pass the error to the next middleware
                    });
            } catch (err) {
                console.log('Unexpected error:', err);
                next(err);  // Handle unexpected errors
            }
        }

export function updateSchema(req, res, next) {
    const schemaRules = {
        username: Joi.string().empty(''),
        fullName: Joi.string().empty(''),
        cin: Joi.string().empty(''),
        moderatorRegion: Joi.string().when('role', {
            is: Role.ModeratorRegion,
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow(null, '')
        }),
        moderatorDelegation: Joi.string().when('role', {
            is: Role.ModeratorDelegation,
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow(null, '')
        }),
        city: Joi.string().when('role', {
            is: Role.User,
            then: Joi.string().required(),
            otherwise: Joi.string().optional().allow(null, '')
        }),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    };

    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User, Role.ModeratorRegion, Role.ModeratorDelegation).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}


export function update(req, res, next) {
    if (req.file) {
        req.body.image = `https://${req.get('host')}/img/${req.file.filename}`;
    }
    // users can update their own User and admins can update any User
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    UserService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

export function _delete(req, res, next) {
    // users can delete their own User and admins can delete any User
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    UserService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

// helper functions

export function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}



export async function getModeratorByRegion(req, res) {
    try {
        // Fetch the region by ID and populate the 'moderators' field with user data
        const region = await Region.findById(req.params.regionId)
            .populate('moderators')  // Exclude password hash for security

        if (!region) {
            return res.status(404).json({ message: "Region not found" });
        }

        // Send back the list of moderators
        res.status(200).json(region.moderators);
    } catch (error) {
        res.status(500).json({ message: "Error fetching moderators", error });
    }
}

// getModeratorByDelegation

export async function getModeratorByDelegation(req, res) {
    try {
        // Fetch the region by ID and populate the 'moderators' field with user data
        const delegation = await Delegation.findById(req.params.delegationId)
            .populate('moderators')  // Exclude password hash for security

        if (!delegation) {
            return res.status(404).json({ message: "Delegation not found" });
        }

        // Send back the list of moderators
        res.status(200).json(delegation.moderators);
    } catch (error) {
        res.status(500).json({ message: "Error fetching moderators", error });
    }
}