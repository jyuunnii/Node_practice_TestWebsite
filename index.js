var express=require('express');
var path=require('path');
var app=express();
var mongoose=require('mongoose');
//DB connection
mongoose.connect(process.env.MONGO_DB);

var db=mongoose.connection;
db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(err){
  console.log("DB ERROR: ", err);
});
//Schema, Model
var dataSchema = mongoose.Schema({
  name: String,
  count:Number
});

var Data=mongoose.model('data', dataSchema); //model 변수는 대문자(첫)
Data.findOne({name:"myData"}, function(err,data){
  if(err) return console.log("Data ERROR: ", err);
  if(!data){
    Data.create({name: "myData", count:0}, function(err, data){
      if(err) return console.log("Data ERROR: ", err);
      console.log("Counter initialized: ", data);
    });
  }
});


app.set("view engine", 'ejs'); //viewengine으로 ejs 사용 선언
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req,res){
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR: ", err);
    data.count++;
    data.save(function(err){
      if(err) return console.log("Data ERROR: ", err);
      res.render('first_ejs', data);
    });
  });
});

app.get('/reset', function(req,res){
  setCounter(res, 0);
});
app.get('/set/count', function(req,res){
  if(req.query.count) setCounter(res,req.query.count);
  else getCounter(res); // count query가 있는지 확인하고 대입후 렌딩 *query는 주소표시줄에 ?,&를 사용하여 값을 넣는 것
});
app.get('/set/:num', function(req,res){ //:num에는 아무값이나 대입 가능
  if(req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});
//localhost:3000/set/count?count=입력값 으로 사용!

function setCounter(res, num){
  console.log("setCounter");
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR: ", err);
    data.count=num;
    data.save(function(err){
      if(err) return console.log("Data ERROR: ", err);
      res.render('first_ejs', data);
    });
  });
}
function getCounter(res){
  console.log("getCounter");
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data ERROR: ", err);
    res.render('first_ejs', data);
  });
}
app.get('/', function(req,res){
  res.render('first_ejs');
})

app.listen(3000, function(){
  console.log('Server On!');
});
