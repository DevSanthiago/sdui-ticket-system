import { useState } from 'react';
import { Box, Heading, Text, Input, Button, VStack, Select, Spinner, IconButton, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { AnimatedEyeLogin, AnimatedEyeOff } from '../icons/NewAnimatedIcons';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useKioskAuth } from '../../hooks/kiosk/useKioskAuth';

export const KioskCard = () => {
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

    const [deviceKeyHovered, setDeviceKeyHovered] = useState(false);

    const {
        plants, deviceKey, setDeviceKey, showDeviceKey, setShowDeviceKey, selectedPlant, setSelectedPlant,
        displayName, setDisplayName, availableDepartments, selectedDepartmentIds, onSelectDepartments,
        isLoading, isLoadingPlants, handleSubmit
    } = useKioskAuth(isDarkMode);

    return (
        <Box
            bg={cardBg} p={8} borderRadius="xl" boxShadow="2xl"
            borderWidth="1px" borderColor={borderColor}
            w={{ base: '100%', md: '420px' }} textAlign="center"
        >
            <Heading size="md" mb={1} color={headingColor} letterSpacing="tight">Modo Kiosk</Heading>
            <Text fontSize="sm" color={textColor} mb={6}>Ative este dispositivo para exibir o painel em tela cheia</Text>

            <VStack gap={5} align="stretch">
                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Chave do Dispositivo</Text>
                    <Box position="relative">
                        <Input
                            type={showDeviceKey ? 'text' : 'password'} placeholder="Device key" value={deviceKey}
                            onChange={(e) => setDeviceKey(e.target.value)}
                            pr={10} bg={inputBg} color={inputTextColor} borderRadius="lg"
                            border="1px solid" borderColor={borderColor}
                            _placeholder={{ color: placeholderColor }}
                            _focus={{ borderColor: focusBorderColor, boxShadow: 'none' }}
                        />
                        <Box position="absolute" right={1} top="50%" transform="translateY(-50%)" zIndex={2}>
                            <IconButton
                                size="sm" aria-label={showDeviceKey ? 'Ocultar chave' : 'Mostrar chave'}
                                onClick={() => setShowDeviceKey(!showDeviceKey)} variant="ghost" color={iconColor}
                                _hover={{ bg: 'transparent' }}
                                onMouseEnter={() => setDeviceKeyHovered(true)}
                                onMouseLeave={() => setDeviceKeyHovered(false)}
                                icon={showDeviceKey
                                    ? <AnimatedEyeOff size={18} isHovered={deviceKeyHovered} />
                                    : <AnimatedEyeLogin size={18} isHovered={deviceKeyHovered} />}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Filial</Text>
                    <Select
                        value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}
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

                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Nome do Display (opcional)</Text>
                    <Input
                        placeholder="Ex: TV Engenharia - Linha 5" value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        bg={inputBg} color={inputTextColor} borderRadius="lg"
                        border="1px solid" borderColor={borderColor}
                        _placeholder={{ color: placeholderColor }}
                        _focus={{ borderColor: focusBorderColor, boxShadow: 'none' }}
                    />
                </Box>

                <Box textAlign="left">
                    <Text fontSize="xs" fontWeight="bold" mb={2} color={labelColor} textTransform="uppercase">Alerta sonoro no departamento</Text>
                    <Menu closeOnSelect={false} matchWidth>
                        <MenuButton
                            as={Button} rightIcon={<FiChevronDown />}
                            w="full" textAlign="left" fontWeight="normal"
                            bg={inputBg} color={inputTextColor} borderRadius="lg"
                            border="1px solid" borderColor={borderColor}
                            isDisabled={availableDepartments.length === 0}
                            _hover={{ bg: inputBg }} _active={{ bg: inputBg }}
                            _focus={{ borderColor: focusBorderColor, boxShadow: 'none' }}
                        >
                            {availableDepartments.length === 0
                                ? 'Selecione uma filial primeiro'
                                : selectedDepartmentIds.length === 0
                                    ? 'Todos os departamentos'
                                    : `${selectedDepartmentIds.length} selecionado(s)`}
                        </MenuButton>
                        <MenuList bg={inputBg} borderColor={borderColor} maxH="220px" overflowY="auto" zIndex={20}>
                            <MenuOptionGroup
                                type="checkbox"
                                value={selectedDepartmentIds.map(String)}
                                onChange={(value) => onSelectDepartments(value as string[])}
                            >
                                {availableDepartments.map((department) => (
                                    <MenuItemOption
                                        key={department.id} value={String(department.id)}
                                        bg={inputBg} color={inputTextColor} fontSize="sm"
                                        _hover={{ bg: isDarkMode ? 'whiteAlpha.200' : 'gray.100' }}
                                    >
                                        {department.name}
                                    </MenuItemOption>
                                ))}
                            </MenuOptionGroup>
                        </MenuList>
                    </Menu>
                    <Text fontSize="xs" color={textColor} mt={1.5}>Deixe vazio para tocar o alerta global, ou selecione apenas o departamento que deseja o alerta sonoro.</Text>
                </Box>

                <Button
                    w="full" h="50px" bg={btnBg} color={btnColor}
                    _hover={{ bg: btnHoverBg }} _active={{ bg: btnHoverBg }} mt={2}
                    onClick={handleSubmit} borderRadius="lg" fontWeight="bold" fontSize="sm" letterSpacing="widest"
                    isDisabled={isLoading || isLoadingPlants || !selectedPlant} transition="background 0.2s"
                >
                    {isLoading ? <Spinner size="sm" color={btnColor} /> : 'ATIVAR PAINEL'}
                </Button>
            </VStack>
        </Box>
    );
};
