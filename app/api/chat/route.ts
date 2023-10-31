import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

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

function createUint8ArrayReadableStream(uint8Array: Uint8Array) {
  return new ReadableStream({
    start(controller) {
      const chunkSize = 64; // 每次推送的字节数
      let offset = 0; // 当前数据偏移量

      function pushChunk() {
        if (offset >= uint8Array.length) {
          // 数据已全部推送完毕
          controller.close();
          return;
        }

        const chunk = uint8Array.slice(offset, offset + chunkSize);
        offset += chunkSize;

        controller.enqueue(chunk);
        setTimeout(pushChunk, 0); // 异步推送下一批数据
      }

      pushChunk();
    },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const response = await fetch('https://d73d2yy5aaymkixufhuvxk2h240uohly.lambda-url.ap-east-1.on.aws/', {
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
    // @ts-ignore
    return new StreamingTextResponse(response.body);
  } catch (err) {
    console.log("error chat api:", err)

    const encoder = new TextEncoder();
    const uint8Array = encoder.encode('⚠️ *Network error, please try again*');
    var errStream = createUint8ArrayReadableStream(uint8Array)
    return new StreamingTextResponse(errStream);
  }
}