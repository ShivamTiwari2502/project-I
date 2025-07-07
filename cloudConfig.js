const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// below piece of is written by ourself, the info we save in .env file, these name are set same for config
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust_dev',
    allowedFormats : ["png", "jpg", "jpeg"],
  },
});

module.exports = {cloudinary, storage,};