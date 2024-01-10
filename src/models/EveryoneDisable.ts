import { model, Schema } from 'mongoose';

export default model('everyonedisable', new Schema({
    Guild: String,
    Exceptions: Array,
}))