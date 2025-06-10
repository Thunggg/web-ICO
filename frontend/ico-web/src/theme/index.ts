import { createSystem, defaultConfig } from "@chakra-ui/react"

const customConfig = {
  ...defaultConfig,
  initialColorMode: "dark",
  useSystemColorMode: false,
}

export const system = createSystem(customConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      colors: {
        bg: {
          light: { value: '#ffffff' },
          dark: { value: '#1a202c' }
        },
        text: {
          light: { value: '#2d3748' },
          dark: { value: '#e2e8f0' }
        },
      }
    },
  },
})