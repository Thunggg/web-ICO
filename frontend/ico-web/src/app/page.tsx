"use client"

import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Grid,
  Container,
  Heading,
  Badge,
  Progress,
  Stat
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { LuTrendingUp, LuShield, LuZap, LuGlobe } from "react-icons/lu"
import ICOCard from "@/components/layout/ICOCard"
import Features from "@/components/layout/Features"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        bgGradient="linear(135deg, blue.400, purple.600)"
        _dark={{
          bgGradient: "linear(135deg, gray.800, gray.700)"
        }}
      >
        {/* Animated background elements */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.1"
          backgroundImage="radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)"
        />

        <Container maxW="7xl" py="20">
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            color="white"
            opacity={isLoaded ? 1 : 0}
            transform={isLoaded ? "translateY(0)" : "translateY(50px)"}
            css={{ transition: "all 0.8s ease" }}
          >
            <Badge
              mb="4"
              px="4"
              py="2"
              borderRadius="full"
              bg="whiteAlpha.200"
              color="white"
              fontSize="sm"
              fontWeight="medium"
            >
              🚀 Token Sale Live Now
            </Badge>

            <Heading
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              fontWeight="bold"
              mb="6"
              bgGradient="linear(to-r, white, gray.200)"
              bgClip="text"
              lineHeight="1.1"
            >
              🌊 OCEAN ICO
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              mb="8"
              maxW="600px"
              opacity="0.9"
              lineHeight="1.6"
            >
              Empowering the future of decentralized finance through innovative
              blockchain solutions. Join our community-driven ecosystem today.
            </Text>

            <Stack
              direction={{ base: "column", md: "row" }}
              gap="4"
              mb="12"
            >
              <Button
                size="lg"
                bg="white"
                color="purple.600"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "xl"
                }}
                css={{ transition: "all 0.3s ease" }}
                px="8"
                py="6"
                borderRadius="full"
                fontWeight="600"
              >
                Buy Tokens Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                borderColor="whiteAlpha.300"
                color="white"
                _hover={{
                  bg: "whiteAlpha.100",
                  transform: "translateY(-2px)"
                }}
                css={{ transition: "all 0.3s ease" }}
                px="8"
                py="6"
                borderRadius="full"
                fontWeight="600"
              >
                Read Whitepaper
              </Button>
            </Stack>

            {/* Stats */}
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
              gap="8"
              w="full"
            >
              {[
                { label: "Total Raised", value: "$2.4M", icon: LuTrendingUp },
                { label: "Token Price", value: "$0.15", icon: LuZap },
                { label: "Participants", value: "12,847", icon: LuGlobe },
                { label: "Security Score", value: "A+", icon: LuShield }
              ].map((stat, index) => (
                <Box
                  key={stat.label}
                  opacity={isLoaded ? 1 : 0}
                  transform={isLoaded ? "translateY(0)" : "translateY(20px)"}
                  css={{
                    transition: `all 0.8s ease`,
                    transitionDelay: `${0.2 + index * 0.1}s`
                  }}
                  textAlign="center"
                >
                  <Flex justify="center" mb="2">
                    <stat.icon size="24" />
                  </Flex>
                  <Text fontSize="2xl" fontWeight="bold">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" opacity="0.8">
                    {stat.label}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* Token Sale Progress */}
      <Container maxW="7xl" py="16">
        <Box
          opacity={isLoaded ? 1 : 0}
          transform={isLoaded ? "translateY(0)" : "translateY(30px)"}
          css={{ transition: "all 0.8s ease", transitionDelay: "0.4s" }}
          bg="white"
          _dark={{ bg: "gray.800" }}
          p="8"
          borderRadius="2xl"
          boxShadow="xl"
          mb="16"
        >
          <Flex
            direction={{ base: "column", lg: "row" }}
            align={{ base: "start", lg: "center" }}
            justify="space-between"
            mb="6"
          >
            <Box mb={{ base: "4", lg: "0" }}>
              <Heading size="lg" mb="2">
                Token Sale Progress
              </Heading>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                Don't miss out on this opportunity
              </Text>
            </Box>

            <Badge
              px="4"
              py="2"
              borderRadius="full"
              bg="green.100"
              color="green.800"
              _dark={{ bg: "green.900", color: "green.200" }}
              fontSize="sm"
            >
              Phase 2 Active
            </Badge>
          </Flex>

          <Box mb="4">
            <Flex justify="space-between" mb="2">
              <Text fontWeight="medium">Progress</Text>
              <Text fontWeight="bold">67%</Text>
            </Flex>
            <Progress.Root
              value={67}
              size="lg"
              borderRadius="full"
              bg="gray.100"
              _dark={{ bg: "gray.700" }}
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>

          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap="6"
            textAlign="center"
          >
            <Stat.Root>
              <Stat.Label>Sold</Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold">
                67M
              </Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
              <Stat.Label>Remaining</Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold">
                33M
              </Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
              <Stat.Label>Price</Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold">
                $0.15
              </Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
              <Stat.Label>Next Price</Stat.Label>
              <Stat.ValueText fontSize="2xl" fontWeight="bold">
                $0.20
              </Stat.ValueText>
            </Stat.Root>
          </Grid>
        </Box>

        {/* ICO Cards Section */}
        <Box
          opacity={isLoaded ? 1 : 0}
          transform={isLoaded ? "translateY(0)" : "translateY(30px)"}
          css={{ transition: "all 0.8s ease", transitionDelay: "0.6s" }}
          mb="12"
        >
          <Text
            textAlign="center"
            fontSize="3xl"
            fontWeight="bold"
            mb="4"
            color="gray.800"
            _dark={{ color: "white" }}
          >
            Choose Your Investment Method
          </Text>
          <Text
            textAlign="center"
            fontSize="lg"
            mb="12"
            color="gray.600"
            _dark={{ color: "gray.400" }}
            maxW="600px"
            mx="auto"
          >
            Multiple payment options available for your convenience
          </Text>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap="8"
          >
            <ICOCard
              title="USDT → OCEAN"
              description="Pay with USDT to get OCEAN tokens at the best rate"
              price="1 USDT = 6.67 OCEAN"
              icon="💰"
              isPopular={true}
            />
            <ICOCard
              title="ETH → OCEAN"
              description="Use Ethereum to purchase OCEAN tokens directly"
              price="1 ETH = 10,000 OCEAN"
              icon="⚡"
            />
            <ICOCard
              title="BNB → OCEAN"
              description="Pay with BNB on BSC network with lower fees"
              price="1 BNB = 2,500 OCEAN"
              icon="🚀"
            />
          </Grid>
        </Box>
      </Container>

      {/* Features Section */}
      <Features />
    </Box>
  )
}
