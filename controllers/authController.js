const User = require("../model/User");
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { username, pwd } = req.body;
    if (!username || !pwd) {
        return res.status(404).json({ message: "Usernam and password are required!" });
    }

    const matchUsername = await User.findOne({ username }).exec();
    if (!matchUsername) {
        return res.status(404).json({ message: "Can not find username!" });
    }

    const matchPwd = await bcrypt.compare(pwd, matchUsername.password);
    if (!matchPwd) {
        return res.status(404).json({ message: "Wrong password!" });
    }

    const roles = Object.values(matchUsername.roles);
    // create JWTs
    const accessToken = jwt.sign({ UserInfo: { username: matchUsername.username, roles } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
    const refreshToken = jwt.sign({ username: matchUsername.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

    matchUsername.refreshToken = refreshToken;
    const result = await matchUsername.save();
    console.log(result);

    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ accessToken });
};

module.exports = { handleLogin };
