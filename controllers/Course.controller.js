const Course = require('../models/Course');
const UserCourse = require('../models/UserCourse');
const {z} = require('zod');


exports.getAllCourses=async(req,res)=>{
   try{
      const courses = await Course.findAll();
    //   console.log('courses : ', courses);
      if(courses.length <=0){
        return res.status(404).json({
            success: false,
            message: 'Courses not found!'
        })
      }
      return res.status(200).json({
        success: true,
        message: 'All courses fetched!',
        courses : courses
      })
   }catch(e){
       return res.status(500).json({
        success: false,
        message: 'Error while fetching courses!'
       })
   }
}

exports.getPurchasedCourses=async(req,res)=>{
  try{
    const user = req.user;
    console.log("User -> ",user);
    if(!user){
        return res.status(404).json({
            success:false,
            message: 'user is empty'
        })
    }
    const courses = await Course.findAll({
        where:{id:user?.id}
    })
    if(!courses){
        return res.status(404).json({
            success:false,
            message: 'No Courses found!'
        })
    }
    return res.status(200).json({
        success:true,
        message: 'courses fetched succesfully!',
        courses: courses
    })
  }catch(e){
    return res.status(500).json({
        success: false,
        message: 'Error while fetching courses'
    })
  }
}

// exports.getAdminCourses=async()=>{

// }

exports.createCourse=async(req,res)=>{
   try{
    const CourseValidator = z.object({
        title: z
          .string({
            required_error: "title is required",
            invalid_type_error: "title must be a valid string",
          })
          .min(8, "title must be at least 8 characters long"),
        description: z
          .string({ required_error: "description is required" })
          .min(20, "description must be at least 20 characters long")
          .max(250, "description must be no longer than 250 characters"),
        price: z
          .number({ required_error: "price is required" }),   
      });
  
      const ValidationResult = CourseValidator.safeParse(req.body);
  
      if (!ValidationResult.success) {
        return res.status(300).json({
          success: false,
          message: "Invalid Input Format!",
          Error: ValidationResult.error.issues[0].message,
        });
      }
      console.log('req.user ->',req.user);
      if(!req.user.adminId){
        return res.status(500).json({
            success: false,
            message: "login to access this route!"
        })
      }
      const adminId = req.user.adminId;
      const { title,description,price } = ValidationResult.data;
      console.log('Inside create course -> ',{adminId,title,description,price});
      if(!adminId || !title || !description) {
        return res.status(401).json({
           success: false,
           message:'All fields are required!' 
        })
      }
      const course = await Course.create({
        title: title,
        description: description,
        price:price,
        adminId: adminId
      });
      console.log('course -> ',course);
      if(!course){
        return res.status(501).json({
            success: false,
            message:'unable to create course!'
        })
      }
      return res.status(200).json({
        success: true,
        message:'course created!',
        course: course
      })
   }catch(e){
    return res.status(500).json({
        success: false,
        message: 'Error while creating course',
        error:e.message
    }) 
   }
}

exports.deleteCourse=async(req,res)=>{
  try{
    const id = req.params.id;
    if(!id){
        return res.status(400).json({
            success: false,
            message: "id is unaccessible"
        })
    }     
    await Course.destroy({
        where:{
            id:id
        }
    }) 

    return res.status(200).json({
        success: true,
        message: "Course deleted successfully!"
    })

  }catch(e){
    return res.status(500).json({
        success: false,
        message: 'Error while deleting course',
        error:e.message
    }) 
  }
}

exports.updateCourse=async(req,res)=>{
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "id is unaccessible"
            })
        }     
        
        const CourseValidator = z.object({
            title: z
              .string({
                invalid_type_error: "title must be a valid string",
              })
              .min(8, "title must be at least 8 characters long").optional(),
            description: z
              .string()
              .min(20, "description must be at least 20 characters long")
              .max(250, "description must be no longer than 250 characters").optional(),
            price: z
              .number().optional(),   
          });
      
          const ValidationResult = CourseValidator.safeParse(req.body);
      
          if (!ValidationResult.success) {
            return res.status(300).json({
              success: false,
              message: "Invalid Input Format!",
              Error: ValidationResult.error.issues[0].message,
            });
          }
        
        const isExist = await Course.findOne({
            where:{id:id}
        })
        
        if(!isExist){
            return res.status(401).json({
                success: false,
                message: 'course with id not exist',
            })
        }

        const {title, description,price} = req.body;

        const updatedCourse = await Course.update(
            { title: title || isExist.title, description: description || isExist.description, price: price || isExist.price},
            {
              where: {
                id: id,
              },
            },
          );

        return res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            updatedCourse:updatedCourse
        })
    
      }catch(e){
        return res.status(500).json({
            success: false,
            message: 'Error while updating course',
            error:e.message
        }) 
      }
}