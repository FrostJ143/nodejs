const userDB = {
    users: require("../model/user.json"),
    setUsers(data) {this.users = data}
}
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
    const {username, pwd} = req.body;
    if (!username || !pwd) {
        return res.status(404).json({"message": "Usernam and password are required!"});
    }

    const matchUsername = userDB.users.find(user => user.username === username);
    if (!matchUsername) {
        return res.status(404).json({"message": "Can not find username!"});
    }

    const matchPwd = await bcrypt.compare(pwd, matchUsername.password);
    if (!matchPwd) {
        return res.status(404).json({"message": "Wrong password!"});
    } 

    const roles = Object.values(matchUsername.roles);
    // create JWTs
    const accessToken = jwt.sign({UserInfo: {username: matchUsername.username, roles}}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30s"});
    const refreshToken = jwt.sign({username: matchUsername.username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d"});
    const otherUsers = userDB.users.filter(user => user.username !== matchUsername.username);
    const currentUser = {...matchUsername, refreshToken};
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "user.json"), JSON.stringify(userDB.users));

    res.cookie("jwt", refreshToken, {httpOnly: true, sameSite: "None", secure: "true", maxAge: 24 * 60 * 60 * 1000});
    res.status(200).json({accessToken});
}

module.exports = {handleLogin};