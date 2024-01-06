import { model, Schema } from 'mongoose';

export default model('welcome', new Schema({
    Guild: String,
    WelcomeChannel: String,
    RulesChannel: String,
    ChatChannel: String,
    AnnouncementsChannel: String,
}));