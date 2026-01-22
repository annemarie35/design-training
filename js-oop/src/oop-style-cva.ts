import * as fs from 'node:fs'

// CVA approach: Commonality / Variablity Analysis.
interface Source {
  read(): Promise<string>
}

class TextFileSource implements Source {
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

async function mainCVAApproach(
  textPath: string | null,
  githubRepository: string | null,
  githubBranch: string | null,
  githubPath: string | null
) {
  let source: Source
  if (textPath !== null) {
    source = new TextFileSource(textPath)
  } else {
    source = new GithubSource(githubRepository, githubBranch, githubPath)
  }

  const text = await source.read()
  return text
}

// Dependency inversion
async function main(source: Source) {
  const text = await source.read()
}

// lift conditionals up
const source = new TextFileSource('my-text.txt')
const result = await main(source)

// Abstract Factory
// Factories are where conditionals go to die. Sandi Metz
