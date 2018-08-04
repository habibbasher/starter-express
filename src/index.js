import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';


import log from './logger/logger';
import initializeDb from './db/db';
import routes from './routes/root-routes';
import authentication from './controllers/authentication';


let app = express();

dotenv.config();
authentication.default;

app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator({
    customValidators: {
        isArray: function (value) {
            return Array.isArray(value);
        }
    }
}));

// so we can get the client's IP address
app.enable("trust proxy");

app.use(authentication.initialize());

app.all(process.env.API_BASE + "*", (req, res, next) => {

    if (req.path.includes(process.env.API_BASE + "login")) return next();
    if (req.method === "POST" && req.path.includes(process.env.API_BASE + "users"))
        return next();

    return authentication.authenticate((err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            if (info.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Your token has expired. Please generate a new one"
                });
            } else {
                return res.status(401).json({
                    message: info.message
                });
            }
        }
        app.set("user", user);
        return next();
    })(req, res, next);
});

routes(app);

// Connect to db and start server
initializeDb(() => {
	app.listen(process.env.SERVER_PORT || 3002, () => {
        log.info(`Started on port ${process.env.SERVER_PORT}, To stop the server press ctrl + c`);
    });
});

export default app;
