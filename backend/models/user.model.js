import mongoose from 'mongoose'

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    passwordHash: { type: String, required: true },
    username: { type: String, unique: true,required: true },
    fullName: { type: String, required: true },
    cin: { type: Number, required: true },
    role: { type: String, required: true },
    verificationToken: String,
    verified: Date,
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    created: { type: Date, default: Date.now },
    updated: Date,
    image : { type : String },
    // for the work 
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City'},
    moderatorZone: String,
    delegation: { type: mongoose.Schema.Types.ObjectId, ref: 'Delegation' },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
})

UserSchema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // to remove when converted
        delete ret._id
        delete ret.passwordHash
    }
});

export default model('User', UserSchema);
