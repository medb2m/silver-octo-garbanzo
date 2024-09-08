import mongoose from "mongoose";

const { model, Schema} = mongoose

const SocialSchema = new Schema({
    title : { type: String, required: true},
    link : { type: String, required: true},
    date : {type: Date, default: Date.now},
    traiter: {type: Boolean, default: false},
})

export default model('Social', SocialSchema)