const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfsyz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

//All work of send or create data and read or get data from database 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db(`${process.env.DB_NAME}`).collection("networkData");
  const dataCollectionTwo = client.db(`${process.env.DB_NAME}`).collection("networkDataTwo");
  //send all fake data to databse
 app.post('/addVolunteerActivity', (req, res)=>{
     const volunteerActivityData = req.body;
    // console.log(volunteerActivityData);
    dataCollection.insertMany(volunteerActivityData)
    .then(result =>{
      //  console.log(result)
       res.send(result.insertedCount)
    })
 })

 //get all fake data from database
 app.get('/loadVolunteerActivity', (req, res)=>{
   dataCollection.find({}).limit(20)
   .toArray((err, documents)=>{
     res.send(documents)
   })
 })

 //send register data to database
 app.post('/addRegisterData', (req, res) => {
   const registerData = req.body;
   console.log(registerData);
   //console.log(registerData);
  dataCollectionTwo.insertOne(registerData)
  .then(result =>{
    res.send(result.insertedCount > 0)
  })
 })

// get registerd data for specific user
 app.get('/getRegisterData', (req, res) => {
   //console.log(req.query.email);
   dataCollectionTwo.find({email: req.query.email})
   .toArray((err, documents) =>{
     res.send(documents);
   })
 })

 //delete data from database
 app.delete('/deleteActivity/:id', (req, res)=>{
   console.log(req.params.id);
   dataCollectionTwo.deleteOne({_id: ObjectId(req.params.id)})
   .then(result=>{
     res.send(result.deletedCount > 0)
   })
 })

 //get all volunteers data for admin
 app.get('/getAllRegisterData', (req,res) =>{
      dataCollectionTwo.find({})
      .toArray((err, documents) =>{
        res.send(documents)
      })
 })


})
app.get('/', (req, res) =>{
    res.send("hello world");
})


app.listen(process.env.PORT || 5000);