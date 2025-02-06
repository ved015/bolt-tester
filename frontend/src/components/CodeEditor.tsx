import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  content: string;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, language }) => {
  return (
    <div style={editorWrapperStyle}>
      <Editor
        height="500px"
        defaultLanguage={language}
        defaultValue={content}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 16,
          fontFamily: 'Fira Code, monospace',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          roundedSelection: true,
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          overviewRulerBorder: false,
        }}
      />
    </div>
  );
};

// 💡 Styled Wrapper for a Modern Look
const editorWrapperStyle: React.CSSProperties = {
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0px 4px 20px rgba(0, 255, 170, 0.3)', // Neon glow effect
  border: '1px solid rgba(0, 255, 170, 0.5)', // Subtle border
};

export default CodeEditor;
