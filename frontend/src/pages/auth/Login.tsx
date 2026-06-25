import { Flex, Heading, Text, Image, VStack } from '@chakra-ui/react';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { LoginCard } from '../../components/auth/LoginCard';
import { KioskCard } from '../../components/auth/KioskCard';
import logoImg from '../../assets/img/new-logo-transparent-branding.svg';

export const Login = () => {
    const bg = useColorModeValue('gray.50', 'black');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const logoFilter = useColorModeValue('invert(1)', 'none');

    return (
        <Flex minH="100vh" align="center" justify="center" bg={bg} p={6}>
            <VStack spacing={8} w="100%" maxW="900px">
                <VStack spacing={2}>
                    <Image src={logoImg} alt="Logo" h="70px" objectFit="contain" filter={logoFilter} />
                    <Heading size="lg" color={headingColor} letterSpacing="tight">Ticket System</Heading>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                        Acesse com sua conta ou ative o modo painel (TV)
                    </Text>
                </VStack>

                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="stretch" justify="center"
                    gap={6} w="100%"
                >
                    <LoginCard />
                    <KioskCard />
                </Flex>
            </VStack>
        </Flex>
    );
};
