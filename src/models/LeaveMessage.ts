import { model, Schema } from 'mongoose';

export default model('leavemessage', new Schema({
    Guild: String,
    Message: String,
    Channel: String,
}))