import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://jhonny:Agudelo3120@cluster0.ae37s.mongodb.net/GRAPHQL?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connect to mongo");
  })
  .catch((error) => {
    console.error("Error de la conexion", error.message);
  });
