import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../public/database'

export default async (req, res) => {
  if (req.method === 'GET') {
    const db = await connectToDatabase();
    const response = await db.collection("gastos").find().toArray();
    res.json(response)
  }
  if (req.method === 'PUT') {
    const db = await connectToDatabase();
    const insert = await db.collection("gastos").insertOne(req.body);
    res.json(insert)
  }
}