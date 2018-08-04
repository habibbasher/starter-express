import UserCtrlr from "../controllers/users";

export default (app) => {

    const endpoint = process.env.API_BASE + "users";

    app.post(endpoint, UserCtrlr.create);

    app.delete(endpoint + "/:id", UserCtrlr.delete);

    app.get(endpoint + "/:id", UserCtrlr.getOne);
   
    app.get(endpoint, UserCtrlr.getAll);

    app.put(endpoint + "/:id", UserCtrlr.update);

};
