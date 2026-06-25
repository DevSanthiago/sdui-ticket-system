import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';

interface ThemedSelectOption {
    value: string;
    label: string;
}

interface ThemedSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: ThemedSelectOption[];
    placeholder?: string;
}

export const ThemedSelect = ({ value, onChange, options, placeholder = 'Selecione...' }: ThemedSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const triggerBg = useColorModeValue('gray.50', 'gray.900');
    const dropdownBg = useColorModeValue('white', 'black');
    const borderColor = useColorModeValue('gray.200', 'gray.800');
    const focusBorder = useColorModeValue('black', 'white');
    const textColor = useColorModeValue('gray.800', 'white');
    const placeholderColor = useColorModeValue('gray.400', 'gray.500');
    const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');
    const selectedBg = useColorModeValue('gray.100', 'whiteAlpha.300');
    const scrollThumb = useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)');

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const selected = options.find(o => o.value === value);

    return (
        <Box position="relative" ref={ref}>
            <Flex
                as="button" type="button" w="100%" align="center" justify="space-between"
                px={4} h="40px" borderRadius="md" borderWidth="1px"
                bg={triggerBg} borderColor={borderColor}
                color={selected ? textColor : placeholderColor}
                onClick={() => setIsOpen(prev => !prev)}
                _hover={{ borderColor: focusBorder }}
                _focusVisible={{ borderColor: focusBorder, boxShadow: 'none', outline: 'none' }}
                transition="border-color 0.2s"
            >
                <Text fontSize="sm" isTruncated>{selected ? selected.label : placeholder}</Text>
                <Box as={ChevronDown} boxSize="16px" flexShrink={0}
                    transform={isOpen ? 'rotate(180deg)' : 'none'} transition="transform 0.2s" />
            </Flex>

            {isOpen && (
                <Box
                    position="absolute" top="calc(100% + 4px)" left={0} right={0} zIndex={20}
                    bg={dropdownBg} borderWidth="1px" borderColor={borderColor} borderRadius="md"
                    boxShadow="lg" maxH="220px" overflowY="auto" overflowX="hidden"
                    css={{
                        '&::-webkit-scrollbar': { width: '6px' },
                        '&::-webkit-scrollbar-thumb': { background: scrollThumb, borderRadius: '4px' },
                    }}
                >
                    {options.length === 0 ? (
                        <Box px={4} py={2.5} fontSize="sm" color={placeholderColor}>Nenhuma opção disponível</Box>
                    ) : (
                        options.map(opt => (
                            <Box
                                key={opt.value} px={4} py={2.5} cursor="pointer" fontSize="sm"
                                color={textColor}
                                bg={opt.value === value ? selectedBg : 'transparent'}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.15s"
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            >
                                {opt.label}
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
};
