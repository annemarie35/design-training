// READ SOURCE

import * as fs from 'node:fs'
import * as path from 'node:path'

interface Source {
  read(): Promise<string>
}

class FileSystemSource implements Source {
  constructor(private readonly textPath: string) {}

  async read() {
    return fs.promises.readFile(this.textPath, 'utf-8')
  }
}

class GithubSource implements Source {
  constructor(
    private readonly repository: string | null,
    private readonly branch: string | null,
    private readonly path: string | null
  ) {}

  async read() {
    const GITHUB_USER_CONTENT_BASE_URL = `https://raw.githubusercontent.com/`
    const fullPath = `${GITHUB_USER_CONTENT_BASE_URL}${this.repository}/${this.branch}/${this.path}`
    return await fetch(fullPath).then((response) => response.text())
  }
}

// ------------ OUTPUT FORMAT
export interface OutputFormat {
  toText(text: string): string
}

export class TextOutPutFormat implements OutputFormat {
  toText(text: string): string {
    return text
  }
}

export class JsonOutputFormat implements OutputFormat {
  toText(text: string): string {
    return JSON.stringify(text)
  }
}

// ------------ LINE SELECTOR
export interface LineSelector {
  selectLines(lines: string[]): string[]
}

export class AllLinesSelector implements LineSelector {
  // also called a Null Object with a default behaviour
  selectLines(lines: string[]): string[] {
    return lines
  }
}

export class SpecificLinesSelector implements LineSelector {
  constructor(private readonly lineSpec: string) {}

  selectLines(lines: string[]): string[] {
    // question pourquoi on utilise le this.linespec et pas les lines passé en paramètres ?
    const parts = this.lineSpec.split(',')
    const selectedLines: string[] = []
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number)
        for (let i = start; i <= end; i++) {
          if (i - 1 < lines.length) {
            selectedLines.push(lines[i - 1])
          }
        }
      } else {
        const lineNum = Number(part)
        if (lineNum - 1 < lines.length) {
          selectedLines.push(lines[lineNum - 1])
        }
      }
    }
    return selectedLines
  }
}

// ------------ LINE SELECTOR
// if (removeIndentation) {
//   textLines = removeIndentationFromText(textLines)
// }

export interface Formatter {
  format(lines: string[]): string[]
}

export class NoFormatting implements Formatter {
  format(lines: string[]): string[] {
    return lines
  }
}

export class IndentationFormatter implements Formatter {
  format(lines: string[]): string[] {
    return lines.map((line) => line.trimStart())
  }
}

async function mainOOP(
  source: Source,
  lineSelector: LineSelector,
  formatter: Formatter,
  outputFormat: OutputFormat
) {
  const sourceText = await source.read()

  const lines = sourceText.split('\n')
  const selectedLines = await lineSelector.selectLines(lines)
  const formattedLines = formatter.format(selectedLines)
  const finalText = formattedLines.join('\n')

  return outputFormat.toText(finalText)
}

const runText = () => {
  mainOOP(
    new FileSystemSource(path.resolve('samples', 'mobydick.txt')),
    new AllLinesSelector(),
    new NoFormatting(),
    new TextOutPutFormat()
  )
}

const runGithub = () => {
  mainOOP(
    new GithubSource('facebook/react', 'main', '.eslintrc.js'),
    new SpecificLinesSelector('10-12, 15, 17-20'),
    new IndentationFormatter(),
    new JsonOutputFormat()
  )
}
