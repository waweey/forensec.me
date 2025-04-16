const admin = require('firebase-admin');

// 🔐 Parse the service account from Netlify environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_JSON);

// 🛡️ Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' })
    };
  }

  try {
    const post = JSON.parse(event.body);

    const docRef = await db.collection('posts').add(post);
    post.id = docRef.id;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, post })
    };
  } catch (err) {
    console.error('Firestore write error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to write to Firestore' })
    };
  }
};
