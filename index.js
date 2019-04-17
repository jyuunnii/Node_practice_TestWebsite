var express=require('express');
var path=require('path');
var app=express();

app.set("view engine", 'ejs'); //viewengine으로 ejs 사용 선언
app.use(express.static(path.join(__dirname,'public')));

var data={count:0}; //서버에 저장_>종료될때까 값 유
app.get('/', function(req,res){
  data.count++;
  res.render('first_ejs',data); //'/'라우터에 get 신호가 오면 data 오브젝트에  cnt 1 증가하고 오브젝트를 넣어서 ejs 렌더
});
app.get('/reset', function(req,res){
  data.count=0;
  res.render('first_ejs',data);
});
app.get('/set/count', function(req,res){
  if(req.query.count) data.count=req.query.count;
  res.render('first_ejs',data); // count query가 있는지 확인하고 대입후 렌딩 *query는 주소표시줄에 ?,&를 사용하여 값을 넣는 것
});
app.get('/set/:num', function(req,res){ //:num에는 아무값이나 대입 가능
  data.count=req.params.num;
  res.render('first_ejs',data);
});
//localhost:3000/set/count?count=입력값 으로 사용!

app.get('/', function(req,res){
  res.render('first_ejs');
})

app.listen(3000, function(){
  console.log('Server On!');
});
