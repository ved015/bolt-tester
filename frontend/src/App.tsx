import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { BoltArtifact, FileAction } from './types';
import { parseXMLResponse } from './utils/xmlParser';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<BoltArtifact | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        messages: prompt
      });

      console.log('Raw response:', response.data);
      const parsedArtifact = parseXMLResponse(response);
      console.log('Parsed artifact:', parsedArtifact);

      if (!parsedArtifact || parsedArtifact.actions.length === 0) {
        throw new Error('No file actions found in the response');
      }

      setArtifact(parsedArtifact);
      setSelectedFile(parsedArtifact.actions[0]); // Select first file by default
    } catch (err: any) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to process the request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      console.log("Updated selected file:", selectedFile.filePath, "Content:", selectedFile.content);
    }
  }, [selectedFile]);

  const getFileLanguage = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'xml':
        return 'xml';
      case 'yml':
      case 'yaml':
        return 'yaml';
      case 'sh':
        return 'shell';
      case 'py':
        return 'python';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Bolt Clone</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : (
                <>
                  <Send className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-600/20 border border-red-600 rounded">
            {error}
          </div>
        )}

        {artifact && (
          <div className="flex gap-4">
            <FileExplorer
              files={artifact.actions}
              onFileSelect={(file) => {
                console.log('Selected file:', file.filePath, 'Content:', file.content ? file.content : 'No content found');
                console.log('Detected language:', getFileLanguage(file.filePath));
                setSelectedFile(file);
              }}
              selectedFile={selectedFile || undefined}
            />
            <div className="flex-1">
              {selectedFile && (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-700">
                    <h2 className="text-lg font-semibold">{selectedFile.filePath}</h2>
                  </div>
                  <div className="h-[700px]"> {/* Increased height */}
                    <CodeEditor
                      key={selectedFile.filePath} // Force re-render when file changes
                      content={selectedFile.content || "No content available"}
                      language={getFileLanguage(selectedFile.filePath)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
