
'use client'
import { createGlobalStore, GlobalStoreProvider } from '@/store/globalStore';


export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalStore = createGlobalStore()
  return (
    <GlobalStoreProvider store={globalStore}>
      {children}
    </GlobalStoreProvider>
  )
}