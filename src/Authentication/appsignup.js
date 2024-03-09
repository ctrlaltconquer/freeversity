const { MongoClient } = require("mongodb");
let passwordUpdated = "";
async function signUpUser(data, res) {
    // Replace the following with your Atlas connection string
    const url = "mongodb+srv://ctrlaltconquer:ctrlaltconquer@cluster0.xiam5xr.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url);

    // Reference the database to use
    const dbName = "Freeversity";

    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);

        // Reference the "signup" collection in the specified database
        const col = db.collection("signup");

        // Check if the email or username already exists
        const existingUser = await col.findOne({ $or: [{ "Email": data.email }, { "Username": data.userName }] });

        if (existingUser) {
            // Email or username already exists, reject signup
            console.log("User with this email or username already exists.");
            res.render("signupRejected"); // You can render a rejection page or redirect as needed
        } else {
            // Create a new document
            let personDocument = {
                "Fname": data.firstName,
                "Lname": data.lastName,
                "Username": data.userName,
                "Email": data.email,
                "College": data.college,
                "gradYear": data.gradYear,
                "contactNumber": data.contactNumber,
                "Password": data.password,
                "Image": "https://storage.googleapis.com/freeversity-storage/profileBackground.png"
            };

            // Insert the document into the specified collection
            const result = await col.insertOne(personDocument);
            console.log("User registered successfully:", result.insertedId);
            res.render("loginSignupSuccessfull", { passwordUpdated: passwordUpdated });
        }
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

module.exports = { signUpUser };
