const User = require("../models/User");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.Signup = async (req, res) => {
  // console.log('Inside User signup controller!');
  try {
    const UserValidator = z.object({
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

    const ValidationResult = UserValidator.safeParse(req.body);

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
      const user = await User.create({
        name: name,
        password: hashPass,
        email: email,
      });
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      return res
        .status(200)
        .json({ success: true, message: "OK", user: payload });
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
    const UserValidator = z.object({
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

    const ValidationResult = UserValidator.safeParse(req.body);

    if (!ValidationResult.success) {
      return res.status(300).json({
        success: false,
        message: "Invalid Input Format!",
        Error: ValidationResult.error.issues[0].message,
      });
    }
    const { email, password } = ValidationResult.data;
    if(email && password) {
        const isUserExist = await User.findOne({where:{email:email}});
        if(isUserExist == null) {
            return res.status(403).json({
                success:false,
                message:'User with email not found'
            });
        }
        console.log("isUserExits -> ",isUserExist);
        const isPassMatched = await bcrypt.compare(password, isUserExist.password);
        console.log("isPassMatched -> ",isPassMatched);
        if(!isPassMatched){
            return res.status(403).json({
                success:false,
                message:'Incorrect Password!'
            });
        }
        const token = jwt.sign({email:isUserExist.email,name:isUserExist.name,id:isUserExist.id},process.env.JWT_SECRET);
        if(!token){
            return res.status(403).json({
                success:false,
                message:'token is empty'
            });
        }
        return res.cookie('token',token).status(200).json({
            success:true,
            message:'User loggedin successfully!'
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