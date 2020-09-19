async function verifyId(req, res, next) {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Você deve fornecer um id nos parâmetros da requisição.' });
    }

    return next();
}

export default verifyId;