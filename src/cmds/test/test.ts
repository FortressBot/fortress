import { Command } from "../../structures/Command";
import Reply from "../../functions/reply";

export default new Command({
    name: 'test',
    description: 'Testing command',

    run: async({ interaction }) => {
        return Reply(interaction, `Testing command works!`, `✅`, `Green`, true);
    }
})