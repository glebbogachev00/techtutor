import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'programs')

export interface LessonMeta {
  slug: string
  title: string
  description: string
  duration: string
  order: number
  level: number
  type: string
}

export interface LevelMeta {
  number: number
  title: string
  description: string
  color: string
  project: { number: number; title: string; emoji: string }
  lessons: string[]
}

export interface ProgramMeta {
  slug: string
  title: string
  tagline: string
  description: string
  emoji: string
  color: string
  colorLight: string
  ages: string
  totalLessons: number
  levels: LevelMeta[]
}

export function getAllPrograms(): ProgramMeta[] {
  try {
    return fs.readdirSync(CONTENT_DIR)
      .filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
      .map(slug => getProgramMeta(slug))
      .filter(Boolean) as ProgramMeta[]
  } catch { return [] }
}

export function getProgramMeta(slug: string): ProgramMeta | null {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, slug, 'meta.json'), 'utf8')
    return { ...JSON.parse(raw), slug }
  } catch { return null }
}

export function getLessons(programSlug: string): LessonMeta[] {
  try {
    return fs.readdirSync(path.join(CONTENT_DIR, programSlug))
      .filter(f => f.endsWith('.mdx'))
      .sort()
      .map(file => {
        const slug = file.replace('.mdx', '')
        const raw = fs.readFileSync(path.join(CONTENT_DIR, programSlug, file), 'utf8')
        const { data } = matter(raw)
        return { slug, title: data.title, description: data.description, duration: data.duration, order: data.order, level: data.level, type: data.type }
      })
  } catch { return [] }
}

export function getLessonContent(programSlug: string, lessonSlug: string): { content: string; meta: LessonMeta } | null {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, programSlug, `${lessonSlug}.mdx`), 'utf8')
    const { data, content } = matter(raw)
    return { content, meta: { slug: lessonSlug, title: data.title, description: data.description, duration: data.duration, order: data.order, level: data.level, type: data.type } }
  } catch { return null }
}
