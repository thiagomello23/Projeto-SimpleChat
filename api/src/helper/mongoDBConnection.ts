
import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/ChatApp")
    .catch((err) => console.log(err));

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error: "));
database.once("open", function () {
    console.log("Connected successfully");
});

export default database;