import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import * as fs from 'node:fs'
import { main } from '../src/index.js'

describe('main function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('lecture de fichier local', () => {
    vi.mock('node:fs', { spy: true })

    it('devrait lire un fichier local correctement', async () => {
      const mockContent = 'line1\nline2\nline3'
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        return mockContent
      })

      const result = await main('test.txt', null, null, null, null, false, false)

      expect(fs.readFileSync).toHaveBeenCalledWith('test.txt', 'utf-8')
      expect(result).toBe(mockContent)
    })

    it('devrait retourner le contenu en JSON quand asJson est true', async () => {
      const mockContent = 'line1\nline2'
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        return mockContent
      })

      const result = await main('test.txt', null, null, null, null, false, true)

      expect(result).toBe(JSON.stringify({ text: mockContent }))
    })
  })

  describe('lecture depuis GitHub', () => {
    it('devrait récupérer du contenu depuis GitHub', async () => {
      const mockContent = 'github line1\ngithub line2'
      global.fetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(mockContent),
      })

      const result = await main(null, 'user/repo', 'main', 'path/to/file.txt', null, false, false)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/user/repo/main/path/to/file.txt'
      )
      expect(result).toBe(mockContent)
    })

    it("devrait construire correctement l'URL GitHub", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve('content'),
      })

      await main(null, 'myuser/myrepo', 'develop', 'src/index.ts', null, false, false)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/myuser/myrepo/develop/src/index.ts'
      )
    })
  })

  describe('sélection de lignes', () => {
    const mockContent = 'line1\nline2\nline3\nline4\nline5'

    beforeEach(() => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)
    })

    it('devrait sélectionner une seule ligne', async () => {
      const result = await main('test.txt', null, null, null, '2', false, false)
      expect(result).toBe('line2')
    })

    it('devrait sélectionner plusieurs lignes individuelles', async () => {
      const result = await main('test.txt', null, null, null, '1,3,5', false, false)
      expect(result).toBe('line1\nline3\nline5')
    })

    it('devrait sélectionner une plage de lignes', async () => {
      const result = await main('test.txt', null, null, null, '2-4', false, false)
      expect(result).toBe('line2\nline3\nline4')
    })

    it('devrait combiner lignes individuelles et plages', async () => {
      const result = await main('test.txt', null, null, null, '1,3-4,5', false, false)
      expect(result).toBe('line1\nline3\nline4\nline5')
    })

    it('devrait gérer les numéros de lignes hors limites', async () => {
      const result = await main('test.txt', null, null, null, '1,10,20', false, false)
      expect(result).toBe('line1')
    })

    it('devrait gérer une plage dépassant le nombre de lignes', async () => {
      const result = await main('test.txt', null, null, null, '3-10', false, false)
      expect(result).toBe('line3\nline4\nline5')
    })
  })

  describe("suppression de l'indentation", () => {
    it("devrait supprimer l'indentation des lignes", async () => {
      const mockContent = '  line1\n    line2\n\tline3'
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)

      const result = await main('test.txt', null, null, null, null, true, false)

      expect(result).toBe('line1\nline2\nline3')
    })

    it('devrait conserver les lignes sans indentation', async () => {
      const mockContent = 'line1\nline2'
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)

      const result = await main('test.txt', null, null, null, null, true, false)

      expect(result).toBe('line1\nline2')
    })

    it("ne devrait pas supprimer l'indentation quand removeIndentation est false", async () => {
      const mockContent = '  line1\n    line2'
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)

      const result = await main('test.txt', null, null, null, null, false, false)

      expect(result).toBe('  line1\n    line2')
    })
  })

  describe('combinaison de paramètres', () => {
    it("devrait combiner sélection de lignes et suppression d'indentation", async () => {
      const mockContent = '  line1\n    line2\n  line3\n    line4'
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)

      const result = await main('test.txt', null, null, null, '1-2,4', true, false)

      expect(result).toBe('line1\nline2\nline4')
    })

    it('devrait combiner tous les paramètres (lignes, indentation, JSON)', async () => {
      const mockContent = '  line1\n    line2\n  line3'
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)

      const result = await main('test.txt', null, null, null, '1,3', true, true)

      expect(result).toBe(JSON.stringify({ text: 'line1\nline3' }))
    })
  })

  describe('cas limites', () => {
    it('devrait gérer un fichier vide', async () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('')

      const result = await main('test.txt', null, null, null, null, false, false)

      expect(result).toBe('')
    })

    it('devrait gérer un fichier avec une seule ligne sans retour à la ligne', async () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('single line')

      const result = await main('test.txt', null, null, null, null, false, false)

      expect(result).toBe('single line')
    })

    it('devrait gérer des lignes vides', async () => {
      const mockContent = 'line1\n\nline3'
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent)

      const result = await main('test.txt', null, null, null, null, false, false)

      expect(result).toBe('line1\n\nline3')
    })
  })
})
