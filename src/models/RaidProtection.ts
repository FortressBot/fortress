import { model, Schema } from "mongoose";

export default model('raidprotection', new Schema({
    Guild: String,
    Exceptions: Array,
    RoleCreateLimit: Number,
    RoleDeleteLimit: Number,
    ChannelCreateLimit: Number,
    ChannelDeleteLimit: Number,
    GuildBanAddLimit: Number,
}));