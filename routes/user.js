const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const User = require('../model/user');
const { findById } = require('../model/user');

// Post method 
router.post('/', upload.single('image'), async(req,res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Creating an instance of User from model/user.js "User"
        let user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id,
        });

        // Save into the MongoDB
        await user.save();
        res.json(user);
    } catch (error) {
        res.send('Image Not Uploaded')
    }
})

// Get Request for seeing the Data;
router.get('/', async(req,res)=>{
    try {
        let user = await User.find();
        res.json(user);
    } catch (error) {
        res.send('No data found')
    }
})

// Delete by Id;
router.delete('/:id',async(req,res)=>{
    try {
        let user = await User.findById(req.params.id);
        // Delete from Cloudinary;
        await cloudinary.uploader.destroy(user.cloudinary_id);

        // Delete user from MongoDB
        await user.remove();
        res.json(user);
    } catch (error) {
        res.send('User not Deleted');
    }
})

// Find Individual user by Id;
router.get('/:id',async(req,res)=>{
    try {
        let user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.send('User not Found individually');
    }
})

// Updating the User name , Photo
router.put('/:id', upload.single("image"), async(req,res)=>{
    try {
        let user = await User.findById(req.params.id);
        await cloudinary.uploader.destroy(user.cloudinary_id);

        // Upload image to cloudinary
        let result
        if(req.file){
            result = await cloudinary.uploader.upload(req.file.path);
        }
       
        const data = {
            name: req.body.name || user.name,
            avatar: result?.secure_url || user.avatar,
            cloudinary_id: result?.public_id || user.cloudinary_id,
        };
        user = await User.findByIdAndUpdate(req.params.id, data,{new: true})
        res.json(user);
    } catch (error) {
        res.send('Not Updated');
    }
})

module.exports = router;