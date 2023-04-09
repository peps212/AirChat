import { LLMChain } from "langchain";
import { ChatOpenAI } from "langchain/chat_models";
import { initializeAgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";

const KEY = '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';
const serpKEY = 'cba55f8c3f206322ffdd3a924d1ce2215a5c4bb382b3783dc52d306bcc0c20e7';


export default async function handler(req, res) {
  try {
    const model = new ChatOpenAI({ openAIApiKey: KEY, temperature: 0 });
    const tools = [new SerpAPI(serpKEY)];
    const serpapi = tools[0]
    serpapi.description = "This tool allows you to search information you dont know on the internet. Only use it when someone asks you about specific information about the airline company Etihad"
    console.log(serpapi.description)


    const executor = await initializeAgentExecutor(
      tools,
      model,
      "chat-conversational-react-description",
      true
    );
    executor.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
    });

    const input = req.body.input;
    
    const result = await executor.call({ input });
  
    res.status(200).json({ output: result.output });
  
  } catch (error) {

    res.status(500).json({ error: 'Error running executor' });
  }
}
