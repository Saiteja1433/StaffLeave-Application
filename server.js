var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var absPath = path.join(__dirname, "/app");

const port = 3178;
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'saitejacp@123',
	database : 'hackathon'

});
connection.connect(function(err){
	console.log("connected");
	console.log('port number is',port)
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'app')));


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('node_modules'));

app.get('/', function(request, response) {
	response.sendFile(absPath + "/staffLogin.html");
});

app.get('/home', function(req,res) {
		res.sendFile(path.join(__dirname + '/app/home.html'));
});


app.get('/adminn', function(req, res){
	res.sendFile(path.join(__dirname + '/app/adminHand.html'));
});
function response(success, message, data) {
    return { success: success, message: message, data: data }
}

app.post('/staffLog',function(request,res){
	var sid = request.body.sid;
	var passwords = request.body.passwords;
	 //console.log(request.body);
	if(sid && passwords){

       connection.query("select  * from staff where staffid ='"+sid+"'",function(err,data,fields){
	if(err){
//	console.log("ssdfsdfsdf");
 	console.log(err);
 	}
 	else{
		 connection.query("select * from leaverequests where staffid= '"+sid+"'",function(err,data1){
			 if(err){
				 throw err;
			 }
			 else{
				for(var i=0;i<data1.length;i++){
					if(data1[i].status==0){
						data1[i].status="Rejected";
					 }		
					 if(data1[i].status==1){
						data1[i].status="Pending";
					 }	
					 if(data1[i].status==2){
						data1[i].status="Granted";
					 }	
				}
				 var finalData={
					 data1:data,
					 data2 :data1
				 }
				 //console.log(finalData);
				res.send(finalData);
			 }
		 });
		 
	}
 })

	} 
})


app.post('/admin',function(request,response){

	connection.query("select * from admindisplay ", function(err,data,fields){
		if(err){
			throw err;																																							
		}
		 else{
			response.send(data);
		 }
	})  
})


app.post('/leaveApp',function(request,response){
	console.log(request.body);

	//   if(){

	//   }
	connection.query("insert into leaverequests(staffname,staffid,leavesleft,reason,noofdays) values('"+request.body.name+"','"+request.body.staffid+"','"+request.body.leavesleft+"','"+request.body.msg+"','"+request.body.noofdays+"')",function(err,data){
		if(err){
			throw err;
		}
		else{
			connection.query("insert into admindisplay(staffname,staffid,leavesleft,reason,noofdays,leavesused) values('"+request.body.name+"','"+request.body.staffid+"','"+request.body.leavesleft+"','"+request.body.msg+"','"+request.body.noofdays+"','"+request.body.leavesused+"')");
		    response.send(request.body.name);
	     	console.log(data);
				//response.redirect('/home');
		}
	})
})

app.post('/makeDec',function(request,response){
    connection.query("UPDATE leaverequests SET status = '"+request.body.num+"' WHERE (sno = '"+request.body.sno+"')",function(err){
		if(err){
			throw err;
		}
		else{
			console.log(request.body.details);
			if(request.body.num==2){
				console.log(request.body);
				var noofdays=request.body.details.leavesleft-request.body.details.noofdays;
				console.log(noofdays);
				 var leavesused = request.body.details.leavesused+request.body.details.noofdays 
				connection.query("update staff set leavesremaining='"+noofdays+"', leavesused ='"+leavesused+"'  where (staffid ='"+request.body.details.staffid+"')");
			}
		//	console.log(request.body.sno)
			connection.query("DELETE FROM admindisplay WHERE (sno = '"+request.body.sno+"')",function(err){
				if(err){
					throw err;
				}
				else{
					var daata={
						suc:"success"
					}
             response.redirect('/home');
				}
			});
			console.log("success");
		}
	})
	console.log(request);
})

app.post('/registerfac',function(request,response){
	console.log(request.body);
	 connection.query(" insert into staff(name,staffid,password,mobileno) values('"+request.body.name+"','"+request.body.staffid+"','"+request.body.password+"','"+request.body.mobileno+"')",function(err){
		 if(err){
			 response.send(err);
		 }else{
			 response.send("success");
		 }
	 })
})


app.post('/displaydetails',function(request,response){

	connection.query("select * from staff ", function(err,data,fields){
		if(err){
			throw err;																																							
		}
		 else{
			response.send(data);
		 }
	})  
})



app.listen(port);
console.log('done!!!!');


