# fortress
the future of security on discord.

## disclaimer:
this branch is the "main" version of fortress.<br>
this means that there will be more tested features than the [beta](https://github.com/fortressbot/fortress/tree/beta) branch, however beta is experimental.<br>
these features are usually released to the main branch every monday, with beta updates coming out almost daily.<br>
if you wish to clone the beta repository, follow the steps below:

# clone this repository:

````git clone -b main https://github.com/fortressbot/fortress````
### then use

``npm i`` or ``npm install`` & run ``npm run nodemon`` or ``npm run start``

### Remember to ____ before you run the bot:

- Rename "config.example.json" to "config.json". This is so Fortress can actually recognise it.

- Fill in config.json with all of your info, including bot token, mongo URI (only if mongo is enabled), and guild ID. (NOTE: Mongo URI is only required IF the property "mongoEnabled" is set to true.)
