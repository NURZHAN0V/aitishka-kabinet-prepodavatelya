const svgModules = import.meta.glob('@/assets/icons/**/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const avifModules = import.meta.glob('@/assets/images/illustrations/**/*.avif', {
  eager: true,
  import: 'default',
})

const svgIcons = Object.fromEntries(
  Object.entries(svgModules).map(([path, content]) => {
    const name = path
      .split('/')
      .pop()
      .replace(/\.svg$/, '')
    return [name, content]
  }),
)

const avifIcons = Object.fromEntries(
  Object.entries(avifModules).map(([path, url]) => {
    const name = path
      .split('/')
      .pop()
      .replace(/\.avif$/, '')
    return [name, url]
  }),
)

export function getSvgIcon(name) {
  return svgIcons[name] ?? null
}

export function getAvifIcon(name) {
  return avifIcons[name] ?? null
}

export function hasIcon(name, type = 'svg') {
  return type === 'avif' ? name in avifIcons : name in svgIcons
}

export { svgIcons, avifIcons }
