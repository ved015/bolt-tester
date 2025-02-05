import { getSystemPrompt } from "./prompts.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: getSystemPrompt(),
  });


async function main(){
    const result = await model.generateContent({
        contents: [
            {
              role: 'user',
              parts: [
                {
                    text : `For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.
                            By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.
                            Use icons from lucide-react for logos.
                            Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.` 
                },
                {
                    text : `<boltArtifact id="project-import" title="Project Files"><boltAction 
                    type="file" filePath="eslint.config.js">import js from '@eslint/js'; \nimport 
                    globals from 'globals'; \nimport reactHooks from 'eslint-plugin-react-hooks'; 
                    \nimport reactRefresh from 'eslint-plugin-react-refresh'; \nimport tseslint 
                    from 'typescript-eslint'; \n\nexport default tseslint.config( \n { ignores: 
                    ['dist'] }, \n { \n extends: [js.configs.recommended, ...tseslint.configs.recommended],
                     \n files: ['**/*.{ts,tsx}'], \n languageOptions: { \n ecmaVersion: 2020, \n globals: 
                     globals.browser, \n }, \n plugins: { \n 'react-hooks': reactHooks, \n 'react-refresh':
                      reactRefresh, \n }, \n rules: { \n ...reactHooks.configs.recommended.rules, \n '
                      react-refresh/only-export-components': [ \n 'warn', \n { allowConstantExport: true }
                      , \n ], \n }, \n } \n);</boltAction><boltAction type="file" filePath="index.html">
                      <!doctype html>\n<html lang='en'>\n<head>\n<meta charset='UTF-8' />\n<link rel='icon'
                       type='image/svg+xml' href='/vite.svg' />\n<meta name='viewport' 
                       content='width=device-width, initial-scale=1.0' />\n<title>Vite + React + TS</title>
                       \n</head>\n<body>\n<div id='root'></div>\n<script type='module' src='/src/main.tsx'>
                       </script>\n</body>\n</html></boltAction><boltAction type="file" filePath="package.json">
                       {\n"name": "vite-react-typescript-starter",\n"private": true,\n"version": "1.0.0",\n"type": 
                       "module",\n"scripts": {\n"dev": "vite",\n"build": "vite build",\n"lint": "eslint .",
                       \n"preview": "vite preview"\n},\n"dependencies": {\n"lucide-react": "^0.344.0",\n"
                       react": "^18.3.1",\n"react-dom": "^18.3.1"\n},\n"devDependencies": {\n"@eslint/js": 
                       "^9.9.1",\n"@types/react": "^18.3.5",\n"@types/react-dom": "^18.3.0",\n"@vitejs/plugin-react"
                       : "^4.3.1",\n"autoprefixer": "^10.4.18",\n"eslint": "^9.9.1",\n"eslint-plugin-react-hooks": 
                       "^5.1.0-rc.0",\n"eslint-plugin-react-refresh": "^0.4.11",\n"globals": "^15.9.0",\n"postcss":
                        "^8.4.35",\n"tailwindcss": "^3.4.1",\n"typescript": "^5.5.3",\n"typescript-eslint": "^8.3.0"
                        ,\n"vite": "^5.4.2"\n}\n}</boltAction><boltAction type="file" filePath="postcss.config.js">
                        export default {\n plugins: {\n tailwindcss: {},\n autoprefixer: {},\n },\n};</boltAction>
                        <boltAction type="file" filePath="tailwind.config.js">/** @type {import('tailwindcss').Config} 
                        */\nexport default {\n content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n theme: 
                        {\n extend: {},\n },\n plugins: [],\n};</boltAction><boltAction type="file" filePath="tsconfig-app.json">
                        {\n"compilerOptions": {\n"target": "ES2020",\n"useDefineForClassFields": true,\n"lib": ["ES2020", "DOM", "DOM.Iterable"]
                        ,\n"module": "ESNext",\n"skipLibCheck": true,\n"moduleResolution": "bundler",\n"allowImportingTsExtensions": true,\n"isolatedModules": 
                        true,\n"moduleDetection": "force",\n"noEmit": true,\n"jsx": "react-jsx",\n"strict": true,\n"noUnusedLocals": 
                        true,\n"noUnusedParameters": true,\n"noFallthroughCasesInSwitch": true\n},\n"include": ["src"]\n}</boltAction>
                        <boltAction type="file" filePath="tsconfig.json">{\n"files": [],\n"references": [\n{ "path": "./tsconfig-app.json" },\n
                        { "path": "./tsconfig-node.json" }\n]\n}</boltAction><boltAction type="file" filePath="tsconfig.node.json">
                         {\n"compilerOptions": {\n"target": "ES2022",\n"lib": ["ES2023"],\n"module": "ESNext",\n"skipLibCheck": true,
                         \n"moduleResolution": "bundler",\n"allowImportingTsExtensions": true,\n"isolatedModules": true,\n"moduleDetection":
                          "force",\n"noEmit": true,\n"strict": true,\n"noUnusedLocals": true,\n"noUnusedParameters": 
                          true,\n"noFallthroughCasesInSwitch": true\n},\n"include": ["vite.config.ts"]\n}
                          </boltAction><boltAction type="file" filePath="vite.config.ts">import { defineConfig } 
                          from 'vite'; \nimport react from '@vitejs/plugin-react';\n\n// https://vitejs.dev/config/\nexport default defineConfig
                          //({\n plugins: [react()],\n optimizeDeps: {}\n});</boltAction><boltAction type="file" filePath="src/App.tsx">
                          // import React from 'react'; \n\nfunction App() {\n return (\n <div className="min-h-screen 
                          // bg-gray-100 flex items-center justify-center">\n <p>Start prompting (or editing) to see 
                          // magic happen :)</p>\n </div>\n );\n}\n\nexport default App;</boltAction><boltAction type="file" 
                          // filePath="src/index.css">@tailwind base;\n@tailwind components;\n@tailwind utilities;
                          // </boltAction><boltAction type="file" filePath="src/main.tsx">import { StrictMode } 
                          // from 'react'; \nimport { createRoot } from 'react-dom/client'; \nimport App from 
                          // './App.tsx'; \nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).
                          // render(\n <StrictMode>\n <App />\n </StrictMode>\n);</boltAction><boltAction type="file" 
                          // filePath="src/vite-env.d.ts">/// <reference types="vite/client" /></boltAction>
                          // /boltArtifact> Make sure you create all the files mentioned here and create proper files for different components and mention and wrap them in boltactiontype and try to organise everything in a proper folder structure dont just give all code in app.tsx`
                },
                {
                  text: "Create a simple todo app"
                }
              ],
            }
        ],
        generationConfig: {
          maxOutputTokens: 8000,
          temperature : 0
        }
    });
    
    console.log(result.response.text());
    
}
main();

