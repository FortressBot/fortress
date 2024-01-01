import chalk from "chalk";

export default async function log(message: string, error: boolean) {
    if(error === false) {
        return console.log(`${chalk.bold(chalk.cyan(`Fortress`))} >> ${message}`)
    } else {
        return console.log(`${chalk.bold(chalk.red(`Fortress`))} >> ${message}`)
    }
}