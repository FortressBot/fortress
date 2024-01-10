import { model, Schema } from "mongoose";

export default model('attachmentspam', new Schema({
    Guild: String,
    Limit: Number,
    Punishment: String,
}));