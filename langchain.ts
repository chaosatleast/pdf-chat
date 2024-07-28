import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "./firebaseAdm";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
});

export const indexName = "docpal";

async function fetchMessagesFromFirestore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    .limit(6)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(
    `--- Fetched last ${chatHistory.length} messages successfully ...---`
  );

  console.log(chatHistory.map((message) => message.content.toString()));

  return chatHistory;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value is provided");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  //   fetching doc download url from firebase
  console.log("--- Fetching doc download url from firebase ...---");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(`--- Download url fetched successfully: ${downloadUrl} ... ---`);

  const response = await fetch(downloadUrl);

  //    turn response in to blob
  const data = await response.blob();

  //   loading PDF from the specified path
  console.log("--- Loading PDF document ... ---");

  const loader = new PDFLoader(data);
  const docs = await loader.load();

  //   split docs into smaller parts
  console.log("--- Splitting PDF document into smaller parts ... ---");

  const splitter = new RecursiveCharacterTextSplitter();

  const splittedDocs = await splitter.splitDocuments(docs);

  return splittedDocs;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;
  console.log("--- Generate embeddings for the split documents ... ---");

  const embeddings = new OpenAIEmbeddings();

  const index = await pineconeClient.index(indexName);

  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId} already exists, reuse exsitsing embeddings ... `
    );

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    // download pdf from firestore
    // generate embeddings
    // store in to Pinecone vector store

    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings into namespace ${docId} in the ${indexName} Pinecone Vector Store`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
}

export async function generateLangchainCompletion(
  docId: string,
  question: string
) {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);

  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  console.log("--- Creating a retriever ...  ---");

  const retriever = pineconeVectorStore.asRetriever();

  console.log("--- Fetching messages ----");

  const chatHistory = await fetchMessagesFromFirestore(docId);

  console.log(`--- Define Prompt template ---`);

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  console.log(`--- Createing a history-aware retriever ---`);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    retriever,
    llm: model,
    rephrasePrompt: historyAwarePrompt,
  });

  const answerAwarePrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context : \n\n{context}",
    ],
    ...chatHistory,
    ["user", "{input}"],
  ]);

  console.log(`--- Createing document combine chain ---`);

  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: answerAwarePrompt,
  });

  console.log(`--- Create the main retrieval chain ... ---`);

  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("--- Running the chain with a sample conversation ... ----  ");

  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  console.log(reply.answer);

  return reply.answer;
}

export { model };
