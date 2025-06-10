'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/theme' // Đường dẫn tới theme bạn đã tạo

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      {children}
    </ChakraProvider>
  )
}