const express=require('express');
const app=express();
const ejs=require('ejs');
const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const path=require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//creating connection!!!
let user=()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}
//gettting 100 users !!!!
let all_users=[];
for(let i=1;i<=100;i++){
    all_users.push(user());
}

const conn=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'my_database',
  password:'cvr123'
});

console.log("connection successful");
// try{
//     let q="insert into users values ?";
//     conn.query(q,[all_users],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//     })
// }catch(err){
//     console.log("error in database");
// }


app.get("/",(req,res)=>{
    try{
        let q="select count(*) from users";
        conn.query(q,(err,result)=>{
            if(err) throw err;
            let count;
            count=result[0]['count(*)'];
            res.render("home.ejs",{count});
        })
    }catch(err){
        console.log("error in database");
    }
})


app.get("/users",(req,res)=>{
    try{
        let q="select * from users";
        conn.query(q,(err,result)=>{
            if(err) throw err;
            res.render("index.ejs",{result})
        })
    }catch(err){
        console.log("error in database");
    }
})


app.get("/users/update/:id",(req,res)=>{
    let id=req.params.id;
    res.render("update.ejs",{id});
})


app.post("/users/update/:id",(req,res)=>{
    console.log(req.body);
    try{
        let q=`update users set username=? where password=? and id=?`;
        conn.query(q,[req.body.username,req.body.password,req.params.id],(err,result)=>{
            if(err) throw err;
            console.log(result)
            if(result.affectedRows===0){
                res.send("Incorrect password");
            }else{
                setTimeout(()=> {
                    res.redirect("/users");
                },5000)
            }
        })
    }catch(err){
        console.log(err);
    }
})
app.listen(8081,()=>{
    console.log("hiii");
})