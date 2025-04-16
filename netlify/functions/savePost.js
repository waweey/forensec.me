const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' })
    };
  }

  const post = JSON.parse(event.body);
  const filePath = path.join(__dirname, '..', '..', 'posts.json');
  let posts = [];

  try {
    posts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error('Read error:', err);
    posts = [];
  }

  try {
    posts.unshift(post);
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Write error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not write to posts.json' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, post })
  };
};
