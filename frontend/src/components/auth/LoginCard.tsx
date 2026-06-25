import { useState } from 'react';
import {
    Box, Heading, Text, Input, Button, VStack, Icon, IconButton, Spinner, Select
} from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { AnimatedEyeLogin, AnimatedEyeOff } from '../icons/NewAnimatedIcons';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useLogin } from '../../hooks/auth/useLogin';

export const LoginCard = () => {
    const isDarkMode = useColorModeValue(false, true);
    const cardBg = useColorModeValue('white', 'black');
    const borderColor = useColorModeValue('gray.200', 'gray.800');
    const inputBg = useColorModeValue('white', 'black');
    const inputTextColor = useColorModeValue('gray.900', 'white');
    const placeholderColor = useColorModeValue('gray.400', 'gray.600');
    const iconColor = useColorModeValue('gray.500', 'gray.400');
    const labelColor = useColorModeValue('gray.700', 'gray.300');
    const headingColor = useColorModeValue('gray.900', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const focusBorderColor = useColorModeValue('black', 'white');
    const btnBg = useColorModeValue('black', 'white');
    const btnColor = useColorModeValue('white', 'black');
    const btnHoverBg = useColorModeValue('gray.800', 'gray.200');

    const [passwordHovered, setPasswordHovered] = useState(false);

    const {
        registration, setRegistration,
        password, setPassword,
        showPassword, setShowPassword,
        isLoading,
        plants, selectedPlant, setSelectedPlant, isLoadingPlants,
        handleLogin,
    } = useLogin();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.key === 'Enter' && registration && password && selectedPlant) handleLogin();
    };

    const autofillStyles = {
        '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${inputBg} inset`,
            WebkitTextFillColor: inputTextColor,
            transition: 'background-color 5000s ease-in-out 0s',
        },
    };

    return (
        <Box
            bg={cardBg} p={8} borderRadius="xl" boxShadow="2xl"
            borderWidth="1px" borderColor={borderColor}
            w={{ base: '100%', md: '420px' }} textAlign="center"
        >
            <Heading size="md" mb={1} color={headingColor} letterSpacing="tight">Acesso</Heading>
            <Text fontSize="sm" color={textColor} mb={6}>Entre com suas credenciais</Text>

            <VStack gap={5} align="stretch">
                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Usuário</Text>
                    <Box position="relative">
                        <Icon as={FaUser} color={iconColor} position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2} />
                        <Input
                            type="number" placeholder="Matrícula" value={registration}
                            onChange={(e) => setRegistration(e.target.value)} onKeyDown={handleKeyPress}
                            pl={10} bg={inputBg} color={inputTextColor} borderRadius="lg"
                            border="1px solid" borderColor={borderColor}
                            _placeholder={{ color: placeholderColor }} sx={autofillStyles}
                            _focus={{ borderColor: focusBorderColor, boxShadow: 'none' }}
                        />
                    </Box>
                </Box>

                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Senha</Text>
                    <Box position="relative">
                        <Icon as={FaLock} color={iconColor} position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2} />
                        <Input
                            type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password}
                            onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress}
                            pl={10} pr={10} bg={inputBg} color={inputTextColor} borderRadius="lg"
                            border="1px solid" borderColor={borderColor}
                            _placeholder={{ color: placeholderColor }} sx={autofillStyles}
                            _focus={{ borderColor: focusBorderColor, boxShadow: 'none' }}
                        />
                        <Box position="absolute" right={1} top="50%" transform="translateY(-50%)" zIndex={2}>
                            <IconButton
                                size="sm" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                onClick={() => setShowPassword(!showPassword)} variant="ghost" color={iconColor}
                                _hover={{ bg: 'transparent' }}
                                onMouseEnter={() => setPasswordHovered(true)}
                                onMouseLeave={() => setPasswordHovered(false)}
                                icon={showPassword
                                    ? <AnimatedEyeOff size={18} isHovered={passwordHovered} />
                                    : <AnimatedEyeLogin size={18} isHovered={passwordHovered} />}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Filial</Text>
                    <Select
                        value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} onKeyDown={handleKeyPress}
                        bg={inputBg} color={inputTextColor} borderRadius="lg" border="1px solid" borderColor={borderColor}
                        isDisabled={isLoadingPlants}
                        _focus={{ borderColor: focusBorderColor, boxShadow: 'none' }}
                    >
                        {isLoadingPlants ? (
                            <option value="">Carregando...</option>
                        ) : (
                            plants.map((plant) => (
                                <option key={plant.id} value={plant.id} style={{ background: isDarkMode ? 'black' : 'white' }}>
                                    {plant.name}
                                </option>
                            ))
                        )}
                    </Select>
                </Box>

                <Button
                    w="full" h="50px" bg={btnBg} color={btnColor}
                    _hover={{ bg: btnHoverBg }} _active={{ bg: btnHoverBg }} mt={2}
                    onClick={handleLogin} borderRadius="lg" fontWeight="bold" fontSize="sm" letterSpacing="widest"
                    disabled={isLoading || isLoadingPlants || !selectedPlant} transition="background 0.2s"
                >
                    {isLoading ? <Spinner size="sm" color={btnColor} /> : 'ENTRAR'}
                </Button>
            </VStack>
        </Box>
    );
};
