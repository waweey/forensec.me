const admin = require('firebase-admin');

// Only initialize once
if (!admin.apps.length) {
  const serviceAccount = require('./service-account.json');

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
