import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages } = await req.json();

//   // Ask OpenAI for a streaming chat completion given the prompt
//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     messages,
//   });

//   console.log(response);
//   // return response
//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }


export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch('https://trij7gqo6gm2swl4cn76bpppiy0ftpnt.lambda-url.ap-east-1.on.aws/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    })
  });

  console.log(response.body);

    // Convert the response into a friendly text-stream
  // @ts-ignore
  // const stream = OpenAIStream(response.body);
  // Respond with the stream
    // @ts-ignore
  return new StreamingTextResponse(response.body);
}