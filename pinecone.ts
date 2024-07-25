import { Pinecone } from "@pinecone-database/pinecone";

let key = process.env.PINECONE_API_KEY!;

if (!key) {
  throw new Error("PINECONE_API_KEY is missing");
}

const pineconeClient = new Pinecone({
  apiKey: key,
});

export default pineconeClient;
