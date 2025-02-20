import { getSystemPrompt } from "./prompts.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT } from "./prompts.js";
import { ReactPrompt } from "./defaults/react.js";
import express from "express";
import cors from 'cors';
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyACBzUwLYnLBM2tlM6f7vDOoYI3vDyMFXQ");
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
                        text: BASE_PROMPT
                    },
                    {
                        text: `${ReactPrompt} Make sure to necessarily create all the files mentioned above and maintain a proper folder structure for different components. Organize everything properly within a structured folder hierarchy inside \\boltactiontype. Ensure that the UI is well-designed, responsive, and visually appealing by following best practices for layout, spacing, and component organization. Use Tailwind CSS for styling, and make sure the design is clean, modern, and user-friendly. Avoid placing all the code inside App.tsx; instead, break it down into reusable components and follow a modular approach.  
            
              Project Structure and Organization:  
              1. Create a well-organized folder structure within /boltactiontype following this hierarchy:  
                 - src/  
                   - components/       # Reusable UI components
                   - hooks/            # Custom React hooks  
                   - utils/            # Helper functions and utilities  
                   - types/            # TypeScript interfaces and types  
                   - styles/           # Global styles and Tailwind configurations  
            
              Code Organization:  
              1. Break down the application into modular, reusable components  
              2. Implement proper component composition and avoid prop drilling  
              3. Create separate files for interfaces, types, and constants  
              4. Use meaningful file and component names that reflect their purpose   
            
              Styling and UI Requirements:  
              1. Use Tailwind CSS for styling with these guidelines:  
                 - Implement responsive design for all screen sizes  
                 - Use consistent spacing and padding with Tailwind's spacing scale  
                 - Implement a cohesive color scheme using Tailwind's color palette  
                 - Use Tailwind's container classes for proper content width  
                 - Implement proper grid and flexbox layouts  
              2. Follow these UI best practices:  
                 - Maintain consistent typography and visual hierarchy  
                 - Implement proper component spacing and alignment  
                 - Use appropriate animations and transitions  
                 - Ensure proper contrast ratios for accessibility  
                 - Add hover and focus states for interactive elements  
            
              Component Development:  
              1. Create reusable components for common UI elements like:  
                 - Buttons with different variants  
                 - Input fields and form elements  
                 - Cards and containers  
            
              Ensure that the UI is well-designed, responsive, and visually appealing. Avoid placing all the code inside \`App.tsx\`; instead, break it down into reusable components and follow a modular approach.`
                    },
                    {
                        text: messages
                    }
                ],
            }
        ],
        generationConfig: {
            maxOutputTokens: 20000
        }
    });
    console.log(result.response.text());
    const ans = result.response.text();
    res.json({
        data: ans
    });
});
app.listen(3000);
