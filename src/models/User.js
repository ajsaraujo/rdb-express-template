import { DataTypes, Model, UUIDV4 } from 'sequelize';
import Joi from 'joi';
import PasswordUtils from '../utils/PasswordUtils';

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, { sequelize });

        User.injectHooks();
    }

    static injectHooks() {
        async function encryptPassword(user) {
            // eslint-disable-next-line no-param-reassign
            user.password = await PasswordUtils.encrypt(user.password);
        }

        User.beforeCreate(encryptPassword);
        User.beforeSave(encryptPassword);
    }
}

const id = Joi.string().required();
const name = Joi.string().pattern(new RegExp('^[[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$')).required();
const email = Joi.string().email().required();
const password = Joi.string().min(8).max(40).required();

/* eslint-disable */
User.rules = Joi.object({ name, email, password });
User.updateRules = Joi.object({ id, name, email, password });
User.authRules = Joi.object({ email, password });
/* eslint-enable */

export default User;
