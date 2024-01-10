import { model, Schema } from "mongoose";

export default model('lockdown', new Schema({
    Guild: String,
    AnncChannel: String,
}))