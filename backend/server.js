const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>res.send("GigShield Running"));

// REGISTER
app.post("/register",(req,res)=>{
 const {name,phone,zone,upi,income} = req.body;

 db.run(
  `INSERT INTO workers (name,phone,zone,upi,income) VALUES (?,?,?,?,?)`,
  [name,phone,zone,upi,income],
  function(err){
    if(err) return res.status(500).json({error:String(err)});
    res.json({id:this.lastID});
  }
 );
});

// GET USERS
app.get("/workers",(req,res)=>{
 db.all("SELECT * FROM workers",[],(e,r)=>{
   if(e) return res.status(500).json({error:String(e)});
   res.json(r||[]);
 });
});

// GET LATEST POLICY (SAFE JSON)
app.get("/policy/:id",(req,res)=>{
 db.get(
  `SELECT * FROM policies WHERE worker_id=? ORDER BY id DESC LIMIT 1`,
  [req.params.id],
  (e,r)=>{
    if(e) return res.status(500).json({error:String(e)});
    if(!r) return res.json(null);
    res.json(r);
  }
 );
});

// CREATE POLICY — ENFORCE SINGLE ACTIVE
app.post("/create-policy",(req,res)=>{
 const {worker_id,plan} = req.body;

 db.get(
  `SELECT * FROM policies WHERE worker_id=? ORDER BY id DESC LIMIT 1`,
  [worker_id],
  (e,existing)=>{

   if(e) return res.status(500).json({error:String(e)});

   // ❗ block if active exists
   if(existing && new Date(existing.end_date) > new Date()){
     return res.json({error:"Active policy already exists"});
   }

   const premium = {basic:35,standard:50,premium:80}[plan];
   const max_cap = {basic:500,standard:900,premium:1500}[plan];

   const start = new Date();
   const end = new Date();
   end.setDate(end.getDate()+7);

   db.run(
    `INSERT INTO policies (worker_id,plan,premium,max_cap,start_date,end_date,status)
     VALUES (?,?,?,?,?,?,?)`,
    [worker_id,plan,premium,max_cap,start.toISOString(),end.toISOString(),'active'],
    function(err){
      if(err) return res.status(500).json({error:String(err)});
      res.json({premium,max_cap});
    }
   );
  }
 );
});

// TRIGGER — CAP + HISTORY (ALWAYS INSERT, RETURN AFTER INSERT)
app.post("/trigger",(req,res)=>{
 const {type,zone,hours,worker_id} = req.body;

 db.get(`SELECT * FROM workers WHERE id=?`,[worker_id],(e,worker)=>{
  if(e || !worker) return res.json({claims:[]});

  if(String(worker.zone).toLowerCase() !== String(zone).toLowerCase()){
    return res.json({claims:[]});
  }

  db.get(
   `SELECT * FROM policies WHERE worker_id=? ORDER BY id DESC LIMIT 1`,
   [worker_id],
   (e,policy)=>{
    if(e || !policy) return res.json({claims:[]});

    if(new Date(policy.end_date) < new Date()){
      return res.json({claims:[]});
    }

    const income = Number(worker.income)||0;
    const hrs = Number(hours)||0;
    let payout = (income/10) * hrs;

    // sum of existing claims (this week — since only one active policy exists)
    db.all(`SELECT amount FROM claims WHERE worker_id=?`,[worker_id],(e,rows)=>{
      const total = (rows||[]).reduce((s,r)=>s + (Number(r.amount)||0),0);

      // cap check
      if(total + payout > policy.max_cap){
        db.run(
          `INSERT INTO claims (worker_id,type,amount,hours,zone,status)
           VALUES (?,?,?,?,?,?)`,
          [worker_id,type,0,hrs,zone,'rejected: cap exceeded'],
          function(){
            return res.json({claims:[{payout:0,reason:"cap exceeded"}]});
          }
        );
        return;
      }

      db.run(
        `INSERT INTO claims (worker_id,type,amount,hours,zone,status)
         VALUES (?,?,?,?,?,?)`,
        [worker_id,type,payout,hrs,zone,'approved'],
        function(){
          res.json({claims:[{payout}]});
        }
      );
    });
   }
  );
 });
});

// CLAIMS
app.get("/claims",(req,res)=>{
 db.all("SELECT * FROM claims ORDER BY id DESC",[],(e,r)=>{
   if(e) return res.status(500).json({error:String(e)});
   res.json(r||[]);
 });
});

app.listen(3000,()=>console.log("Server running"));