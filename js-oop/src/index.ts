import * as fs from 'node:fs'

export async function main(
  textPath: string | null,
  githubRepository: string | null,
  githubBranch: string | null,
  githubPath: string | null,
  lines: string | null,
  removeIndentation: boolean,
  asJson: boolean
) {
  let text = ''
  if (textPath !== null) {
    text = fs.readFileSync(textPath, 'utf-8')
  } else {
    const fullPath = `https://raw.githubusercontent.com/${githubRepository}/${githubBranch}/${githubPath}`
    text = await fetch(fullPath).then((e) => e.text())
  }
  let textLines = text.split('\n')
  if (lines) {
    const parts = lines.split(',')
    const selectedLines: string[] = []
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number)
        for (let i = start; i <= end; i++) {
          if (i - 1 < textLines.length) {
            selectedLines.push(textLines[i - 1])
          }
        }
      } else {
        const lineNum = Number(part)
        if (lineNum - 1 < textLines.length) {
          selectedLines.push(textLines[lineNum - 1])
        }
      }
    }
    textLines = selectedLines
  }
  if (removeIndentation) {
    textLines = textLines.map((line) => line.trimStart())
  }
  if (asJson) {
    return JSON.stringify({
      text: textLines.join('\n'),
    })
  } else {
    return textLines.join('\n')
  }
}
