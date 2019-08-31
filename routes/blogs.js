
var express = require('express');
var multer = require('multer');
var sharp = require('sharp');
var path = require('path')

var router = express.Router();


// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname)
//   }
// })

//orignal file
// var storage = multer.diskStorage({
//     destination:'./public/uploads',
//     filename: function(req, file, cb){
//         cb(null,file.fieldname + ' - ' + Date.now() + 
//         Path.extname(file.originalname));
//     }
// })




//we create variable and inside we can create object for multiple files upload
// var upload = multer({ 
//     storage: storage ,
//     limits: { fileSize: '5mb' }
// })// .single('blogimage');//we can also enter our single image function here or in the route, after you called the rout path 



/* GET create blog. */
router.get('/create', function(req, res, next) {
  res.render('create', {title: 'Create Blog'});
});

router.get('/home', function(req, res, next) {
    res.render('home', {title: 'Create Blog'});
  });






/*single file upload*/
// router.post('/upload', upload.single('blogimage'), function(req, res, next) {
//   //if you would like to store in database then we should enter the filename.if you not then we leave it without filename
//     var fileinfo = req.file;
//   var title = req.body.title;
//   console.log(title);
//   res.send(fileinfo);
// })

/*multiple files upload*/
// router.post('/uploads', upload.array('blogimage', 2), function(req, res, next) {
//   var fileinfo = req.files;
//   var title = req.body.title;
//   console.log(req.files);
//   res.redirect('create');
//  })



var upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback) { callback(null, './public/uploads'); },
        filename: function(req, file, callback) { 
            
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
        
            
        }
    }),
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback( /*res.end('Only images are allowed')*/ null, false)
        }

        callback(null, true)
    }
})
/* we should the upload function and array to upload multiple image but we should choose the number of the files */
router.post('/uploads', upload.array('blogimage', 2), function(req, res, next) {
    let query = req.body;
    if (!req.body && !req.files) {
        res.json({ success: false });
    } else {
        
        sharp(req.files[0].path).resize(162, 117).toFile('./public/uploads'+ '162x117-'+req.files[0].filename, function(err) {
            if (err) {
                console.error('sharp>>>', err)
            }
            console.log('ok okoko')
        })

    }
    res.render('home',{
        file:`./public/uploads${req.files.filename}`
    })
})

module.exports = router;	
