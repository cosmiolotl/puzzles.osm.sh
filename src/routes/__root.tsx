import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts, useLocation } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { SiteNav } from '@/components/SiteNav'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'puzzles.osm.sh' },
      { name: 'description', content: 'osm.sh puzzles website' },
      { name: 'color-scheme', content: 'light' },
      { name: 'theme-color', content: '#f4f2ec' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-dvh">
      <SiteNav />
      <main className="px-4 sm:px-6 py-10">
        <pre className="text-ink whitespace-pre-wrap">
          {`$ open ${pathname}\nno such puzzle`}
        </pre>
      </main>
    </div>
  )
}
