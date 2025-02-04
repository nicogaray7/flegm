import mongoose from 'mongoose';
import { v2 as cloudinaryV2 } from 'cloudinary';

const validateConfigurations = async () => {
  // Validation MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connexion MongoDB réussie');
  } catch (error) {
    console.error('❌ Échec de connexion MongoDB', error);
  }

  // Validation Cloudinary
  try {
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    await cloudinaryV2.api.ping();
    console.log('✅ Configuration Cloudinary validée');
  } catch (error) {
    console.error('❌ Échec de configuration Cloudinary', error);
  }
};

validateConfigurations(); 