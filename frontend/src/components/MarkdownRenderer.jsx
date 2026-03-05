import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }) {
    return (
        <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
            <style dangerouslySetInnerHTML={{
                __html: `
                .markdown-content {
                    font-family: var(--font-body);
                    line-height: 1.6;
                    color: var(--text-primary);
                }
                .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-weight: 700;
                    color: var(--amber);
                }
                .markdown-content p {
                    margin-bottom: 1em;
                }
                .markdown-content ul, .markdown-content ol {
                    margin-bottom: 1em;
                    padding-left: 1.5em;
                }
                .markdown-content li {
                    margin-bottom: 0.5em;
                }
                .markdown-content code {
                    background: var(--bg-raised);
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.9em;
                    border: 1px solid var(--border);
                }
                .markdown-content pre {
                    background: var(--bg-raised);
                    padding: 1em;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin-bottom: 1em;
                    border: 1px solid var(--border);
                }
                .markdown-content blockquote {
                    border-left: 4px solid var(--amber);
                    padding-left: 1em;
                    margin-left: 0;
                    color: var(--text-secondary);
                    font-style: italic;
                }
                .markdown-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 1em;
                }
                .markdown-content th, .markdown-content td {
                    border: 1px solid var(--border);
                    padding: 8px;
                    text-align: left;
                }
                .markdown-content th {
                    background: var(--bg-raised);
                }
            `}} />
        </div>
    );
}
