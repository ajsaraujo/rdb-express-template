function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            return next();
        } catch ({ message }) {
            return res.status(404).json({ message });
        }
    };
}

export default validate;
