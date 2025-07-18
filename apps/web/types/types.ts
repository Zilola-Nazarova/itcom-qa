export type Question = {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    email?: string | null
  }
}
