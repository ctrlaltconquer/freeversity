const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const multer  = require('multer'); // Uploaded file handling
const path = require('path');
const session = require("express-session");
const MongoStore = require("connect-mongo");
let geminiData = ""
// const upload = multer({ dest: 'uploads/' }) ;freeversity-storage
let {PythonShell} = require('python-shell');

require('dotenv').config(); // Load variables from config.env into process.env


let projectId="freeversity-414503"
let keyFilename="serviceKey/freeversity-414503-40fb916b37c6.json"

const Multer = multer({
    storage:multer.memoryStorage(),
})
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
    projectId,
    keyFilename
})
const bucket = storage.bucket('freeversity-storage'); //to be defined

// variables for future
let name = "";
let mail = "";
let userName = ""
let imageName = "profileBackground.png";
let updatedImageName = null;
let passwordUpdated = "";


// variables storing Language property
let resultLang = "";
let appeared = "";
let description = "";
let langType = "";
let langcreators = "";
let langwebsite = "";
let langreference = "";
let langrank = "";
let langusers = "";
let langjobs = "";

// PYTHON SHELL INSTALL DEPENDENCIES
let pyshell = new PythonShell('dependency.py');

    pyshell.send("abc");

    
    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        // console.log(message)
    });

      // end the input stream and allow the process to exit
  pyshell.end(function (err,code,signal) {
    if (err) throw err;
    // console.log('The exit code was: ' + code);
    // console.log('The exit signal was: ' + signal);
    // console.log('finished');
  });

// Set up the mongodb and connect to the cluster

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { JsonWebTokenError } = require("jsonwebtoken");
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

let rasta = path.join(__dirname, "../views");


const app = express();


app.use(
    session({
      secret: "axbynehal", // Change this to a strong, unique secret
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: uri, // Your MongoDB Atlas connection string
        dbName: "Freeversity", // Choose a name for your session database
        collection: "signup", // Collection name for sessions
        autoRemove: 'interval', // Automatically remove expired sessions
        autoRemoveInterval: 10, // Interval in minutes (adjust according to your needs)
      }),
      cookie: { maxAge: 9000000 }, // Session expires after 1 hour
    })
  );

// Example middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // console.log(req.session.user)
        return next();
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};

  
console.log(isAuthenticated)

app.set('views', rasta);
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", function(req, res){
    if(req.session.user){
        const { name, mail, imageName, userName, sessionUserId } = req.session.user;
        // console.log(sessionUserId)
        res.render("userIndex", {geminiData:geminiData ,name:name, mail:mail, imageName:imageName, user:userName});
    }else{
        res.render('index', {geminiData:geminiData,name:"", mail:"", imageName:""});
    }
});


/* ///////////////////////////////////// 
             Login Module
//////////////////////////////////////*/

const { loginUser } = require('./Authentication/applogin');               //Importing

app.get("/login", function(req, res){                                     //Get Request
    res.render('login', {passwordUpdated:passwordUpdated});
});

app.post("/login", function(req, res) {                                   //Post Request
    const data = req.body;
    console.log(data);

    loginUser(data, req, res);                                            // Call the loginUser function from applogin.js
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* ///////////////////////////////////// 
             Sign Up Module
//////////////////////////////////////*/

const { signUpUser } = require('./Authentication/appsignup');               //Importing

app.get("/signup", function(req, res){                                      //get req
    res.render('signup');
});

app.post("/signup", async function (req, res, next) {               //post req
    const data = req.body;
    console.log(data);

    await signUpUser(data, res);                                            // Call the signUpUser function from appsignup.js
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Profile Picture

app.post("/upload", Multer.single('file'), isAuthenticated, function(req, res, next){
    let { name, mail, imageName, userName, sessionUserId } = req.session.user;
    const { MongoClient } = require("mongodb");
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);
    const dbName = "Freeversity";
    try {
        if(req.file){
            const blob = bucket.file("ProfilePictures/"+userName+"/"+userName+req.file.originalname);
            // console.log(sessionUserId)
            const blobStream = blob.createWriteStream();
            blobStream.on('finish', function(){
                
                async function run() {
                    try {
                        // Connect to the Atlas cluster
                        await client.connect();
                        const db = client.db(dbName);
            
                        // Reference the "signup" collection in the specified database
                        const col = db.collection("signup");
            
                        // Check if the email already exists
            
                        const user = await col.findOne({
                            "Email": mail,
                            "Fname": name
                        });
            
                        
                        if (user) {
                            imageName =process.env.PROFILE_PIC_PATH+userName+"/"+userName+req.file.originalname;
                            req.session.user.imageName = imageName; 
                            let id = user._id;
            
                            let filter = { _id: id };
            
                            const update = {
                                $set: {
                                  'Image': imageName
                                }
                              };
                            const result = await col.updateOne(filter, update);
                            
                            const imageNaam = await col.findOne({
                                "Email":mail,
                                "Fname":name
                            })
            
                            if(imageNaam){
                                imageName = imageNaam.Image;
                                // You can render a rejection page or redirect as needed
                                // res.render('userIndex', {name:name, mail:mail, imageName:imageName, user:userName, geminiData:geminiData});
                                res.redirect("/")
                                updatedImageName=null;
                            }
            
                            
                        } 
                        
                        else {
                            
                            console.log("Profile Not Updated");
                        }
                    } catch (err) {
                        console.log(err.stack);
                    } finally {
                        await client.close();
                    }
                }
                run().catch(console.dir);
            })
            blobStream.end(req.file.buffer)
        }
    } catch (error) {
        res.status(500).send(error)
    }
    
})




// Learning Path

app.get('/learningpath',isAuthenticated, function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    res.render("LearningPath/personalizedLearningPath", {name:name, mail:mail, imageName:imageName, user:userName})
})

// Quiz section


// 1. Language Quiz
app.get('/quizLanguage',isAuthenticated, function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    res.render("LearningPath/quizLanguage", {name:name, mail:mail, imageName:imageName, user:userName})
})
app.post('/quizLanguage', async function(req, res, next){
    const quizData = req.body;
    const quizDataArray = [quizData.projectType, quizData.skill, quizData.approach,  quizData.platformCompatibility, quizData.industry_trends, quizData.ecosystems_and_tools, quizData.scalibility, quizData.datahandling, quizData.documentation];

    // Assuming isAuthenticated middleware sets req.session.user
    const { name, mail, imageName, user_id } = req.session.user;
    const userID = user_id;
    const { MongoClient } = require("mongodb");
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);
    const dbName = "Freeversity";

    let pyshell = new PythonShell('app.py');
    pyshell.send(quizDataArray);

    pyshell.on('message', async function (message) {
        console.log(message);
        const resultLang = message;

        try {
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("languages");
            const lang = await col.findOne({ "title": resultLang });

            const colID = db.collection('signup');
            let userID = ""
            const userIDsearch = await colID.findOne({"Email":mail});
            if(userIDsearch){
                userID=userIDsearch._id
            }
            console.log("bahar"+userID)
            if (lang) {
                appeared = lang.appeared;
                langType = lang.type;
                description = lang.description;
                langcreators = lang.creators;
                langwebsite = lang.website;
                langreference = lang.reference;
                langrank = lang.language_rank + 1;
                langusers = lang.number_of_users;
                langjobs = lang.number_of_jobs;

                req.session.resultLang = resultLang; // Store resultLang in session
                req.session.appeared = appeared; // Store other relevant data in session

                console.log("Data Fetched");
                res.redirect(`/languageAns/${userID}`);
            } else {
                console.log("Can't find data");
                res.render("LearningPath/personalizedLearningPath", { name: name, mail: mail, imageName: updatedImageName });
            }
        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    });

    pyshell.end(function (err, code, signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('Finished');
    });
});

app.get("/languageAns/:userID", isAuthenticated, function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    const userID = req.params.userID; // Get user ID from URL parameters

    // Retrieve recommendation data based on user ID
    const resultLang = req.session.resultLang;
    const appeared = req.session.appeared;
    // Retrieve other relevant data from session

    res.render("LearningPath/languageAns", { name: name, mail: mail, imageName: updatedImageName, resultLang: resultLang, appeared: appeared, description: description, langusers: langusers, langrank: langrank, langjobs: langjobs, langType: langType });
});


/*/////////////////////////////////////////
        Forgot Password
//////////////////////////////////////////*/

let matchPassword = "";

const jwt = require('jsonwebtoken');
const JWT_SECRET = "Some secret code";

app.get("/forgetPassword", function(req, res, next){
    res.render("ForgetPass/forgetPassword")
});

app.post("/forgetPassword", function(req, res, next){
    const forgotEmail = req.body.email;

    // validating if user exists
    const { MongoClient } = require("mongodb");

    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db(dbName);

            // Reference the "signup" collection in the specified database
            const col = db.collection("signup");

            // Check if the email already exists

            const user = await col.findOne({
                "Email": forgotEmail,
            });

            
            if (user) {  //if user exists we will generate OTP which is valid for 15 mins

                const secret = JWT_SECRET + user.Password;  //we are creating this so that user cannot use same otp for login even though 15 min is not Over.
                const payload = {
                    email:user.Email,
                    id:user._id
                }

                const token = jwt.sign(payload, secret, {expiresIn: '14m'});
                const link = `http://localhost:3000/resetPassword/${user._id}/${token}`
                const link2 = `https://freeversity.co.in/resetPassword/${user._id}/${token}`
                
                console.log("LINK SENT TO EMAIL")
                res.send("Link sent to EMAIL")
                console.log(link);

                // Mailing the link to the user 
                // Mailing the link to the user 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Set to false for port 587
    auth: {
        user: "ctrlaltconquer@gmail.com",
        pass: process.env.PASS_GMAIL
    }
});

const mailOptions = {
    from: {
        name: "CtrlAltConquer Team",
        address: "ctrlaltconquer@gmail.com"
    },
    to: user.Email,
    subject: "Reset Password",
    text: "Hi, this is your Password reset link: \n \n "+link2
};

const sendMail = async function (transporter, mailOptions) {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.log(error);
    }
}

// Call the sendMail function with the transporter and mailOptions
sendMail(transporter, mailOptions);
            } 
            
            else {
                console.log("nhi bhai doesnot exist");
                res.send("Email does not exist")
            }
        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
})


app.get("/resetPassword/:id/:token", function(req, res, next){
    const {id, token} = req.params;


    // verify if the same ID
    const { MongoClient } = require("mongodb");
    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db(dbName);

            // Reference the "signup" collection in the specified database
            const col = db.collection("signup");

            // Check if the email already exists

            const idExist = await col.findOne({
                "_id": new ObjectId(id),
            });

            // console.log(id);
            
            if (!idExist) {  //if user exists we will generate OTP which is valid for 15 mins
                res.send("INVALID ID")
                return
            } 
            const secret = JWT_SECRET + idExist.Password;

            try{

                const payload = jwt.verify(token, secret)
                res.render("ForgetPass/resetPassword", {email:idExist.Email, matchPassword:matchPassword})

            } catch(error){
                console.log(error.message)
                res.send(error.message)
            }


        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});


app.post("/resetPassword/:id/:token", function(req, res, next){
    const {id, token} = req.params;

    const {password, password2} = req.body;

    // verify if the same ID
    const { MongoClient } = require("mongodb");
    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db(dbName);

            // Reference the "signup" collection in the specified database
            const col = db.collection("signup");

            // Check if the email already exists

            const idExist = await col.findOne({
                "_id": new ObjectId(id),
            });


            // console.log(id);
            
            if (!idExist) {  //if user exists we will generate OTP which is valid for 15 mins
                res.send("INVALID ID")
                return
            } 

            const secret = JWT_SECRET + idExist.Password;

            if (idExist){
                const oldPassword = idExist.Password;

                if(oldPassword == password){
                    matchPassword = "Cannot reset, previous password";
                    res.render("ForgetPass/resetPassword", {email:idExist.Email, matchPassword:matchPassword})
                    return
                }

            }

            try{

                const payload = jwt.verify(token, secret)
                
                // validate password and password 2

                let userid = idExist._id;

                let filter = { _id: userid };

                const update = {
                    $set: {
                      'Password': password
                    }
                  };
                const result = await col.updateOne(filter, update);

                passwordUpdated = "Password Updated Successfully";

                res.render("login", {passwordUpdated:passwordUpdated});


            } catch(error){
                console.log(error.message)
                res.send(error.message)
            }


        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
    
});


app.get('/logout', function(req, res){
    req.session.destroy(function(){
       res.redirect('/');
    });
 });
 

let posts = [];
let Filename = ""
app.get('/aitool', isAuthenticated,async function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    // Connect to the MongoDB cluster
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("Freeversity");
        const collection = database.collection("aitools");

        // Retrieve data from MongoDB
        const result = await collection.find({}).toArray();

        // Assign the result to the posts array
        posts = result;

        // Render the HTML page with the posts data
        res.render("Resources/aitool", {name: name, mail: mail, imageName: imageName, posts: posts});
    } catch (error) {
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});

// app.get("/posts/:")
app.get('/resources', isAuthenticated,async function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    // Connect to the MongoDB cluster
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("Freeversity");
        const collection = database.collection("resources");
        // Retrieve data from MongoDB
        const result = await collection.find({}).toArray();

        // Assign the result to the posts array
        posts = result;

        // Render the HTML page with the posts data
        res.render("Resources/resources", {name: name, mail: mail, imageName: imageName, posts: posts, email:mail, addIdToMyPostButton: false, addIdToAllPostButton: true, user:userName});
    } catch (error) {
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the MongoDB connection
        await client.close();
    }


    //  FILTER FOR MY POST

    // FILTER FOR MY POST
app.get('/mypost', async function(req, res) {
    try {
        // Ensure that the user is authenticated and the session is maintained
        const { name, mail, imageName, userName } = req.session.user;
        
        // Connect to the MongoDB database
        await client.connect();
        
        const database = client.db("Freeversity");
        const collection = database.collection("resources");
        
        // Retrieve dat#687CAEa from MongoDB based on the user's email
        const result = await collection.find({ 'PostedBy': mail }).toArray();
        
        // Assign the result to the posts array
        posts = result;

        // Render the HTML page with the posts data
        res.render("Resources/resources", { name: name, mail: mail, imageName: imageName, posts: posts, email: mail, addIdToMyPostButton: true, addIdToAllPostButton: false, user:userName});
    } catch (error) {
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}); //filter for my post end



    // DELETING A POST 
    app.post('/deletePost', async (req, res) => {
        try {
            // Connect to the MongoDB database
            await client.connect();
            
            const postId = req.body.postId; // Assuming postId is sent from the client as part of the request body
            const database = client.db("Freeversity");
            const collection = database.collection("resources");
            
            // Delete the post from MongoDB based on its ObjectId
            const result = await collection.deleteOne({ _id: new ObjectId(postId) });
    
            if (result.deletedCount === 1) {
                res.redirect("/resources")
            } else {
                res.status(404).send("Post not found or already deleted");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).send("Internal Server Error");
        } finally {
            // Close the MongoDB client connection
            await client.close();
        }
    });
    

});


app.post('/resources', isAuthenticated, Multer.single('fileofpost'),function(req, res){
    const dataa = req.body;
    const post = {
        title: dataa.titleofpost,
        description: dataa.descriptionofpost,
    }
    let { name, mail, imageName, userName, sessionUserId } = req.session.user;
    const { MongoClient } = require("mongodb");
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);
    const dbName = "Freeversity";
    try {
        if(req.file){
            const blob = bucket.file("Resources/"+userName+"/"+userName+req.file.originalname);
            
            // console.log(sessionUserId)
            const blobStream = blob.createWriteStream();
            blobStream.on('finish', function(){
                
                async function run() {
                    try {
                        // Connect to the Atlas cluster
                        await client.connect();
                        const db = client.db(dbName);
            
                        // Reference the "signup" collection in the specified database
                        const col = db.collection("resources");
            
                            let resourceData = {
                                "PostedBy": mail,
                                "PostedByName": name,
                                "PostedByUsername":userName,
                                "Title":dataa.titleofpost,
                                "Description":dataa.descriptionofpost,
                                "Filename": req.file ? "https://storage.googleapis.com/freeversity-storage/Resources/"+userName+"/"+userName+req.file.originalname : null,
                                
                                "Likes":0,
                                "Timestamp": new Date()
                            };
            
                            // Insert the document into the specified collection
                            const result = await col.insertOne(resourceData);
                            posts.push(post);
                            res.redirect('resources')
            
                    } catch (err) {
                        console.log(err.stack);
                    } finally {
                        await client.close();
                    }
                }
            
                run().catch(console.dir);
            })
            blobStream.end(req.file.buffer)
        }
    } catch (error) {
        res.status(500).send(error)
    }
         
    // store in mongoDb
});



let post = null;

app.get("/posts/:postID", async function(req, res) {
    const { MongoClient, ObjectId } = require("mongodb");

    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    const postID = req.params.postID;

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db(dbName);

            // Reference the "resources" collection in the specified database
            const col = db.collection("resources");

            const objectIdPostID = new ObjectId(postID);
            // Find the post with the specified ID
            post = await col.findOne({ _id: objectIdPostID });

            if (!post) {
                // Handle the case where the post is not found
                res.status(404).send("Post not found");
                return;
            }

            // Render the post page with the retrieved post data
            

            if(post.Filename==null){
                res.render("Resources/postPage", {description:post.Description, title:post.Title, filename:post.Filename, buttonHtml:"", buttonPreviewHtml:"", postedBy:post.PostedBy});
            }

            else{
                let abc = '<button class="btn-download" onclick="window.location.href='
                let def = "'/download'"
                let ghi = '">DOWNLOAD</button>'
                const buttonHtml = abc+def+ghi;

                let pr = '<button class="btn-preview" onclick="window.location.href='
                let evi = "'/posts/"+post._id+"/preview'"
                let iew = '">PREVIEW</button>'
                const buttonPreviewHtml = pr+evi+iew;

                res.render("Resources/postPage", {description:post.Description, title:post.Title, filename:post.Filename, buttonHtml:buttonHtml, buttonPreviewHtml:buttonPreviewHtml, postedBy:post.PostedByName});
                app.get('/download', async function(req, res) {
                    // Replace 'your-bucket-name' and 'file-path-in-bucket' with the actual values
                    const bucketName = 'your-bucket-name';
                    const filePathInBucket = 'file-path-in-bucket';
                    console.log(post.Filename)
                    try {
                        // Get a signed URL for the file
                        const [url] = await storage.bucket(bucketName).file(filePathInBucket).getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
                        });
                
                        // Redirect the user to the signed URL for downloading the file
                        res.redirect(url);
                    } catch (error) {
                        console.error('Error generating signed URL:', error);
                        res.status(500).send('Error generating download link');
                    }
                });
                
    
            }
            
        } catch (err) {
            console.log(err.stack);
            res.status(500).send("Internal Server Error");
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});



/*//////////////////////////////////////
            Preview The Post 
//////////////////////////////////////*/
const fs = require('fs');
const pdf = require('pdf-parse'); 

// Route to handle preview of posts
app.get("/posts/:postID/preview",async (req, res) => {
    const postID = req.params.postID;
    const { MongoClient, ObjectId } = require("mongodb");

    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";


    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('resources');

        // Find the document with the specified postID
        const post = await col.findOne({ _id: new ObjectId(postID) });

        if (!post) {
            return res.status(404).send("Post not found");
        }

        let filePath = ""

        if (post){
            filePath = post.Filename
        }

        // Check if file exists in Google Cloud Storage bucket
        async function checkFileExists(filePath) {
            try {
                await storage.bucket('freeversity-storage').file(filePath).exists();
                return true;
            } catch (error) {
                console.error('Error checking file existence:', error);
                return false;
            }
}

// Validate the existence of the file
const fileExists = await checkFileExists(filePath);

if (!fileExists) {
    return res.status(404).send('File not found');
}

        // Read file extension to determine file type
        const fileExtension = getFileExtension(filePath);
        console.log(fileExtension)
        let fileContent;

        if (fileExtension && fileExtension != 'pdf' && fileExtension != 'png' && fileExtension != 'jpeg' && fileExtension!='jpg' && fileExtension != 'xlsx' && fileExtension != 'ppt' && fileExtension != 'docx') {
            // Read text file
            fileContent = await fs.promises.readFile(filePath, 'utf-8');
        } else if (fileExtension === 'pdf' || fileExtension === 'xlsx' || fileExtension === 'ppt' || fileExtension === 'docx') {
            // Read PDF file
            // const dataBuffer = fs.readFileSync(filePath);
            // fileContent = await pdf(dataBuffer);
            let pfdframe = "<iframe src='"+filePath+"' style='width:80%; height:100%; position:absolute; top:50%; left: 50%;transform: translate(-50%, -50%)'></iframe>"
            res.render('Resources/preview', {imagePreview:pfdframe});

            return
        } else if (fileExtension === 'png' || fileExtension==='jpg' || fileExtension==='jpeg') {
            // Serve the PNG file as static content
            const imagePreview = filePath;
            const abc = "<img src='"+imagePreview+"' alt='ImageFile' height='1000px' style='position:absolute; top:50%; left: 50%;transform: translate(-50%, -50%)'>"
            res.render('Resources/preview', {imagePreview:abc});
            return;
        }
        else {
            return res.status(400).send("Unsupported file format");
        }

        // Send the file content as response
        res.send(fileContent);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the MongoDB client connection
        await client.close();
    }
});

// Function to get file extension
function getFileExtension(filePath) {
    return filePath.split('.').pop().toLowerCase();
}




/*/////////////////////////////////////////////
            GEMINI API USAGE
/////////////////////////////////////////////*/
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { sample } = require("lodash");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

let textgemini=""
app.get("/gemini", function(req, res){
    res.render("GEMINI/gemini", {
        resultgemini:textgemini
    });
})


app.post("/gemini", async function(req, res) {
    const sentencegemini = req.body.something;
    console.log(sentencegemini)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = sentencegemini;

    try {
        const result = await model.generateContentStream([prompt]);
        const response = await result.response;
        const geminiData = await response.text(); // Await the promise here
        console.log(geminiData)
        res.send(geminiData);
    } catch (error) {
        console.error('Error generating geminiData:', error);
        res.status(500).send('Error generating geminiData');
    }
});




/*/////////////////////////////////////////////////
----------- CAREER CHOICE RECOMMENDATION ----------            
//////////////////////////////////////////////////*/
app.get('/quizCareer', function(req, res){
    res.render("LearningPath/quizCareer")
});

app.post('/quizCareer', isAuthenticated, function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    const careerData = req.body;
    let dataPut = careerData.interset+' and '+careerData.language+' and '+careerData.talent+' and '+careerData.aspect+' and '+careerData.uptodate+' and '+careerData.excited;
    async function run() {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const prompt = dataPut+". just suggest me appropriate career within these careers, suggest any one of these not more than than and just a single word reply: 1. Game Developer, 2. Embedded Systems Developer, 3. Web Developer, 4. Full-Stack Developer, 5. DevOps Engineer, 6. Software Quality Assurance Engineer, 7. User Interface (UI) Designer, 8. User Experience (UX) Designer, 9. Front-End Developer, 10. Back-End Developer, 11. Data Scientist, 12. Machine Learning Engineer, 13. Cloud Architect, 14. Blockchain Developer, 15. IT Infrastructure and Security, 16. Network Administrator, 17. System Administrator, 18. Cybersecurity Analyst, 19. Information Security Analyst, 20. Penetration Tester, 21. Forensic Computer Analyst, 22. Cloud Security Engineer, 23. Data Privacy Analyst, 24. Network Security Engineer, 25. IT Support Specialist, 26. Artificial Intelligence and Robotics, 27. Artificial Intelligence Engineer, 28. Robotics Engineer, 29. Computer Vision Engineer, 30. Natural Language Processing Engineer, 31. Machine Learning Engineer (Robotics), 32. AI Ethicist, 33. Data and Analytics, 34. Data Analyst, 35. Business Intelligence Analyst, 36. Data Engineer, 37. Database Administrator, 38. Data Architect, 39. Statistician, 40. Creative and Design-Focused Roles, 41. 3D Artist, 42. Graphic Designer, 43. Motion Graphics Designer, 44. UX/UI Designer, 45. Game Designer, 46. Technical Writer, 47. Technical Trainer, 48. Quantum Computing Engineer, 49. Virtual Reality (VR) Developer, 50. Augmented Reality (AR) Developer, 51. Internet of Things (IoT) Developer"
        const result = await model.generateContentStream([prompt]);
        const response = await result.response;
        const answerCareer = response.text();
        const prompt2 = "Give me whole roadmap for "+answerCareer+" to become from beginner to advanced.";
        const result2 = await model.generateContentStream([prompt2]);
        const response2 = await result2.response;
        const answerwa = response2.text();
        res.render("LearningPath/careerAns", {
            careerChoice:answerCareer,
            geminiData:answerwa,
            name: name, 
            mail: mail, 
            imageName: imageName, 
        })
      }
      
      run();
})



/* /////////////////////////////////////////////////
              GITHUB MINI PROJECT
//////////////////////////////////////////////////*/
app.get('/miniprojects', isAuthenticated,async function(req, res){
    const { name, mail, imageName, userName } = req.session.user;
    // Connect to the MongoDB cluster
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("Freeversity");
        const collection = database.collection("projects");
        // Retrieve data from MongoDB
        const result = await collection.find({}).toArray();
        // Assign the result to the posts array
        posts = result;
        
        // Render the HTML page with the posts data
        res.render("MiniProjects/miniprojects", {name: name, mail: mail, imageName: imageName, posts: posts, email:mail, addIdToMyPostButton: false, addIdToAllPostButton: true, user:userName});
    } catch (error) {
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the MongoDB connection
        await client.close();
    }


    //  FILTER FOR MY POST

    // FILTER FOR MY POST
app.get('/myprojects', async function(req, res) {
    try {
        // Ensure that the user is authenticated and the session is maintained
        const { name, mail, imageName, userName } = req.session.user;
        
        // Connect to the MongoDB database
        await client.connect();
        
        const database = client.db("Freeversity");
        const collection = database.collection("projects");
        
        // Retrieve dat#687CAEa from MongoDB based on the user's email
        const result = await collection.find({ 'PostedBy': mail }).toArray();
        
        // Assign the result to the posts array
        posts = result;
        console.log(result);

        // Render the HTML page with the posts data
        res.render("MiniProjects/miniprojects", { name: name, mail: mail, imageName: imageName, posts: posts, email: mail, addIdToMyPostButton: true, addIdToAllPostButton: false});
    } catch (error) {
        console.error("Error retrieving data from MongoDB:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}); //filter for my post end



    // DELETING A POST 
    app.post('/deleteproject', async (req, res) => {
        try {
            // Connect to the MongoDB database
            await client.connect();
            
            const postId = req.body.postId; // Assuming postId is sent from the client as part of the request body
            const database = client.db("Freeversity");
            const collection = database.collection("projects");
            
            // Delete the post from MongoDB based on its ObjectId
            const result = await collection.deleteOne({ _id: new ObjectId(postId) });
    
            if (result.deletedCount === 1) {
                res.redirect("/miniprojects")
            } else {
                res.status(404).send("Post not found or already deleted");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).send("Internal Server Error");
        } finally {
            // Close the MongoDB client connection
            await client.close();
        }
    });
});


app.post("/miniprojects", Multer.any(),async function(req, res){
    const projectData = req.body;

    let project = {
        projectname:projectData.projectname,
        projectdescription:projectData.projectdescription,
        githubrepolink:projectData.githubrepolink,
        deploylink:projectData.deploylink,
        technology:projectData.technology,
        steps:{}
    }

    let { name, mail, imageName, userName, sessionUserId } = req.session.user;
    const { MongoClient } = require("mongodb");
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);
    const dbName = "Freeversity";

    

    for (let i = 0; i < Object.keys(projectData).length; i++) {
        const key = Object.keys(projectData)[i];
        if (key.startsWith('step')) {
            // Extract step number from key
            const stepNumber = key.match(/\d+/)[0];
            
            // Initialize an object to hold step information
            const stepInfo = {};
    
            // Add step information to the object
            stepInfo.text = projectData[key];
    
            // Check if there's an associated image
            const imageKey = `imageofstep${stepNumber}`;
            console.log('Image key:', imageKey);
            console.log('Files:', req.files);
    
            stepInfo.image = req.files[imageKey.charAt(imageKey.length-1)].originalname;
            // Add the step object to the project.steps array
            project.steps[key] = stepInfo;
        }
    }    



    // stepInfo.image = req.files[imageKey.charAt(imageKey.length-1)].originalname;
    console.log(project)
    
    try {
        let sampleImageDBpath=""
        if(req.files){
            let curDate = new Date().toUTCString()
            curDate = curDate.replace(/\s/g, "")

            
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const blob = bucket.file("Projects/" + userName + "/" + curDate + file.originalname);
                const blobStream = blob.createWriteStream();
                sampleImageDBpath = "https://storage.googleapis.com/freeversity-storage/Projects/"+ userName + "/" + curDate + req.files[0].originalname;
                
                // UPDATE IMAGE NAME HERE WITH 
                for (let step in project.steps) {
                    if (project.steps.hasOwnProperty(step)) {
                        const stepNumber = step.match(/\d+/)[0]; // Extract the step number
                        const newImagePath = "https://storage.googleapis.com/freeversity-storage/Projects/"+ userName + "/" + curDate +req.files[stepNumber].originalname;
                        project.steps[step].image = newImagePath; // Update the image path
                    }
                }
                blobStream.on('finish', () => {
                    //finish file upload
                });

                blobStream.end(file.buffer);
            }

                
                    async function run() {
                        try {
                            // Connect to the Atlas cluster
                            await client.connect();
                            const db = client.db(dbName);
            
                            // Reference the "signup" collection in the specified database
                            const col = db.collection("projects");
            
                            project = {
                                "PostedBy": mail,
                                "PostedByName": name,
                                "Title": projectData.projectname,
                                "Description": projectData.projectdescription,
                                "GithubRepoLink": projectData.githubrepolink,
                                "DeployLink": projectData.deploylink,
                                "technology": projectData.technology,
                                "sampleimage": sampleImageDBpath,
                                "steps": project.steps,
                                "Timestamp": new Date()
                            };
            
                            // Insert the document into the specified collection
                            const result = await col.insertOne(project);
                            posts.push(post);
                            res.redirect('miniprojects');
            
                        } catch (err) {
                            console.log(err.stack);
                        } finally {
                            await client.close();
                        }
                    }
            
                    run().catch(console.dir);
            
        }
        console.log("if k ander")
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
         
})




app.get("/projectposting", function(req, res){
    const { name, mail, imageName, userName, sessionUserId } = req.session.user;
    res.render("MiniProjects/projectposting", {geminiData:geminiData ,name:name, mail:mail, imageName:imageName, user:userName});
})


let project = null;

app.get("/project/:projectID", async function(req, res) {
    const { name, mail, imageName, userName, sessionUserId } = req.session.user;
    const { MongoClient, ObjectId } = require("mongodb");

    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    const projectID = req.params.projectID;

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db(dbName);

            // Reference the "resources" collection in the specified database
            const col = db.collection("projects");

            const objectIdprojectID = new ObjectId(projectID);
            // Find the post with the specified ID
            post = await col.findOne({ _id: objectIdprojectID });

            if (!post) {
                // Handle the case where the post is not found
                res.status(404).send("Post not found");
                return;
            }

            // Render the post page with the retrieved post data
            


                res.render("MiniProjects/projectPage", {post, imageName:imageName, name:name, mail:mail});
                
                app.get('/download', async function(req, res) {
                    // Replace 'your-bucket-name' and 'file-path-in-bucket' with the actual values
                    const bucketName = 'your-bucket-name';
                    const filePathInBucket = 'file-path-in-bucket';
                    console.log(post.Filename)
                    try {
                        // Get a signed URL for the file
                        const [url] = await storage.bucket(bucketName).file(filePathInBucket).getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 15 * 60 * 1000, // Link expires in 15 minutes
                        });
                
                        // Redirect the user to the signed URL for downloading the file
                        res.redirect(url);
                    } catch (error) {
                        console.error('Error generating signed URL:', error);
                        res.status(500).send('Error generating download link');
                    }
                });
                
    
            
        } catch (err) {
            console.log(err.stack);
            res.status(500).send("Internal Server Error");
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});


app.get("/profile/:user", function(req,res){
    let user = req.params.user;
    const { name, mail, imageName, userName, sessionUserId } = req.session.user;

    const { MongoClient, ObjectId } = require("mongodb");

    // Replace the following with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    const projectID = req.params.projectID;

    async function run() {
        try {
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db(dbName);

            // Reference the "resources" collection in the specified database
            const col = db.collection("signup");

            // Find the post with the specified ID
            const userInDb = await col.findOne({ Username:user });

            if(userInDb){
                if(userInDb.Username==userName){
                    res.send("<body style='background-color:green;'><h1 style='color:white'>In DB Can EDIT</h1></body>");
                }else{
                    res.send("<body style='background-color:red;'><h1 style='color:white'>In DB but not editable</h1></body>");
                }
            }else{
                res.send("<body style='background-color:#333'><h1 style='color:white'>USER DOESN'T EXISTS</h1></body>");
            }
    
            
        } catch (err) {
            console.log(err.stack);
            res.status(500).send("Internal Server Error");
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
    

});


// Running app on server 3000
app.listen(3000, function(){
    console.log("Server started running on port 3000");
});