const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

// Generate tracking ID
function generateTrackingId() {
  const prefix = "DEL";
  const date = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const randomBytes = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `${prefix}-${date}-${randomBytes}`;
}

const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./delivery-app-service.json");


const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8');

const serviceAccountObj = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Auth Middleware
const verifFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decodedEmail = decoded.email;
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  next();
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decodedEmail;
  const user = await userCollection.findOne({ email });
  if (!user || user.role !== 'admin') {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  next();
};

const verifyRider = async (req, res, next) => {
  const email = req.decodedEmail;
  const user = await userCollection.findOne({ email });
  if (!user || (user.role !== 'rider' && user.role !== 'admin')) {
    return res.status(403).send({ message: 'Forbidden access' });
  }
  next();
};

// MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let parcelCollection, paymentCollection, userCollection, riderCollection, trackingCollection;

async function connectDB() {
  //await client.connect();
  const db = client.db("delivery");
  parcelCollection = db.collection("parcels");
  paymentCollection = db.collection("payments");
  userCollection = db.collection("users");
  riderCollection = db.collection("riders");
  trackingCollection = db.collection("tracking");
}

connectDB();

// Tracking Logger
const logTracking = async (trackingId, status, email, pickupEmail = 'None') => {
  const log = {
    trackingId,
    status,
    updatedBy: email,
    pickedupBy: pickupEmail,
    createdAt: new Date()
  };
  await trackingCollection.insertOne(log);
};

// ------------------------------
// ROUTES
// ------------------------------

app.get('/users', verifFirebaseToken, async (req, res) => {
  res.send(await userCollection.find().toArray());
});

app.get('/users/:email', verifFirebaseToken, async (req, res) => {
  const email = req.params.email;
  if (email !== req.decodedEmail) return res.status(403).send({ message: 'Forbidden access' });
  res.send(await userCollection.findOne({ email }));
});

app.patch('/users/:id', async (req, res) => {
  const result = await userCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { role: req.body.role } }
  );
  res.send(result);
});

app.get('/users/:email/role', verifFirebaseToken, async (req, res) => {
  const email = req.params.email;
  if (email !== req.decodedEmail) return res.status(403).send({ message: 'Forbidden access' });
  const user = await userCollection.findOne({ email });
  res.send({ role: user?.role || 'user' });
});

app.post('/users', async (req, res) => {
  const user = req.body;
  user.role = 'user';
  user.createdAt = new Date();

  const existing = await userCollection.findOne({ email: user.email });
  if (existing) return res.send({ message: 'User already exists' });

  res.send(await userCollection.insertOne(user));
});

app.get('/parcels', async (req, res) => {
  const query = {};
  if (req.query.senderName) query.senderName = req.query.senderName;
  res.send(await parcelCollection.find(query).toArray());
});

app.get('/parcels/:id', async (req, res) => {
  res.send(await parcelCollection.findOne({ _id: new ObjectId(req.params.id) }));
});

app.post('/parcels', async (req, res) => {
  res.send(await parcelCollection.insertOne(req.body));
});

app.delete('/parcels/:id', async (req, res) => {
  res.send(await parcelCollection.deleteOne({ _id: new ObjectId(req.params.id) }));
});

// ------------------------------
// PAYMENT
// ------------------------------

app.patch('/payment-success', async (req, res) => {
  const sessionId = req.query.session_id;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const transactionId = session.payment_intent;

  const exists = await paymentCollection.findOne({ transactionId });
  if (exists) return res.send({ message: "Payment already processed" });

  if (session.payment_status === "paid") {
    const parcelId = session.metadata.parcelId;
    const trackingId = generateTrackingId();

    await paymentCollection.insertOne({
      amount: session.amount_total / 100,
      currency: session.currency,
      parcelId,
      transactionId,
      paymentDate: new Date(),
      paymentStatus: "paid",
      customerEmail: session.customer_email
    });

    await parcelCollection.updateOne(
      { _id: new ObjectId(parcelId) },
      { $set: { paymentStatus: "paid", deliveryStatus: "pending", trackingId } }
    );

    // Log track start
    await logTracking(trackingId, "pending", session.customer_email);
  }

  res.send({ success: true });
});

app.post('/create-checkout-session', async (req, res) => {
  const info = req.body;
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: info.id },
        unit_amount: Math.round(info.cost * 100),
      },
      quantity: 1
    }],
    customer_email: info.senderEmail,
    mode: "payment",
    metadata: { parcelId: info.id },
    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-failed`,
  });

  res.send({ url: session.url });
});

// ------------------------------
// RIDER SYSTEM
// ------------------------------

app.get('/pending-parcels', verifFirebaseToken, verifyRider, async (req, res) => {
  res.send(await parcelCollection.find({ deliveryStatus: "pending" }).toArray());
});

app.post('/rider', async (req, res) => {
  const rider = req.body;
  const exists = await riderCollection.findOne({ email: rider.email });
  if (exists) return res.send({ message: "Rider application already submitted" });

  rider.status = "pending";
  rider.appliedAt = new Date();

  res.send(await riderCollection.insertOne(rider));
});

app.get('/riders', async (req, res) => {
  const query = req.query.status ? { status: req.query.status } : {};
  res.send(await riderCollection.find(query).toArray());
});

app.patch('/riders/:id', async (req, res) => {
  const { status, email } = req.body;
  const id = req.params.id;

  await riderCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );

  if (status === "approved") {
    await userCollection.updateOne(
      { email },
      { $set: { role: "rider" } }
    );
  }

  res.send({ success: true });
});

// ------------------------------
// PICK & DELIVER PARCEL
// ------------------------------

app.patch('/pick-parcel/:id', verifFirebaseToken, verifyRider, async (req, res) => {
  const riderEmail = req.decodedEmail;
  const id = req.params.id;

  const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });

  if (!parcel || parcel.deliveryStatus !== "pending") {
    return res.status(400).send({ message: "Parcel not available for pickup" });
  }

  await parcelCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        deliveryStatus: "picked",
        riderEmail,
        pickedAt: new Date()
      }
    }
  );

  await logTracking(parcel.trackingId, "picked", parcel.senderEmail, riderEmail);

  res.send({ success: true });
});

app.patch('/deliver-parcel/:id', verifFirebaseToken, verifyRider, async (req, res) => {
  const riderEmail = req.decodedEmail;
  const id = req.params.id;

  const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });

  if (!parcel || parcel.deliveryStatus !== "picked" || parcel.riderEmail !== riderEmail) {
    return res.status(400).send({ message: "Parcel cannot be delivered by you" });
  }

  await parcelCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        deliveryStatus: "delivered",
        deliveredAt: new Date()
      }
    }
  );

  await logTracking(parcel.trackingId, "delivered", parcel.senderEmail, riderEmail);

  res.send({ success: true });
});

// ------------------------------
// TRACKING HISTORY
// ------------------------------

app.get('/tracking/:trackingId', verifFirebaseToken, async (req, res) => {
  const trackingId = req.params.trackingId;
  const userEmail = req.decodedEmail;

  const parcel = await parcelCollection.findOne({ trackingId });

  if (!parcel) {
    return res.status(404).send({ message: "Tracking ID not found" });
  }

  const isSender = parcel.senderEmail === userEmail;
  const isRider = parcel.riderEmail === userEmail;

  if (!isSender && !isRider) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  const logs = await trackingCollection
    .find({ trackingId })
    .sort({ createdAt: 1 })
    .toArray();

  res.send(logs);
});

app.listen(3000, () => console.log("Server running on port 3000"));
