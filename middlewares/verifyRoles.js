const verifyRoles = (...allowedRoles) => {

    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const result = allowedRoles.find(role => req.roles.find(r => r === role));
        if (!result) res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;