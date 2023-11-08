const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;

require('dotenv').config();
app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}))


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
    const sitCollection = client.db("roomDB").collection("sitCollection");
    const bookingCollection = client.db("roomDB").collection("bookingCollection");
    const riviewColllection = client.db("roomDB").collection("riviewColllection");





    app.post('/jwt', async (req, res) => {
      const user = req.body;
      console.log('tocken for ', user);
      const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })

        .send({ success: true })

    })

    app.post('/logout', async (req, res) => {
      const user = req.body;
      res.clearCookie('token', { maxAge: 0 }).send({ success: true })
    })



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
//     return res.this.status(401).send({ message: "unauthorized   token " });
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
     const cursor = userCollection.find({});
      const result = await cursor.toArray()
      res.send(result)
 })
//  review 
 app.post('/riview', async(req, res) =>{
      const newsit = req.body;
      console.log(newsit)
      const result = await riviewColllection.insertOne(newsit); 
      res.send(result)
    })
app.get('/riview', async(req, res) =>{
      const cursor = riviewColllection
.find();
      const result = await cursor.toArray()
      res.send(result)
    })

 
 app.get('/roomSit/:id', async(req, res)=>{
  const commonId = req.params.id;
     const rooms = await sitCollection.find({commonId:commonId}).toArray();
     res.send(rooms)
 })
 app.get('/rooms/:id', async(req, res)=>{
  const Id = req.params.id;
  const query = {roomId:Id};
     const result = await userCollection.findOne(query);
     res.send(result)
 })

  app.post('/myBooking', async(req, res) =>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking); 
      res.send(result)
  });
   app.get('/myBooking/:id', async (req, res) => {
      const email = req.params.id;
      const query = {userEmail:email}
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })
  app.delete('/myBooking/:id', async (req, res) => {
      const id  = req.params.id;
     const query = {_id: new ObjectId (id)}
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
      ;
    })
app.get('/myBooking/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.findOne(query)
      res.send(result)
     
    })

    app.put('/myBooking/:id', async(req , res) => {
      console.log('hello');
    const id = req.params.id;
    const product = req.body;
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true} ;
      const updateProduct = {
        $set:{
      name:product.roomSize,
      type:product.prices,
      price:product.sitId,
      photo:product.Image,
      
        }
      }
      const result = await bookingCollection.updateOne(filter, updateProduct, option)
      res.send(result)
   })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send("Hotel is running and Rafi vai is happy...........................")
})
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
})
