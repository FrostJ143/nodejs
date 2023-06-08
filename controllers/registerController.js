const userDB = {
    users: require("../model/user.json"),
    setUsers: function (data) {this.users = data}
}
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const {username, pwd} = req.body;

    if (!username || !pwd) {
        return res.status(404).json({"message": "Username and password are required!"});
    }
    // check for duplicate username in db
    if (userDB.users.find(user => user.username === username)) {
        return res.status(409);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = {username, roles: {"User": 2001}, password: hashedPwd};
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(path.join(__dirname, "..", "model", "user.json"), JSON.stringify(userDB.users));
        res.status(201).json({"message": `New user ${username} created!`});
    } catch (error) {
        res.status(500).json({"message": error.message});
    }
}

module.exports = {handleNewUser};