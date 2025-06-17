"use client"

import {
    Box,
    Container,
    Grid,
    Heading,
    Text,
    Stack,
    Icon,
    Flex
} from "@chakra-ui/react"
import {
    LuShield,
    LuZap,
    LuGlobe,
    LuTrendingUp,
    LuLock,
    LuUsers
} from "react-icons/lu"

const features = [
    {
        icon: LuShield,
        title: "Security First",
        description: "Multi-layer security protocols and smart contract audits ensure your investments are protected."
    },
    {
        icon: LuZap,
        title: "Lightning Fast",
        description: "Experience instant transactions with our optimized blockchain infrastructure."
    },
    {
        icon: LuGlobe,
        title: "Global Access",
        description: "Participate from anywhere in the world with support for multiple payment methods."
    },
    {
        icon: LuTrendingUp,
        title: "High Potential",
        description: "Early investors get the best rates with significant growth potential."
    },
    {
        icon: LuLock,
        title: "Transparent",
        description: "All transactions are recorded on blockchain for complete transparency."
    },
    {
        icon: LuUsers,
        title: "Community Driven",
        description: "Join thousands of investors building the future of decentralized finance."
    }
]

const Features = () => {
    return (
        <Box bg="white" _dark={{ bg: "gray.800" }} py="20">
            <Container maxW="7xl">
                <Stack textAlign="center" mb="16">
                    <Heading
                        fontSize={{ base: "3xl", md: "4xl" }}
                        fontWeight="bold"
                        color="gray.900"
                        _dark={{ color: "white" }}
                    >
                        Why Choose OCEAN ICO?
                    </Heading>
                    <Text
                        fontSize="xl"
                        color="gray.600"
                        _dark={{ color: "gray.400" }}
                        maxW="2xl"
                        mx="auto"
                    >
                        Join the revolution with cutting-edge features and unmatched security
                    </Text>
                </Stack>

                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap="8"
                >
                    {features.map((feature, index) => (
                        <Box
                            key={feature.title}
                            p="8"
                            bg="gray.50"
                            _dark={{ bg: "gray.700" }}
                            borderRadius="xl"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "xl"
                            }}
                            css={{
                                transition: "all 0.3s ease",
                                transitionDelay: `${index * 0.1}s`
                            }}
                        >
                            <Stack textAlign="center">
                                <Flex justify="center" mb="4">
                                    <Box
                                        p="3"
                                        bg="blue.100"
                                        borderRadius="full"
                                        color="blue.600"
                                        _dark={{ bg: "blue.900", color: "blue.400" }}
                                    >
                                        <Icon as={feature.icon} boxSize="6" />
                                    </Box>
                                </Flex>

                                <Heading size="md" mb="3">
                                    {feature.title}
                                </Heading>

                                <Text
                                    color="gray.600"
                                    _dark={{ color: "gray.400" }}
                                    lineHeight="1.6"
                                >
                                    {feature.description}
                                </Text>
                            </Stack>
                        </Box>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default Features 