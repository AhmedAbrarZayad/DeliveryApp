const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

function generateTrackingId() {
  const prefix = "DEL";
  const date = new Date().toISOString().slice(0,10).replace(/-/g,""); // YYYYMMDD
  // Generate 8 random bytes and convert to hex
  const randomBytes = crypto.randomBytes(8).toString('hex').toUpperCase(); // 16 chars
  // Add a prefix if you want, e.g., "PKG"
  const trackingId = `${prefix}-${date}-${randomBytes}`;
  return trackingId;
}
const app = express();
var admin = require("firebase-admin");

const serviceAccount = require("./delivery-app-service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// middleware
app.use(cors());
app.use(express.json());

const verifFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  try{
    const idToken = token;
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.decodedEmail = decoded.email;
  }catch(err){
    return res.status(401).send({ message: 'Unauthorized' });
  }
  next();
}

const verifyAdmin = async (req, res, next) => {
  const email = req.decodedEmail;
  const user = await userCollection.findOne({ email: email });
  if (!user || user?.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  next();
}

const verifyRider = async (req, res, next) => {
  const email = req.decodedEmail;
  const user = await userCollection.findOne({ email:email });
  if (!user || (user?.role !== 'rider' && user?.role !== 'admin')) {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  next();
}

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { stat } = require('fs');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let parcelCollection; // will be set after connection
let paymentCollection; // will be set after connection
let userCollection; // will be set after connection
let riderCollection; // will be set after connection
async function connectDB() {
  try {
    // Connect ONCE
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("delivery");
    parcelCollection = db.collection("parcels");
    paymentCollection = db.collection("payments");
    userCollection = db.collection("users");
    riderCollection = db.collection("riders");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectDB(); // Call once at startup

// ----------------------
// ROUTES
// ----------------------

app.get('/users', verifFirebaseToken, async (req, res) =>{
  const users = await userCollection.find().toArray();
  res.send(users);
});
app.get('/users/:email', verifFirebaseToken, async (req, res) =>{
  const email = req.params.email;
  console.log("Decoded email:", req.decodedEmail);
  if(email !== req.decodedEmail){
    return res.status(403).send({ message: 'Forbidden access' });
  }
  const query = { email: email };
  const user = await userCollection.findOne(query);
  res.send(user);
});

app.patch('/users/:id', async (req, res) => {
  const id = req.params.id;
  const role = req.body.role;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      role: role
    }
  }
  const result = await userCollection.updateOne(query, update);
  res.send(result);
});

app.get('/users/:email/role', verifFirebaseToken, async (req, res) =>{
  const email = req.params.email;
  if(email !== req.decodedEmail){
    return res.status(403).send({ message: 'Forbidden access' });
  }
  const query = { email: email };
  const user = await userCollection.findOne(query);
  res.send({ role: user?.role || 'user' });
});

app.post('/users', async (req, res) =>{
  const user = req.body;
  user.role = 'user';
  user.createdAt = new Date();
  const email = user.email;
  const query = { email: email };
  const existingUser = await userCollection.findOne(query);
  if(existingUser){
    console.log("User already exists:", email);
    return res.send({ message: 'User already exists' });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
})

app.get('/parcels', async (req, res) => {
  const query = {};
  const name = req.query.senderName;
  if (name) {
    query.senderName = name;
  }
  const parcels = await parcelCollection.find(query).toArray();
  res.send(parcels);
});

app.get('/parcels/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const parcel = await parcelCollection.findOne(query);
  res.send(parcel);
})

app.post('/parcels', async (req, res) => {
  const parcel = req.body;
  const result = await parcelCollection.insertOne(parcel);
  res.send(result);
});

app.delete('/parcels/:id', async (req, res) => {
  const id = req.params.id; 
  const query = { _id: new ObjectId(id) };
  const result = await parcelCollection.deleteOne(query);
  res.send(result);
})

app.patch('/payment-success', async (req, res) => {
  const sessionId = req.query.session_id;
  console.log("Payment success for session:", sessionId);
  // Here you can update your database to mark the payment as successful
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const transactionId = session.payment_intent;
  const query = { transactionId: transactionId };
  const paymentExist = await paymentCollection.findOne(query);
  if(paymentExist){
    return res.send({ message: 'Payment already processed' });
  }
  if(session.payment_status === 'paid'){
    const parcelId = session.metadata.parcelId;
    const query = { _id: new ObjectId(parcelId) };
    const update = {
      $set: {
        paymentStatus: 'paid',
        deliveryStatus: 'pending',
        trackingId: generateTrackingId()
      }
    }
    const payment = {
      amount: session.amount_total / 100,
      currency: session.currency,
      parcelId: parcelId,
      transactionId: session.payment_intent,
      paymentDate: new Date(),
      paymentStatus: 'paid',
      customerEmail: session.customer_email
    }
    await paymentCollection.insertOne(payment);
    await parcelCollection.updateOne(query, update);
  }
  console.log(session);
  res.send({ success: true });
})

app.post('/create-checkout-session', async (req, res) => {
  const paymentInfo = req.body;
  const price = paymentInfo.cost;
  //console.log("Creating checkout session for price:", paymentInfo);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product_data:{
            name: paymentInfo.id,
          },
          unit_amount: Math.round(price * 100)
        },
        quantity: 1,
      },
    ],
    customer_email: paymentInfo.senderEmail,
    mode: 'payment',
    metadata: {
      parcelId: paymentInfo.id
    },
    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-failed`,
  });
  //console.log(session);
  res.send({url: session.url});
});


app.get('/payments', verifFirebaseToken, async (req, res) => {
  console.log("Fetching payments with query:", req.query);
  const email = req.query.email;
  const query = {};
  if(email){
    if(email !== req.decodedEmail){
      return res.status(403).send({ message: 'Forbidden access' });
    }
    query.customerEmail = email;
  }
  const payments = await paymentCollection.find(query).sort({ paymentDate: -1 }).toArray();
  res.send(payments);
});

app.post('/rider', async (req, res) => {
  const rider = req.body;
  const riderExists = await riderCollection.findOne({ email: rider.email });
  if(riderExists){
    return res.send({ message: 'Rider application already submitted' });
  }
  rider.status = 'pending';
  rider.appliedAt = new Date();
  const result = await riderCollection.insertOne(rider);
  res.send(result);
})

app.get('/riders', async (req, res) => {
  const query = {};
  if(req.query.status){
    query.status = req.query.status;
  }
  const riders = await riderCollection.find(query).toArray();
  res.send(riders);
})

app.patch('/riders/:id', async (req, res) => {
  const status = req.body.status;
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      status: status
    }
  }
  const result = await riderCollection.updateOne(query, update);
  if(status === 'approved'){
    const email = req.body.email;
    const userQuery = { email: email };
    console.log("Updating user role to rider for:", email);
    const userUpdate = {
      $set: {
        role: 'rider'
      }
    }
    await userCollection.updateOne(userQuery, userUpdate);
  }
  res.send(result);
})

app.get('/pending-parcels', verifFirebaseToken, verifyRider, async (req, res) => {
  const query = { deliveryStatus: 'pending' };
  const parcels = await parcelCollection.find(query).toArray();
  res.send(parcels);
});

app.patch('/pick-parcel/:id', verifFirebaseToken, verifyRider, async (req, res) => {
  const id = req.params.id;
  const riderEmail = req.decodedEmail;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      deliveryStatus: 'picked',
      riderEmail: riderEmail,
      pickedAt: new Date()
    }
  }
  const chk = await parcelCollection.findOne(query);
  if(chk.deliveryStatus !== 'pending'){
    return res.status(400).send({ message: 'Parcel is not available for pickup' });
  }
  const result = await parcelCollection.updateOne(query, update);
  res.send(result);
})
// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
