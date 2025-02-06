import { BoltArtifact, FileAction } from '../types';

export const parseXMLResponse = (response: any): BoltArtifact => {
  try {
    // Ensure response.data is a string
    let xmlString = typeof response.data === 'string' ? response.data : response.data?.data;
    
    if (typeof xmlString !== 'string') {
      throw new Error('Invalid XML response format');
    }
    
    // Remove any escaped characters and clean the string
    xmlString = xmlString.replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
                        .replace(/^['"]|['"]$/g, ''); // Remove wrapping quotes
    
    // Extract the boltArtifact attributes using more robust regex
    const idMatch = xmlString.match(/boltArtifact\s+id="([^"]*)"/);
    const titleMatch = xmlString.match(/title="([^"]*)"/);
    
    const id = idMatch ? idMatch[1] : '';
    const title = titleMatch ? titleMatch[1] : '';

    // Extract all boltAction elements of type "file"
    const actions: FileAction[] = [];
    const actionRegex = /<boltAction\s+type="file"\s+filePath="([^"]+)"[^>]*>([\s\S]*?)<\/boltAction>/g;
    let match;

    while ((match = actionRegex.exec(xmlString)) !== null) {
      const [_, filePath, content] = match;
      if (filePath && content) {
        actions.push({
          type: 'file',
          filePath,
          content: content.trim()
        });
      }
    }

    if (actions.length === 0) {
      console.warn('No file actions found in XML response');
      console.log('XML String:', xmlString);
    }

    return { id, title, actions };
  } catch (error) {
    console.error('Error parsing XML:', error);
    console.error('Response data:', response.data);
    throw new Error('Failed to parse XML response');
  }
};
