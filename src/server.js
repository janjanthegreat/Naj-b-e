import express from 'express';
import { MongoClient, ReturnDocument, ServerApiVersion } from 'mongodb';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOCAL HOST PATH
// const credentials = JSON.parse(
//     fs.readFileSync('./credentials.json')
// );

// Read the credentials file from Render's Secret Files location
const credentialsPath = '/etc/secrets/credentials.json';
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});
 
let db; 

async function connectToDB(){
    const uri = !process.env.MONGODB_USERNAME 
    ? 'mongodb://127.0.0.1:27017'
    : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xwyvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    

    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        useUnifiedTopology: true,  // Ensures that you use a unified topology
        ssl: true,  // Enforces SSL connection
        tlsAllowInvalidCertificates: true, // If you are unsure about cert validation
      });

    await client.connect();
    db = client.db('full-stack-react-db');
}

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
})


app.get('/api/articles/:name', async function(req, res) {
    const { name } = req.params;
    console.log('Received name:', name); // Log the received name from the URL

    // Search for both 'articleName' and 'name'
    const article = await db.collection('articles').findOne({name});

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    console.log('Article found:', article); // Log the found article
    res.json({
        upvotes: article.upvotes,
        comments: article.comments,
        upvoteIds: article.upvoteIds || [], // Ensure upvoteIds is included
    });
});


app.use(async function(req, res, next) {
    const { authtoken } = req.headers;
    
    if(authtoken){
        const user = await admin.auth().verifyIdToken(authtoken);
        req.user = user;
        next();
    } else {
        res.sendStatus(400);
    } 

})


app.post('/api/articles/:name/upvote', async function(req, res) {   

    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne( { name }); 

    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if(canUpvote){
        const updatedArticle = await db.collection('articles').findOneAndUpdate(
            { name },
            { 
                $inc: { upvotes: 1},
                $push: { upvoteIds: uid },
            }, 
            { returnDocument: "after", }
        );
    
        res.json(updatedArticle);
    } else {
        res.sendStatus(403);
    }



});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    const newComment = { postedBy, text };
    
    const updatedArticle = await db.collection('articles').findOneAndUpdate(
        { name },
        { $push: { comments: newComment }},
        { returnDocument: 'after'} 
    );

    res.json(updatedArticle);

})


// app.get('/hello', function(req, res) {
//     res.send('Hello there!');
// });

// app.get('/hello/:x', function(req, res){
//     res.send('Hey ' + req.params.x);
// })

// app.post('/hello', function(req, res) {
//     res.send('Hello ' + req.body.name + ' from post endpoint!');
// });


const PORT = process.env.PORT || 8000;

async function start(){
 

    await connectToDB();

    app.listen(PORT, function(){
        console.log(`Server is listening on port ${PORT}`);
    });
    
    app.get('/', (req, res) => {
        res.send('Server is running');
    });

}

start();


