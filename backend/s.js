const express=require ("express");
const app=express()
app.get('/',(req,res)=>{
    res.send("hello")
})
app.get('/login',(req,res)=>{
    res.send("hii savita")
})
app.listen(3000,()=>{

})
