import jwt from 'jwt-simple';
import passport from 'passport';
import moment from 'moment';
import { Strategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/User';

class Authentication {

    initialize = () => {
        passport.use('jwt', this.getStrategy());
        return passport.initialize();
    }

    authenticate = (callback) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

    genToken = (user) => {
        let expires = moment().utc().add({ days: 7 }).unix();
        let token = jwt.encode({
            exp: expires,
            username: user.username
        }, process.env.JWT_SECRET);

        return {
            token: 'JWT ' + token,
            expires: moment.unix(expires).format(),
            user: user._id
        };
    }

    login = async (req, res) => {
        try {
            req.checkBody('username', 'Invalid username').notEmpty();
            req.checkBody('password', 'Invalid password').notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;

            let user = await User.findOne({ 'username': req.body.username }).exec();

            if (user === null) throw 'User not found';

            let success = await user.comparePassword(req.body.password);
            if (success === false) throw '';

            res.status(200).json(this.genToken(user));
        } catch (err) {
            res.status(401).json({ 'message': 'Invalid credentials', 'errors': err });
        }
    }

    getStrategy = () => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new Strategy(params, (req, payload, done) => {
            UserModel.findOne({ 'username': payload.username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user === null) {
                    return done(null, false, { message: 'The user in the token was not found' });
                }

                return done(null, { _id: user._id, username: user.username });
            });
        });
    }

}

export default new Authentication();
