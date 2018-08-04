import mongoose from 'mongoose';
import bluebird from 'bluebird';
mongoose.Promise = bluebird;

import log from '../logger/logger';

export default (cb) => {

	const dbName = 'base-express-db-test';
	const dbAddress = process.env.DB_HOST || '127.0.0.1';
	const dbPort = process.env.DB_PORT || 27017;

	const options = {
		useNewUrlParser: true
	};

	if (process.env.DB_AUTH === 'true') {
		options['user'] = process.env.DB_USER;
		options['pass'] = process.env.DB_PASS;
	}

	mongoose.connect(`mongodb://${dbAddress}:${dbPort}/${dbName}`, options)
		.then(() => {
			log.info(`Express server connected with mongodb on ${dbAddress}`);
		}).catch(err => {
			if (err.message.indexOf('ECONNREFUSED') !== -1) {
				log.error('Error: The server was not able to reach MongoDB. Maybe it\'s not running?');
				process.exit(1);
			} else {
				throw err;
			}
		});
	cb();
};
