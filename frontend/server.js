const express = require('express')
const app = express()
const multer = require('multer')
const fetch = require("node-fetch");
const port = 3000
var FormData = require('form-data');
var fs = require('fs');

const url = "http://ec2-3-20-250-137.us-east-2.compute.amazonaws.com/catdogpredictorapi/v1.0/predict";

app.set('view engine', 'ejs');

app.use(express.static('assets'))
// cb(null, Date.now() + '-' + file.originalname)
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
var upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.render('index', {ok: 'ok'})
})

app.post('/predict', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  const form_data = new FormData();
  form_data.append("file", fs.createReadStream("uploads/" + file.originalname));
  try {
    fetch(url, { method: 'POST', body: form_data })
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        res.render('result', {answer: json.res});
    });
  } catch (error) {
    res.send('Error!');
  }
  
  if (fs.existsSync("uploads/" + file.originalname)) {
    try {
      fs.unlinkSync("uploads/" + file.originalname)
      //file removed
    } catch(err) {
      console.error(err)
    }
  }
})
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})