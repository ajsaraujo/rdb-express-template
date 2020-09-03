import { Schema, model } from 'mongoose';
import Joi from 'joi';
import PasswordUtils from '../utils/PasswordUtils';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 40
        },
    },

    { timeStamps: true },
);

// Deve-se usar function() e não arrow function por causa do this.
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await PasswordUtils.encrypt(this.password);
    }

    next();
});

const User = model('User', UserSchema);

const userRules = Joi.object({
    name: Joi.string().pattern(new RegExp('^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$')).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(40).required(),
});

export { User, userRules };
