import { model, Schema } from 'mongoose';

export default model("antilink", new Schema({
    Guild: String,
    Mode: String,
}));