import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { useWebContainer } from './hooks/useWebContainer';
import { parseXMLResponse } from './utils/xmlParser';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import { PreviewFrame } from './components/PreviewFrame';
import { BoltArtifact, FileAction } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<BoltArtifact | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Boot the WebContainer (once)
  const webContainer = useWebContainer();

  // Submit the prompt to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        messages: prompt,
      });

      console.log('Raw response:', response.data);
      const parsedArtifact = parseXMLResponse(response);
      console.log('Parsed artifact:', parsedArtifact);

      if (!parsedArtifact || parsedArtifact.actions.length === 0) {
        throw new Error('No file actions found in the response');
      }

      setArtifact(parsedArtifact);
      setSelectedFile(parsedArtifact.actions[0]);
    } catch (err: any) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to process the request.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      console.log(
        'Selected file:',
        selectedFile.filePath,
        'Content:',
        selectedFile.content
      );
    }
  }, [selectedFile]);

  // Helper: guess language mode by file extension
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
    // 1) Full-height container
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder (flash-2exp)</h1>
      </header>

      {/* Prompt Input */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Generating...' : (
              <>
                <Send className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-red-600/20 border border-red-600 rounded">
            {error}
          </div>
        )}
      </div>

      {/* 2) Main content: 3-column layout (Files, Editor, Preview) */}
      <div className="flex-1 flex flex-row gap-4 p-4 overflow-hidden">
        {/* Left Column: File Explorer */}
        <div className="w-1/6 bg-gray-800 rounded-lg overflow-auto">
          {artifact && (
            <FileExplorer
              files={artifact.actions}
              onFileSelect={(file) => {
                console.log('Selected file:', file.filePath);
                setSelectedFile(file);
              }}
              selectedFile={selectedFile || undefined}
            />
          )}
        </div>

        {/* Middle Column: Editor */}
        {/* Make it fill the vertical space: flex flex-col h-full */}
        <div className="w-3/6 bg-gray-900 rounded-lg flex flex-col h-full">
          {selectedFile ? (
            <>
              {/* File name bar at top */}
              <div className="p-2 bg-gray-700 border-b border-gray-600">
                <h2 className="text-sm font-semibold">
                  {selectedFile.filePath}
                </h2>
              </div>
              {/* Editor content fills the rest */}
              <div className="flex-1 relative overflow-hidden">
                <CodeEditor
                  key={selectedFile.filePath}
                  content={selectedFile.content || 'No content available'}
                  language={getFileLanguage(selectedFile.filePath)}
                  // If your editor needs explicit sizing:
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </>
          ) : (
            <div className="p-4 text-gray-400 flex-1">
              No file selected. Please choose a file from the explorer.
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="w-3/6 bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          {artifact ? (
            <PreviewFrame
              webContainer={webContainer}
              files={artifact.actions}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>No preview yet. Generate files first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
