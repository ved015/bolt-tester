import React, { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { FileAction } from '../types'; // Adjust import path as needed

// If you want to log process output, you can import a polyfill for WritableStream in older browsers:
// import { WritableStream } from 'web-streams-polyfill/ponyfill';

interface PreviewFrameProps {
  files: FileAction[];              // The list of files from your artifact
  webContainer: WebContainer | null; 
}

/**
 * A separate component that:
 * 1) Mounts your files into the WebContainer
 * 2) Installs dependencies
 * 3) Runs `npm run dev`
 * 4) Renders the dev server in an iframe on success
 */
export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState<string>('');

  // Convert flat paths ("src/pages/home.tsx") into the nested structure
  // WebContainer expects: { "src": { directory: { "pages": { directory: { "home.tsx": { file: { contents } }}}}}}
  function createMountStructure(actions: FileAction[]): Record<string, any> {
    const root: Record<string, any> = {};

    for (const action of actions) {
      const parts = action.filePath.split('/');
      let curr = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLastPart = i === parts.length - 1;

        if (isLastPart) {
          // It's a file
          let content = action.content ?? '';
          if (typeof content !== 'string') {
            try {
              content = JSON.stringify(content, null, 2);
            } catch {
              content = String(content);
            }
          }
          curr[part] = { file: { contents: content } };
        } else {
          // It's a folder
          if (!curr[part]) {
            curr[part] = { directory: {} };
          }
          curr = curr[part].directory;
        }
      }
    }
    return root;
  }

  useEffect(() => {
    if (!webContainer || files.length === 0) return;

    async function mountAndRun() {
      try {
        // 1) Build the nested structure
        const structure = createMountStructure(files);
        console.log('Mounting structure into WebContainer:', structure);

        // 2) Mount the files
        await webContainer.mount(structure);

        // 3) Listen for server-ready event
        webContainer.on('server-ready', (port: number, url: string) => {
          console.log('[server-ready]', port, url);
          setUrl(url);
        });

        // 4) Spawn npm install + npm run dev
        const installProcess = await webContainer.spawn('npm', ['install']);
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error('npm install failed');
        }

        const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
        // If you want to log the dev server output to console, you can do:
        /*
        devProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log('[dev server]', data);
          }
        }));
        */
      } catch (err) {
        console.error('PreviewFrame error:', err);
      }
    }

    mountAndRun();
  }, [webContainer, files]);

  // Show a loading message until we have a URL
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-800">
      {!url && (
        <div className="text-gray-300">
          <p>Starting dev server...</p>
        </div>
      )}
      {url && (
        <iframe
          src={url}
          title="Preview"
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}
