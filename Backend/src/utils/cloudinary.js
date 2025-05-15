import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "FindMyHelper" // This ensures files go inside this folder
        });

        fs.unlinkSync(localFilePath); // Remove local file after upload
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
}


const deleteCloudinary = async (fileUrl) => {
    try {
        const parts = fileUrl.split('/');
        const fileName = parts.pop().split('.')[0];
        const folderIndex = parts.findIndex(p => p === "FindMyHelper");

        const folderPath = parts.slice(folderIndex).join('/');
        const publicId = `${folderPath}/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw "Failed deletion on cloudinary";
    }
}


export { 
    uploadCloudinary,
    deleteCloudinary
}
