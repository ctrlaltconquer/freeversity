const { MongoClient } = require("mongodb");
let passwordUpdated = ""
async function loginUser(data, req, res) {
    // Replace the folloing with your Atlas connection string
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);
    
    // Reference the database to use
    const dbName = "Freeversity";

    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);

        // Reference the "signup" collection in the specified database
        const col = db.collection("signup");

        // Check if the email already exists
        const user = await col.findOne({
            $or: [
                { "Email": data.email, "Password": data.password },
                { "Username": data.email, "Password": data.password }
            ]
        });

        if (user) {
            // Email already exists, reject signup
            req.session.user = {
                sessionUserId: user._id,
                name: user.Fname,
                mail: user.Email,
                userName: user.Username,
                imageName: user.Image,
            };

            console.log("Login Successful");
            res.redirect("/");
        } else {
            console.log("user name or password wrong");
            res.render("failLogin", { passwordUpdated: passwordUpdated });
        }
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

module.exports = { loginUser };
