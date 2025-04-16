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
    posts = [];
  }

  posts.unshift(post); // add new post to the top
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, post })
  };
};
