import Authentication from '../controllers/authentication';

export default (app) => {
    app.post(process.env.API_BASE + 'login', Authentication.login);
};
