import { getSystemPrompt } from "./prompts.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT } from "./prompts.js";
import { ReactPrompt } from "./defaults/react.js";
import { NodePrompt } from "./defaults/node.js";
import  express  from "express";
import cors from 'cors';
import exp from "constants";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);

const app = express();
app.use(express.json());
app.use(cors());

// const templatemodel = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-exp", 
//   systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
// });

// app.post("/template",async (req,res) => {
//     const prompt = req.body.prompt;
//     const result = await templatemodel.generateContent({
//       contents: [
//           {
//             role: 'user',
//             parts: [
//               {
//                 text : prompt 
//               },
//             ],
//           }
//       ],
//       generationConfig: {
//         maxOutputTokens: 200,
//         temperature : 0,
//       }
//   });

//   const ans = result.response.text().trim();
//   // console.log(ans);
//   if (ans === "react") {
//     res.json({
//         prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactPrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
//         uiPrompts: [ReactPrompt]
//     })
//     return;
// }

//   if (ans === "node") {
//       res.json({
//         prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactPrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
//         uiPrompts: [NodePrompt]
//       })
//       return;
//   }

//   res.status(403).json({message: ans})
//   return;

// });


const finalmodel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp", // 
    systemInstruction: getSystemPrompt(),
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  console.log(messages);
  const result = await finalmodel.generateContent({
    contents: [
        {
          role: 'user',
          parts: [
            {
              text : BASE_PROMPT
            },
            {
              text : `${ReactPrompt} Make sure you create all the files mentioned here and create proper files for different components and mention and wrap them in boltactiontype and try to organise everything in a proper folder structure dont just give all code in app.tsx` 
            },
            {
              text : messages
            }
          ],
        }
    ],
    generationConfig: {
      maxOutputTokens: 15000
    }
  });

  console.log(result.response.text());
  const ans = result.response.text();

  res.json({
    data: ans
  });
});

app.listen(3000);



