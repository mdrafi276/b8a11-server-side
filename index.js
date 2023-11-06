const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { JsonWebTokenError } = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6eaz3fu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const  userCollection = client.db("roomDB").collection("userCollection");



// app.post("/jwt", logger, (req, res) => {
//       const user = req.body;
//       const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "1hr",
//       });
//       res
//         .cookie("token", token, {
//           httpOnly: true,
//           secure: false,
//         })
//         .send({ success: true });
//     });

//    const logger = (req, res, next) => {
//   console.log("we are at", req.host, req.originalUrl);
//   next();
// };



// const verifyToken = (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.this.status(401).send({ message: "token nai " });
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
//     if (error) {
//       return res.this.status(401).send({ message: "token e Problem ache vai" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

     
 app.get('/rooms', async(req, res)=>{
     const cursor = userCollection.find();
      const result = await cursor.toArray()
      console.log(result);
      res.send(result)
 })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("Hotel is running and Rafi vai is happy...........................")
})
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
})
