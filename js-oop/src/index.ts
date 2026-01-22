import * as fs from 'node:fs'

function getReadFileSync(textPath: string) {
  return fs.readFileSync(textPath, 'utf-8')
}

async function getText(
  githubRepository: string | null,
  githubBranch: string | null,
  githubPath: string | null
) {
  const GITHUB_USER_CONTENT_BASE_URL = `https://raw.githubusercontent.com/`
  const fullPath = `${GITHUB_USER_CONTENT_BASE_URL}${githubRepository}/${githubBranch}/${githubPath}`

  return await fetch(fullPath).then((response) => response.text())
}

function removeIndentationFromText(textLines: string[]) {
  return textLines.map((line) => line.trimStart())
}

function convertToJson(textLines: string[]) {
  return JSON.stringify({
    text: textLines.join('\n'),
  })
}

function extractSelectedLines(lines: string, textLines: string[]) {
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
  return selectedLines
}

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
    text = getReadFileSync(textPath)
  } else {
    text = await getText(githubRepository, githubBranch, githubPath)
  }
  let textLines = text.split('\n')
  if (lines) {
    textLines = extractSelectedLines(lines, textLines)
  }
  if (removeIndentation) {
    textLines = removeIndentationFromText(textLines)
  }
  if (asJson) {
    return convertToJson(textLines)
  } else {
    return textLines.join('\n')
  }
}
