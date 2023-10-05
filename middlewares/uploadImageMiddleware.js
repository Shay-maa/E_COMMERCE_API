const multer = require("multer");
const apiError = require("../utils/apiErrors");

const multerOptions = () => {
  // const multerStorage = multer.diskStorage({
  //     destination:function(req,file,cb){
  //         cb(null, "uploads/category");
  //     },
  //     filename:function(req,file,cb){
  //         const ext = file.mimetype.split('/')[1];
  //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`

  //     cb(null,filename);
  //     }
  // })

  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Only image allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixFields = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
