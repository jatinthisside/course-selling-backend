const Admin = require("../models/Admin");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.Signup = async (req, res) => {
  // console.log('Inside Admin signup controller!');
  try {
    const AdminValidator = z.object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        })
        .min(3, "Name must be at least of 3 character")
        .max(20, "Name must be no more than of 20 character"),
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a valid string",
        })
        .email()
        .min(13, "Email must be at least 13 characters long"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(15, "Password must be no longer than 20 characters"),
    });

    const ValidationResult = AdminValidator.safeParse(req.body);

    if (!ValidationResult.success) {
      return res.status(300).json({
        success: false,
        message: "Invalid Input Format!",
        Error: ValidationResult.error.issues[0].message,
      });
    }
    const { email, name, password } = ValidationResult.data;
    // console.log("Data : ",{email,name,password});
    if (email && name && password) {
      let hashPass = await bcrypt.hash(password, 10);
      console.log("Hash : ", hashPass);
      const admin = await Admin.create({
        name: name,
        password: hashPass,
        email: email,
      });
      const payload = {
        adminId:admin.adminId,
        name: admin.name,
        email: admin.email,
      };
      return res
        .status(200)
        .json({ success: true, message: "OK", Admin: payload });
    }
    return res.status(401).json({ success: false, message: "Missing fields!" });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.Signin = async (req, res) => {
  try {
    const AdminValidator = z.object({
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a valid string",
        })
        .email()
        .min(13, "Email must be at least 13 characters long"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
        .max(15, "Password must be no longer than 20 characters"),
    });

    const ValidationResult = AdminValidator.safeParse(req.body);

    if (!ValidationResult.success) {
      return res.status(300).json({
        success: false,
        message: "Invalid Input Format!",
        Error: ValidationResult.error.issues[0].message,
      });
    }
    const { email, password } = ValidationResult.data;
    if(email && password) {
        const isAdminExist = await Admin.findOne({where:{email:email}});
        if(isAdminExist == null) {
            return res.status(403).json({
                success:false,
                message:'Admin with email not found'
            });
        }
        console.log("isAdminExits -> ",isAdminExist);
        const isPassMatched = await bcrypt.compare(password, isAdminExist.password);
        console.log("isPassMatched -> ",isPassMatched);
        if(!isPassMatched){
            return res.status(403).json({
                success:false,
                message:'Incorrect Password!'
            });
        }
        const token = jwt.sign({email:isAdminExist.email,name:isAdminExist.name,adminId:isAdminExist.adminId},process.env.JWT_SECRET);
        if(!token){
            return res.status(403).json({
                success:false,
                message:'token is empty'
            });
        }
        return res.cookie('token',token).status(200).json({
            success:true,
            message:'Admin loggedin successfully!'
        });
    }
     throw new Error('Email or password is empty!');
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};