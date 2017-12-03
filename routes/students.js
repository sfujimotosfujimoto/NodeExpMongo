const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {ensureAuthenticated} = require('../helpers/auth');

// Load Student Model
require("../models/Student");
const Student = mongoose.model("students");

// Students Index page
router.get("/", ensureAuthenticated,(req, res) => {
  Student.find({user: req.user.id})
    .sort({ date: "desc" })
    .then(students => {
      res.render("students/index", {
        students
      });
    });
});

// ProcessForm
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.firstname) {
    errors.push({ text: "Please add a first name" });
  }
  if (!req.body.lastname) {
    errors.push({ text: "Please add a last name" });
  }
  if (!req.body.cls) {
    errors.push({ text: "Please add a class" });
  }
  if (!req.body.num) {
    errors.push({ text: "Please add a number" });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      cls: req.body.cls,
      num: req.body.num
    });
  } else {
    const newStudent = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      cls: req.body.cls,
      num: req.body.num,
      user: req.user.id
    };
    new Student(newStudent).save().then(student => {
      req.flash("success_msg", "Student Added");
      res.redirect("/students");
    });
  }
});

// Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Student.findOne({
    _id: req.params.id
  }).then(student => {
    //new values
    student.firstname = req.body.firstname;
    student.lastname = req.body.lastname;
    student.cls = req.body.cls;
    student.num = req.body.num;

    student.save().then(student => {
      res.redirect("/students");
    });
  });
});

// delete student
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Student.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Student Removed");
    res.redirect("/students");
  });
});

//
//Add Student Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("students/add");
});

//Edit Student Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Student.findOne({
    _id: req.params.id
  }).then(student => {
    if (student.user != req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/students");
    } else {
      res.render("students/edit", {
        student
      });
    }
    
    
  });
});
module.exports = router;
