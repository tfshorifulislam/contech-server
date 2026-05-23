const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT
const uri = process.env.MONGO_URI;


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

        const db = client.db('novis-server')
        const collectionNorvis = db.collection('norvis')
        
        // ========== check connection ==========
        app.get('/', (req, res) => {
            res.send('server is running!')
        })

        //========== all posts get ==========
        app.get('/posts', async (req, res) => {
            const result = await collectionNorvis.find().toArray()
            res.send(result)
        })



        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
