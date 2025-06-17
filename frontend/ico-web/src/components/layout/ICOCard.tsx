"use client"

import {
    Box,
    Card,
    Text,
    Button,
    Flex,
    Badge,
    Input,
    Stack,
    Heading,
    HStack
} from "@chakra-ui/react"
import { useState } from "react"
import { LuArrowRight, LuCheck } from "react-icons/lu"

interface ICOCardProps {
    title: string
    description: string
    price: string
    icon: string
    isPopular?: boolean
}

const ICOCard = ({ title, description, price, icon, isPopular = false }: ICOCardProps) => {
    const [amount, setAmount] = useState("")
    const [tokenAmount, setTokenAmount] = useState("0")

    const handleAmountChange = (value: string) => {
        setAmount(value)
        // Simple calculation for demo - you'll need real calculation logic
        const multiplier = title.includes("USDT") ? 6.67 : title.includes("ETH") ? 10000 : 2500
        const tokens = parseFloat(value || "0") * multiplier
        setTokenAmount(tokens.toLocaleString())
    }

    return (
        <Card.Root
            maxW="sm"
            overflow="hidden"
            position="relative"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ bg: "gray.800", borderColor: "gray.700" }}
            _hover={{
                transform: "scale(1.02)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            css={{ transition: "all 0.3s ease" }}
        >
            {isPopular && (
                <Box
                    position="absolute"
                    top="0"
                    right="0"
                    zIndex="1"
                >
                    <Badge
                        bg="purple.500"
                        color="white"
                        px="3"
                        py="1"
                        borderRadius="0 0 0 lg"
                        fontSize="xs"
                        fontWeight="bold"
                    >
                        🔥 POPULAR
                    </Badge>
                </Box>
            )}

            <Card.Body p="6">
                {/* Header */}
                <Flex align="center" mb="4">
                    <Text fontSize="2xl" mr="3">
                        {icon}
                    </Text>
                    <Box>
                        <Heading size="md" mb="1">
                            {title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                            {description}
                        </Text>
                    </Box>
                </Flex>

                {/* Exchange Rate */}
                <Box
                    bg="gray.50"
                    _dark={{ bg: "gray.700" }}
                    p="4"
                    borderRadius="lg"
                    mb="4"
                >
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} mb="1">
                        Exchange Rate
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="green.600" _dark={{ color: "green.400" }}>
                        {price}
                    </Text>
                </Box>

                {/* Input Section */}
                <Stack gap="4">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb="2">
                            Amount to pay
                        </Text>
                        <Input
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            size="lg"
                            type="number"
                            bg="white"
                            _dark={{ bg: "gray.700" }}
                        />
                    </Box>

                    <Flex align="center" justify="center" py="2">
                        <Box
                            bg="gray.100"
                            _dark={{ bg: "gray.700" }}
                            p="2"
                            borderRadius="full"
                        >
                            <LuArrowRight size="16" />
                        </Box>
                    </Flex>

                    <Box>
                        <Text fontSize="sm" fontWeight="medium" mb="2">
                            You will receive
                        </Text>
                        <Box
                            bg="gray.50"
                            p="4"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.200"
                            _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                        >
                            <Text fontSize="xl" fontWeight="bold">
                                {tokenAmount} OCEAN
                            </Text>
                        </Box>
                    </Box>
                </Stack>
            </Card.Body>

            <Card.Footer p="6" pt="0">
                <Stack w="full" gap="3">
                    <Button
                        size="lg"
                        w="full"
                        bgGradient="linear(to-r, blue.500, purple.600)"
                        color="white"
                        _hover={{
                            bgGradient: "linear(to-r, blue.600, purple.700)",
                            transform: "translateY(-1px)"
                        }}
                        css={{ transition: "all 0.2s ease" }}
                        fontWeight="600"
                        borderRadius="lg"
                    >
                        Buy Now
                    </Button>

                    <HStack fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} justify="center">
                        <LuCheck size="12" />
                        <Text>Secure & Verified</Text>
                    </HStack>
                </Stack>
            </Card.Footer>
        </Card.Root>
    )
}

export default ICOCard 