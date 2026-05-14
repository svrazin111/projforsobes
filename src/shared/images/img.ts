const images = import.meta.glob('/src/assets/images/*', { eager: true, import: 'default' })
const purple_error = `/src/assets/images/purple_error.png`

export function createImgUrl(name: string): string {
  const path = `/src/assets/images/${name}`
  const img = (images as Record<string, string>)[path]
  if (!img) {
    console.warn(`Image not found: ${name}`)
    return (images as Record<string, string>)[purple_error]
  }
  return img
}
