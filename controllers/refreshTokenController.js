const userDB = {
    users: require("../model/user.json"),
    setUsers(data) {this.users = data}
}
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) return res.sendStatus(401); // 401 is unauthorized

    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) return res.status(401);
        const accessToken = jwt.sign({UserInfo: {username: foundUser.username, roles: Object.values(foundUser.roles)}}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30s"});
        
        res.json({accessToken});
    })
}

module.exports = {handleRefreshToken};