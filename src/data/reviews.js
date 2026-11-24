const imageModules = import.meta.glob('../assets/photo1*.{jpg,webp,png,jpeg}', {
  eager: true,
  import: 'default'
});

export const reviews = Object.entries(imageModules)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: 'base' })
  )
  .map(([_, url], index) => ({
    id: index + 1,
    image: url
  }));