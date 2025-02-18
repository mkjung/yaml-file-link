import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const provider = new YamlFileLinkProvider();
    const providerRegistration = vscode.languages.registerDocumentLinkProvider(
        { language: 'yaml' },
        provider
    );

    context.subscriptions.push(providerRegistration);
}

class YamlFileLinkProvider implements vscode.DocumentLinkProvider {
    public provideDocumentLinks(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.DocumentLink[] {
        const links: vscode.DocumentLink[] = [];
        const regex = /(?:^|\s)(['"]?)([\.\/\w\-\s\\]+):(\d+)\1/g;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex);
            let match;

            while ((match = regex.exec(line.text)) !== null) {
                const filePath = match[2].trim();
                const lineNumber = parseInt(match[3]) - 1;
                const start = new vscode.Position(lineIndex, match.index + (match[0].startsWith(' ') ? 1 : 0));
                const end = new vscode.Position(lineIndex, match.index + match[0].length);
                
                try {
                    const absolutePath = path.isAbsolute(filePath) 
                        ? filePath 
                        : workspaceFolder 
                            ? path.join(workspaceFolder, filePath)
                            : path.join(path.dirname(document.uri.fsPath), filePath);

                    const uri = vscode.Uri.file(absolutePath).with({
                        fragment: `L${lineNumber + 1}`
                    });

                    const link = new vscode.DocumentLink(
                        new vscode.Range(start, end),
                        uri
                    );
                    
                    link.tooltip = `Open ${filePath}:${lineNumber + 1}`;
                    links.push(link);
                } catch (error) {
                    console.error(`Failed to create link for path: ${filePath}`, error);
                }
            }
        }

        return links;
    }

    public async resolveDocumentLink(
        link: vscode.DocumentLink,
        token: vscode.CancellationToken
    ): Promise<vscode.DocumentLink> {
        if (link.target) {
            const lineNumber = parseInt(link.target.fragment.substring(1)) - 1;
            const document = await vscode.workspace.openTextDocument(vscode.Uri.file(link.target.fsPath));
            const editor = await vscode.window.showTextDocument(document);
            
            // Move cursor to the specific line
            const position = new vscode.Position(lineNumber, 0);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(
                new vscode.Range(position, position),
                vscode.TextEditorRevealType.InCenter
            );
        }
        return link;
    }
}

export function deactivate() {}
