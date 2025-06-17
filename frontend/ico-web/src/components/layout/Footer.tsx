"use client"

import { Box, Flex, Text, Stack, Grid, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useColorModeValue } from '@/components/ui/color-mode'
import {
    LuTwitter,
    LuGithub,
    LuLinkedin,
    LuMail,
    LuMapPin,
    LuPhone,
    LuExternalLink
} from 'react-icons/lu'

const Footer = () => {
    // Sử dụng useColorModeValue từ color-mode.tsx thay vì next-themes
    const bg = useColorModeValue('white', '#0f172a')
    const color = useColorModeValue('gray.800', 'white')
    const borderColor = useColorModeValue('gray.200', '#334155')
    const linkColor = useColorModeValue('gray.600', 'gray.300')
    const linkHoverColor = useColorModeValue('blue.500', 'blue.400')
    const mutedColor = useColorModeValue('gray.500', 'gray.400')
    const buttonBg = useColorModeValue('gray.100', '#1e293b')

    const footerLinks = {
        platform: [
            { label: 'How it Works', href: '#' },
            { label: 'Token Sale', href: '#' },
            { label: 'Whitepaper', href: '#' },
            { label: 'Roadmap', href: '#' }
        ],
        legal: [
            { label: 'Terms of Service', href: '#' },
            { label: 'Privacy Policy', href: '#' },
            { label: 'Risk Disclosure', href: '#' },
            { label: 'Compliance', href: '#' }
        ],
        support: [
            { label: 'Documentation', href: '#' },
            { label: 'FAQ', href: '#' },
            { label: 'Community', href: '#' },
            { label: 'Contact Support', href: '#' }
        ]
    }

    const socialLinks = [
        { icon: LuTwitter, href: '#', label: 'Twitter' },
        { icon: LuGithub, href: '#', label: 'GitHub' },
        { icon: LuLinkedin, href: '#', label: 'LinkedIn' },
        { icon: LuMail, href: 'mailto:contact@oceanico.com', label: 'Email' }
    ]

    return (
        <Box
            as="footer"
            bg={bg}
            color={color}
            borderTop="1px solid"
            borderColor={borderColor}
            mt="auto"
        >
            {/* Main Footer Content */}
            <Box maxW="7xl" mx="auto" px="6" py="12">
                <Grid
                    templateColumns={{
                        base: "1fr",
                        md: "2fr 1fr 1fr 1fr",
                        lg: "3fr 1fr 1fr 1fr 1fr"
                    }}
                    gap="8"
                >
                    {/* Brand Section */}
                    <Stack gap="4">
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" fontFamily="heading" mb="2">
                                🌊 OCEAN ICO
                            </Text>
                            <Text color={mutedColor} fontSize="sm" maxW="300px" lineHeight="1.6">
                                Empowering the future of decentralized finance through innovative blockchain solutions.
                                Join our community-driven ecosystem.
                            </Text>
                        </Box>

                        {/* Contact Info */}
                        <Stack gap="2" fontSize="sm">
                            <Flex align="center" gap="2" color={mutedColor}>
                                <LuMapPin size="14" />
                                <Text>Singapore, SG</Text>
                            </Flex>
                            <Flex align="center" gap="2" color={mutedColor}>
                                <LuMail size="14" />
                                <Text>contact@oceanico.com</Text>
                            </Flex>
                            <Flex align="center" gap="2" color={mutedColor}>
                                <LuPhone size="14" />
                                <Text>+65 8888 8888</Text>
                            </Flex>
                        </Stack>

                        {/* Social Links */}
                        <Flex gap="3" mt="4">
                            {socialLinks.map((social) => (
                                <IconButton
                                    key={social.label}
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    color={linkColor}
                                    _hover={{
                                        color: linkHoverColor,
                                        transform: 'translateY(-2px)',
                                        bg: buttonBg
                                    }}
                                    css={{
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                    >
                                        <social.icon />
                                    </a>
                                </IconButton>
                            ))}
                        </Flex>
                    </Stack>

                    {/* Platform Links */}
                    <Stack gap="4">
                        <Text fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                            Platform
                        </Text>
                        <Stack gap="2">
                            {footerLinks.platform.map((link) => (
                                <Text
                                    key={link.label}
                                    asChild
                                    fontSize="sm"
                                    color={linkColor}
                                    cursor="pointer"
                                    _hover={{
                                        color: linkHoverColor,
                                        textDecoration: 'none'
                                    }}
                                    css={{
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <a href={link.href}>
                                        {link.label}
                                    </a>
                                </Text>
                            ))}
                        </Stack>
                    </Stack>

                    {/* Legal Links */}
                    <Stack gap="4">
                        <Text fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                            Legal
                        </Text>
                        <Stack gap="2">
                            {footerLinks.legal.map((link) => (
                                <Text
                                    key={link.label}
                                    asChild
                                    fontSize="sm"
                                    color={linkColor}
                                    cursor="pointer"
                                    _hover={{
                                        color: linkHoverColor,
                                        textDecoration: 'none'
                                    }}
                                    css={{
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <a href={link.href}>
                                        {link.label}
                                    </a>
                                </Text>
                            ))}
                        </Stack>
                    </Stack>

                    {/* Support Links */}
                    <Stack gap="4">
                        <Text fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                            Support
                        </Text>
                        <Stack gap="2">
                            {footerLinks.support.map((link) => (
                                <Flex
                                    key={link.label}
                                    asChild
                                    align="center"
                                    gap="1"
                                    fontSize="sm"
                                    color={linkColor}
                                    cursor="pointer"
                                    _hover={{
                                        color: linkHoverColor,
                                        textDecoration: 'none'
                                    }}
                                    css={{
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    <a href={link.href}>
                                        <Text>{link.label}</Text>
                                        <LuExternalLink size="12" />
                                    </a>
                                </Flex>
                            ))}
                        </Stack>
                    </Stack>
                </Grid>
            </Box>

            {/* Footer Bottom */}
            <Box borderTop="1px solid" borderColor={borderColor}>
                <Flex
                    maxW="7xl"
                    mx="auto"
                    px="6"
                    py="4"
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap="4"
                >
                    <Text fontSize="sm" color={mutedColor}>
                        © 2024 Ocean ICO. All rights reserved.
                    </Text>

                    <Flex gap="6" fontSize="sm">
                        <Text
                            asChild
                            color={linkColor}
                            _hover={{ color: linkHoverColor }}
                            css={{
                                transition: 'color 0.2s'
                            }}
                        >
                            <a href="#">
                                Terms
                            </a>
                        </Text>
                        <Text
                            asChild
                            color={linkColor}
                            _hover={{ color: linkHoverColor }}
                            css={{
                                transition: 'color 0.2s'
                            }}
                        >
                            <a href="#">
                                Privacy
                            </a>
                        </Text>
                        <Text
                            asChild
                            color={linkColor}
                            _hover={{ color: linkHoverColor }}
                            css={{
                                transition: 'color 0.2s'
                            }}
                        >
                            <a href="#">
                                Cookies
                            </a>
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default Footer