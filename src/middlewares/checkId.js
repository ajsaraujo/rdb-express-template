function checkId(req, res, next) {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Você deve fornecer um ID nos parâmetros da requisição.' });
    }

    return next();
}

export default checkId;
