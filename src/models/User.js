import mongoose from 'mongoose';
import Joi from 'joi';

const UserSchema = new mongoose.Schema(
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
            select: false,
        },
    },

    { timeStamps: true },
);

const User = mongoose.model('User', UserSchema);
const userRules = Joi.object({
    name: Joi.string().pattern(new RegExp('^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$')).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export { User, userRules };
