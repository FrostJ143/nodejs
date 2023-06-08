const express = require("express");
const router = express.Router();
const path = require("path");
const verifyRoles = require("../../middlewares/verifyRoles");
const ROLES_LIST = require("../../configs/roles_list");
const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee } = require("../../controllers/employeesController");
const { getEventListeners } = require("events");

router.route("/").get(verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin), getAllEmployees).post(verifyRoles(ROLES_LIST.Admin), createEmployee);
router.route("/:id").put(updateEmployee).delete(deleteEmployee).get(getEmployee);

module.exports = router;
