import { model, Schema } from "mongoose";

export default model('rpuser', new Schema({
    Guild: String,
    User: String,
    RoleCreate: Number,
    RoleDelete: Number,
    ChannelCreate: Number,
    ChannelDelete: Number,
    GuildBanAdd: Number,
}))