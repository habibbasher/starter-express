import UserModel from '../models/User';

class Users {

    getAll = async (req, res) => {
        try {
            const users = await UserModel.find({}).exec();
            res.status(200).json(users);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    getOne = async (req, res) => {
        try {
            let user = await UserModel.findById(req.params.id).exec();

            if (user === null) {
                return res.status(404).json({ message: "This user doesn't exist" });
            }

            res.status(200).json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    create = async (req, res) => {
        try {
            this.validateRequest(req);

            let Data = new UserModel(req.body);
            await Data.save();

            res.status(201).json({ "message": "User saved successfully!", "id": Data._id });
        } catch (err) {
            res.status(400).json({ "message": "Missing parameters", errors: err });
        }
    }

    update = async (req, res) => {
        try {
            this.validateRequest(req, true);

            await UserModel.findByIdAndUpdate(req.params.id, req.body);

            res.status(200).json({ "message": "User updated successfully!" });
        } catch (err) {
            res.status(400).json({ "message": "Missing parameters", errors: err });
        }
    }

    validateRequest = (req, update = false) => {
        if (!update) {
            req.checkBody("username", "The username cannot be empty").notEmpty();
            req.checkBody("password", "The password cannot be empty").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;
        }

        if (Object.keys(req.body).length === 0) {
            throw "Nothing was sent";
        }
    }

    delete = async (req, res) => {
        try {
            await UserModel.findByIdAndRemove(req.params.id);
            res.status(200).json({ "message": "User deleted successfully!" });
        } catch (err) {
            res.status(400).json({ "message": `Error delete user: ${err}` });
        }
    }

}

export default new Users();