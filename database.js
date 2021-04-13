import { MongoClient } from 'mongodb'
var cachedb = null;
export const connectToDatabase = async () => {
  if (cachedb) {
    return Promise.resolve(cachedb)
  } else {
    return MongoClient.connect("mongodb+srv://bojkomatias:27deenero@cluster0-4djd9.mongodb.net/gastos?retryWrites=true&w=majority", { native_parser: false, useUnifiedTopology: true })
      .then((client) => {
        let db = client.db("gastos")
        cachedb = db
        return cachedb
      })
      .catch((error) => console.log(error))
  }
}