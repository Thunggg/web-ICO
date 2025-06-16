import { createSystem, defaultConfig } from "@chakra-ui/react"

const config = {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
      colors: {
        // Header background
        brand: {
          bg: {
            light: { value: '#ffffff' },      // white
            dark: { value: '#0f172a' }        // xanh đen đẹp
          },
          text: {
            light: { value: '#2d3748' },      // gray.800
            dark: { value: '#ffffff' }        // white
          },
          border: {
            light: { value: '#e2e8f0' },      // gray.200
            dark: { value: '#334155' }        // xanh đen nhạt
          }
        },
        // Button styling
        button: {
          bg: {
            light: { value: '#f7fafc' },      // gray.50
            dark: { value: '#1e293b' }        // xanh đen nhạt hơn
          },
          text: {
            light: { value: '#4a5568' },      // gray.700
            dark: { value: '#ffffff' }        // white
          },
          border: {
            light: { value: '#cbd5e0' },      // gray.300
            dark: { value: '#475569' }        // xanh xám
          },
          hover: {
            light: { value: '#edf2f7' },      // gray.100
            dark: { value: '#334155' }        // xanh đen hover
          }
        }
      }
    },
    semanticTokens: {
      colors: {
        // Header tokens
        'header.bg': {
          value: {
            base: "{colors.brand.bg.light}",
            _dark: "{colors.brand.bg.dark}"
          }
        },
        'header.text': {
          value: {
            base: "{colors.brand.text.light}",
            _dark: "{colors.brand.text.dark}"
          }
        },
        'header.border': {
          value: {
            base: "{colors.brand.border.light}",
            _dark: "{colors.brand.border.dark}"
          }
        },
        // Button tokens
        'button.bg': {
          value: {
            base: "{colors.button.bg.light}",
            _dark: "{colors.button.bg.dark}"
          }
        },
        'button.text': {
          value: {
            base: "{colors.button.text.light}",
            _dark: "{colors.button.text.dark}"
          }
        },
        'button.border': {
          value: {
            base: "{colors.button.border.light}",
            _dark: "{colors.button.border.dark}"
          }
        },
        'button.hover': {
          value: {
            base: "{colors.button.hover.light}",
            _dark: "{colors.button.hover.dark}"
          }
        }
      }
    }
  },
}

export const system = createSystem(defaultConfig, config)