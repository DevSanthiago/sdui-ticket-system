import { Box, Flex, Text, Divider, Icon } from '@chakra-ui/react';
import { FaSignature, FaCalendarAlt } from 'react-icons/fa';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { formatDate } from '../../helpers/dateHelpers';
import type { ChecklistSignatureBoxProps } from '../../types';

export const ChecklistSignatureBox = ({
    isViewMode, currentUserName, monitorName, startedAt, finishedAt
}: ChecklistSignatureBoxProps) => {
    const theme = useMinimalTheme();

    const borderColor = "blue.300";
    const bg = useColorModeValue("blue.50", "rgba(59, 130, 246, 0.1)");
    const textLabel = useColorModeValue("blue.700", "blue.200");
    const textValue = useColorModeValue("blue.600", "blue.300");
    const iconColor = "blue.500";

    return (
        <Box borderWidth="2px" borderColor={borderColor} borderStyle="dashed"
            borderRadius="lg" p={4} bg={bg} textAlign="center">
            <Icon as={FaSignature} boxSize={5} color={iconColor} mb={1} />
            <Text fontSize="xs" fontWeight="bold" color={textLabel}>
                {isViewMode ? 'Assinado por:' : 'Assinado digitalmente por:'}
            </Text>
            <Text fontFamily="Caveat" fontSize="2xl" fontWeight="700"
                color={textValue} mb={3}>
                {isViewMode ? monitorName : currentUserName}
            </Text>
            <Divider borderColor={borderColor} mb={3} />
            <Flex justify="center" gap={8} align="center" wrap="wrap">
                <Box>
                    <Text fontSize="xs" color="gray.500">Início:</Text>
                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                        {formatDate(startedAt)}
                    </Text>
                </Box>
                <Icon as={FaCalendarAlt} boxSize={5} color="gray.400" />
                <Box>
                    <Text fontSize="xs" color="gray.500">Término:</Text>
                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                        {formatDate(finishedAt)}
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};