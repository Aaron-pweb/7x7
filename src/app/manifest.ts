import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '7x7 Journal',
    short_name: '7x7',
    description: 'Ten days of disciplined, identical questions yielding transformative insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBFA',
    theme_color: '#A7321C',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
