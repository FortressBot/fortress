import { model, Schema } from 'mongoose';

export default model('antiswear', new Schema({
    Guild: String,
    Exceptions: Array,
}));