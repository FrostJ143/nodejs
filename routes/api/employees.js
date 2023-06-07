const express = require("express");
const router = express.Router();
const path = require("path");
const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee } = require("../../controllers/employeesController");
const { getEventListeners } = require("events");

router.route("/").get(getAllEmployees).post(createEmployee);
router.route("/:id").put(updateEmployee).delete(deleteEmployee).get(getEmployee);

module.exports = router;
