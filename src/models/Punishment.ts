import { model, Schema } from 'mongoose';

export default model('punishments', new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Moderator: String,
    Type: String,
}));