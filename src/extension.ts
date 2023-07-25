// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import * as https from "https"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "chatgpt-accessibility-analyser" is now active!')

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand(
    //     "chatgpt-accessibility-analyser.helloWorld",
    //     () => {
    //         // The code you place here will be executed every time your command is executed
    //         // Display a message box to the user
    //         vscode.window.showInformationMessage("Uh, hi? from chatgpt-accessibility-analyser!")
    //     },
    // )

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable2 = vscode.commands.registerCommand(
        "chatgpt-accessibility-analyser.analyseblock",
        () => {
            const editor = vscode.window.activeTextEditor!
            const selection = editor.selection
            const highlightedText = editor.document.getText(selection)

            try {
                const req = https.request(
                    {
                        hostname: "api.openai.com",
                        path: "/v1/chat/completions",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer NICETRY",
                        },
                    },
                    res => {
                        let data = ""

                        // Concatenate the response data
                        res.on("data", chunk => {
                            data += chunk
                        })

                        // Process the response when it finishes
                        res.on("end", () => {
                            try {
                                // Parse the API response JSON
                                const response = JSON.parse(data)
                                console.log(response)

                                // Extract the response message text from the API response
                                const responseMessage = response.choices[0].message.content

                                vscode.workspace
                                    .openTextDocument({
                                        language: "markdown",
                                        content: responseMessage,
                                    })
                                    .then(doc => {
                                        vscode.commands.executeCommand(
                                            "markdown.showPreviewToSide",
                                            doc.uri,
                                        )
                                        // vscode.window.showTextDocument(document)
                                    })
                            } catch (error: any) {
                                console.log(error)
                                vscode.window.showErrorMessage(
                                    "Error parsing API response: " + error.message,
                                )
                            }
                        })
                    },
                )

                req.on("error", error => {
                    console.log(error)
                    vscode.window.showErrorMessage("Error making API request: " + error.message)
                })

                // Send the highlighted text as the request body
                req.write(
                    JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "user",
                                content:
                                    "analyse aria accessibility and provide code samples: " +
                                    highlightedText,
                            },
                        ],
                        temperature: 0.7,
                    }),
                )
                req.end()
            } catch (error: any) {
                vscode.window.showErrorMessage("Error making API request: " + error.message)
            }
        },
    )

    // context.subscriptions.push(disposable)
    context.subscriptions.push(disposable2)
}

// This method is called when your extension is deactivated
export function deactivate() {}
