const User = require("../model/User");
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { username, pwd } = req.body;

    if (!username || !pwd) {
        return res.status(404).json({ message: "Username and password are required!" });
    }
    // check for duplicate username in db
    const duplicate = await User.findOne({ username }).exec();
    console.log(duplicate);
    if (duplicate) {
        return res.sendStatus(409);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = { username, password: hashedPwd };
        await User.create(newUser);

        res.status(201).json({ message: `New user ${username} created!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleNewUser };
