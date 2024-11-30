import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join( "/var/www/uploads"));
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadprofileImage = upload.single('profileImage');
const uploadCompanyImages = upload.fields([
  // { name: 'companyLogo', maxCount: 1 },
  { name: 'uploadFiles', maxCount: 5 },
]);
const uploadReviewImages = upload.fields([
  { name: 'uploadFiles', maxCount: 5 },
]);

const uploadStarrdImages = upload.fields([
  { name: 'uploadFiles', maxCount: 5 },
]);

export const fileUploader = {
  upload,
  uploadprofileImage,
  uploadCompanyImages,
  uploadReviewImages,
  uploadStarrdImages,
};
