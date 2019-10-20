import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { okaidia as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism"


const Code: React.FC<{
  snippet: string
  lang?: "tsx" | "jsx" | "javascript"
}> = ({ snippet, lang = "tsx" }) => {
  return (
    <SyntaxHighlighter language={lang} style={codeStyle} showLineNumbers={true}>
      {snippet}
    </SyntaxHighlighter>
  )
}

export default Code
