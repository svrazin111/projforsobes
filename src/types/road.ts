export type Road = {
  id: number
  code: number
  name: string
  full_name: string
  shortName: string
  administration: Administration
}

export type Administration = {
  id: number
  code: number
  name: string
  shortName: string
}
