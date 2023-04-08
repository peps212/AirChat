import { OpenAI } from "langchain";
import { SerpAPI } from "langchain/tools";
import { initializeAgentExecutor } from "langchain/agents";

export const run = async (input) => {
  const KEY = "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"
  const serpKEY = "cba55f8c3f206322ffdd3a924d1ce2215a5c4bb382b3783dc52d306bcc0c20e7"
  const model = new OpenAI({openAIApiKey:KEY, temperature: 0 });
  const params = {
    headers: {
        "access-control-allow-origin": "*",
    }
};
  const tools = [new SerpAPI(serpKEY, params)];


  const executor = await initializeAgentExecutor(
    tools,
    model,
    "zero-shot-react-description",
    true
  );

  const result = await executor.call({ input });


  console.log("this is result" + result.output);
  return [result.output];
};