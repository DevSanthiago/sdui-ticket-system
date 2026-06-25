import { Box, Button, Flex } from '@chakra-ui/react';
import { DateRange } from 'react-date-range';
import ptBR from 'date-fns/locale/pt-BR';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { buildDateRangeStyles } from '../../helpers/dateRangeStyles';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import type { CustomDateRangeProps } from '../../types';

export const CustomDateRange = ({ rangeState, onChange, onClose }: CustomDateRangeProps) => {
    const theme = useMinimalTheme();
    const isDark = useColorModeValue(false, true);
    const primaryBg = isDark ? '#FFFFFF' : '#000000';
    const primaryText = isDark ? '#000000' : '#FFFFFF';

    const selectArrow = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='${encodeURIComponent(primaryBg)}' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`;

    const calendarStyles = buildDateRangeStyles({
        theme: theme as Record<string, string>,
        primaryBg,
        primaryText,
        selectArrow,
    });

    return (
        <Box
            bg={isDark ? "#000000" : "white"}
            p={3}
            borderRadius="xl"
            shadow="2xl"
            borderWidth="1px"
            borderColor={isDark ? "whiteAlpha.200" : "gray.200"}
            sx={calendarStyles}
        >
            <Flex justifyContent="center" w="full">
                <DateRange
                    editableDateInputs={true}
                    onChange={onChange}
                    moveRangeOnFirstSelection={false}
                    ranges={rangeState}
                    months={1}
                    direction="horizontal"
                    locale={ptBR}
                    rangeColors={[primaryBg]}
                    showPreview={false}
                />
            </Flex>
            <Button
                size="sm"
                w="full"
                mt={4}
                bg={primaryBg}
                color={primaryText}
                _hover={{ opacity: 0.8 }}
                onClick={onClose}
            >
                Concluir Seleção
            </Button>
        </Box>
    );
};