"use client"

import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'
import { useColorMode } from "@/components/ui/color-mode"

const Header = () => {
    const { toggleColorMode, colorMode } = useColorMode()

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            p="4"
            bg="header.bg"
            color="header.text"
            borderBottom="1px solid"
            borderColor="header.border"
        >
            <Box>
                <Text fontSize="xl" fontWeight="bold" fontFamily="heading">
                    🌊 OCEAN ICO
                </Text>
            </Box>

            <Flex gap="6" fontFamily="body">
                <Text cursor="pointer" _hover={{ color: "blue.400" }}>Home</Text>
                <Text cursor="pointer" _hover={{ color: "blue.400" }}>About</Text>
                <Text cursor="pointer" _hover={{ color: "blue.400" }}>Contact</Text>
            </Flex>

            <Flex gap="4" alignItems="center">
                <IconButton
                    onClick={toggleColorMode}
                    bg="button.bg"
                    color="button.text"
                    border="1px solid"
                    borderColor="button.border"
                    size="sm"
                    aria-label="Toggle color mode"
                    _hover={{
                        bg: "button.hover",
                        transform: "scale(1.05)"
                    }}
                    transition="all 0.2s"
                >
                    {colorMode === "light" ? <LuMoon /> : <LuSun />}
                </IconButton>

                <appkit-button />

            </Flex>
        </Flex>
    )
}

export default Header