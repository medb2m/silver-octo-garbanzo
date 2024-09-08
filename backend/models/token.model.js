import mongoose from 'mongoose'

const {Schema,model} = mongoose

const tokenSchema = new Schema({
    //user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expiresAt: Date,
    role: String
})

export default model('TokenSchema', tokenSchema);