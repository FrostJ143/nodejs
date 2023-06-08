const userDB = {
    users: require("../model/user.json"),
    setUsers(data) {this.users = data}
}

const fsPromises = require("fs").promises;
const path = require("path")

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: "true"});
        res.sendStatus(403);
    }

    const otherUsers = userDB.users.filter(user => user.refreshToken === refreshToken);
    const currentUser = {...foundUser, refreshToken: ""};
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "user.json"), JSON.stringify(userDB.users));

    res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: "true"});
    res.sendStatus(204);
}

module.exports = {handleLogout};