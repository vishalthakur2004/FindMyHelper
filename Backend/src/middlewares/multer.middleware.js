import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // console.log('file', file)
        cb(null, file.fieldname + '-' + uniqueSuffix)
        // better to add something so that if file of same name comes they do not overwrite each other
    }
})
  
export const upload = multer({ storage: storage })