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
    }
}

async function encryptPassword(user) {
    // eslint-disable-next-line no-param-reassign
    user.password = await PasswordUtils.encrypt(user.password);
}

User.beforeCreate(encryptPassword);
User.beforeUpdate(encryptPassword);

const emailRules = Joi.string().email().required();
const passwordRules = Joi.string().min(8).max(40).required();

User.validationRules = Joi.object({
    name: Joi.string().pattern(new RegExp('^[[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$')).required(),
    email: emailRules,
    password: passwordRules
});

User.authRules = Joi.object({
    email: emailRules,
    password: passwordRules
});

export default User;
