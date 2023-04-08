import { LLMChain } from "langchain";
import { ChatOpenAI } from "langchain/chat_models";
import { ZeroShotAgent, AgentExecutor } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";

const KEY = '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';
const serpKEY = 'cba55f8c3f206322ffdd3a924d1ce2215a5c4bb382b3783dc52d306bcc0c20e7';


export default async function handler(req, res) {
  try {
    const model = new ChatOpenAI({ openAIApiKey: KEY, temperature: 0 });
    const tools = [new SerpAPI(serpKEY)];

    console.log("hi")

    const prompt = ZeroShotAgent.createPrompt(tools, {
      prefix: `Answer the following questions as best you can, but speaking as a pirate might speak. You have access to the following tools:`,
      suffix: `Begin! Remember to speak as a pirate when giving your final answer. Use lots of "Args"`,
    });
  
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      new SystemMessagePromptTemplate(prompt),
      HumanMessagePromptTemplate.fromTemplate(`{input}
  
  This was your previous work (but I haven't seen any of it! I only see what you return as final answer):
  {agent_scratchpad}`),
    ]);

    console.log("hi2")
    const llmChain = new LLMChain({
      prompt: chatPrompt,
      llm: model,
    });

    const agent = new ZeroShotAgent({
      llmChain,
      allowedTools: tools,
    });
  
    const executor = AgentExecutor.fromAgentAndTools({ agent, tools });
  
    console.log("hi3")

    

    const input = req.body.input;
    
    const result = await executor.run("hi");
  
    res.status(200).json({ output: result.output });
  
  } catch (error) {

    res.status(500).json({ error: 'Error running executor' });
  }
}
