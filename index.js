'use strict';
/**
 * @author Francisco JG Caballero
 * @description
 */

const mongoose = require('mongoose');
const chalk = require('chalk');
const app = require('./app');
const log = console.log;

/************************** */
/* Configuration variables  *
/************************** */
const dbMongoName = 'project';
const pathToDBMongo = `mongodb://localhost:27017/${dbMongoName}`;
const serverPort = process.env.PORT || 3977;

/****************************************** */
/* Mongoose connection and Express server   *
/****************************************** */
mongoose.connect(pathToDBMongo, { useNewUrlParser: true }, error => {
  if (error) {
    throw error;
  } else {
    log('\n');
    log(
      chalk.red('  Deus ') + chalk.yellow('familiae ') + chalk.blue('officium')
    );
    log('         .-.');
    log('        {{@}}');
    log('         8@8');
    log('         888');
    log('         8@8');
    log('    _    )8(   _');
    log('   (@)__/8@8__(@)');
    log('    `~"-=):(=-"~`');
    log('         |.|');
    log('         |C|');
    log("         |'|");
    log('         |.|');
    log('         |S|');
    log("         |'|");
    log('         |.|');
    log('         |O|');
    log("         |'|");
    log('         |.|');
    log('         |F|');
    log("         |'|");
    log('         |.|');
    log('         |T|');
    log("         |'|");
    log('         \\ /');
    log('          V');
    log(
      chalk.green.bold(
        `\n\n \t Connection to the DB correct / path: ${chalk.yellow(
          pathToDBMongo
        )} `
      )
    );
    app.listen(serverPort, () => {
      log(
        chalk.cyan.bold(
          `\t Servidor Node escuchando en puerto ${chalk.yellow(
            'localhost:' + serverPort
          )} \n\n`
        )
      );
    });
  }
});
