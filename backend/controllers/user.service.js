import { config } from '../_helpers/config.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import {isValidId} from '../_helpers/db.js'
import Role from '../_helpers/role.js'
import User from '../models/user.model.js'
import RefreshToken from '../models/refresh-token.model.js'

function generateJwtToken (user) {
    // create a jwt token containing the User id that expires in 60 minutes
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '60m' })
}

function generateRefreshToken (user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    })
}
   
function randomTokenString() {
    return crypto.randomBytes(40).toString('hex')
}


function basicDetails(user){
    const { id, username, fullName, role, cin, created, updated, isVerified, image, moderatorZone, city } = user
    return { id, username, fullName, role, cin, created, updated, isVerified, image, moderatorZone, city }
}

async function getUser(id){
    if (!isValidId(id)) throw 'User not found'
    const user = await User.findById(id).populate('city').populate('moderatorZone')
    if (!user) throw 'User not found'
    return user;
}

async function getRefreshToken (token) {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user')
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token'
    return refreshToken
}

function hash(password){
    return bcrypt.hashSync(password, 10)
}




const UserService = {
    authenticate: async ({ email, password, ipAddress }) => {
        let user
        if (email.includes('@')){
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ username : email });
        }
        
    
        if (!user || !user.isVerified || !bcrypt.compareSync(password, user.passwordHash)) {
            throw 'Email or password is incorrect';
        }
    
        // authentication successful so generate jwt and refresh tokens
        const jwtToken = generateJwtToken(user);
        const refreshToken = generateRefreshToken(user, ipAddress);
    
        // save refresh token
        await refreshToken.save();
    
        // return basic details and tokens
        return {
            ...basicDetails(user),
            jwtToken,
            refreshToken: refreshToken.token
        };
    },
    
    refreshToken: async ({ token, ipAddress }) => {
        const refreshToken = await getRefreshToken(token);
        const { user } = refreshToken;
    
        // replace old refresh token with a new one and save
        const newRefreshToken = generateRefreshToken(user, ipAddress);
        refreshToken.revoked = Date.now();
        refreshToken.revokedByIp = ipAddress;
        refreshToken.replacedByToken = newRefreshToken.token;
        await refreshToken.save();
        await newRefreshToken.save();
    
        // generate new jwt
        const jwtToken = generateJwtToken(user);
    
        // return basic details and tokens
        return {
            ...basicDetails(user),
            jwtToken,
            refreshToken: newRefreshToken.token
        };
    },
    
    revokeToken : async ({ token, ipAddress }) => {
        const refreshToken = await getRefreshToken(token);
    
        // revoke token and save
        refreshToken.revoked = Date.now();
        refreshToken.revokedByIp = ipAddress;
        await refreshToken.save();
    },
    
    register : async (params, message) => {
        // validate
        if (await User.findOne({ username: params.username })) {
            // send already registered error in email to prevent User enumeration
            //return await sendAlreadyRegisteredEmail(params.email, origin);
            console.log('username already exists !')
            message = 'hello already exist'
            return false
        }

        console.log('hello after return ')
        // create User object
        const user = new User(params);
    
        // first registered User is an admin
        const isFirstUser = (await User.countDocuments({})) === 0;
        user.role = isFirstUser ? Role.Admin : Role.User;
        user.verified = new Date();
    
        // hash password
        user.passwordHash = hash(params.password);
    
        // save User
        await user.save();
        message = 'hello created account'
    },
    
    validateResetToken : async({ token }) => {
        const user = await User.findOne({
            'resetToken.token': token,
            'resetToken.expires': { $gt: Date.now() }
        });
    
        if (!user) throw 'Invalid token';
    },
    
    getAll : async () => {
        const users = await User.find();
        return users.map(x => basicDetails(x));
    },
    
    getById : async (id) => {
        const user = await getUser(id);
        return basicDetails(user);
    },
    
    create : async (params) => {
        // validate
        if (await User.findOne({ username: params.username })) {
            throw 'Username "' + params.username + '" is already registered';
        }
    
        const user = new User(params);
        user.verified = Date.now();
    
        // hash password
        user.passwordHash = hash(params.password);
    
        // save User
        await user.save();
    
        return basicDetails(user);
    },
    
    update : async (id, params) => {
        const user = await getUser(id);
    
        // validate (if email was changed)
        if (params.username && user.username !== params.username && await User.findOne({ email: params.username })) {
            throw 'Username "' + params.username + '" is already taken';
        }
    
        // hash password if it was entered
        if (params.password) {
            params.passwordHash = hash(params.password);
        }
    
        // copy params to User and save
        Object.assign(user, params);
        user.updated = Date.now();
        await user.save();
    
        return basicDetails(user);
    },
    
    delete : async (id) => {
        const user = await getUser(id);
        await user.deleteOne();
    }
}

export default UserService