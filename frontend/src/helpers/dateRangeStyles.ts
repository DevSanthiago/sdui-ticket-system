import type { SystemStyleObject } from '@chakra-ui/react';

interface DateRangeStyleParams {
    theme: Record<string, string>;
    primaryBg: string;
    primaryText: string;
    selectArrow: string;
}

export const buildDateRangeStyles = ({
    theme, primaryBg, primaryText, selectArrow
}: DateRangeStyleParams): SystemStyleObject => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '.rdrCalendarWrapper': {
        background: 'transparent',
        color: theme.textPrimary,
        width: '100%',
    },
    '.rdrDateDisplayWrapper': { backgroundColor: 'transparent' },
    '.rdrDateDisplayItem': {
        backgroundColor: theme.badgeBg,
        borderColor: theme.cardBorder,
        boxShadow: 'none',
        borderRadius: 'md',
    },
    '.rdrDateDisplayItemActive': { borderColor: theme.textPrimary },
    '.rdrDateDisplayItem input': { color: theme.textPrimary },
    '.rdrMonthAndYearPickers select': { color: primaryBg },
    '.rdrMonthPicker select, .rdrYearPicker select': {
        appearance: 'none',
        backgroundImage: selectArrow,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 2px center',
        paddingRight: '20px',
    },
    '.rdrMonthAndYearWrapper': { justifyContent: 'center' },
    '.rdrMonthName': { textAlign: 'center' },
    '.rdrMonth': { width: '100%', padding: 0 },
    '.rdrNextPrevButton': { background: theme.buttonBg },
    '.rdrNextPrevButton:hover': { background: theme.buttonHoverBg },
    '.rdrPprevButton i': {
        borderColor: `transparent ${primaryBg} transparent transparent`,
    },
    '.rdrNextButton i': {
        borderColor: `transparent transparent transparent ${primaryBg}`,
    },
    '.rdrWeekDays': { display: 'flex', width: '100%' },
    '.rdrWeekDay': {
        flex: '1 1 0',
        textAlign: 'center',
        fontWeight: 600,
        color: theme.textSecondary,
        fontSize: '0 !important',
        padding: 0,
    },
    '.rdrWeekDay::after': {
        fontSize: '0.72rem',
        display: 'block',
        textAlign: 'center',
    },
    '.rdrWeekDay:nth-child(1)::after': { content: '"Dom"' },
    '.rdrWeekDay:nth-child(2)::after': { content: '"Seg"' },
    '.rdrWeekDay:nth-child(3)::after': { content: '"Ter"' },
    '.rdrWeekDay:nth-child(4)::after': { content: '"Qua"' },
    '.rdrWeekDay:nth-child(5)::after': { content: '"Qui"' },
    '.rdrWeekDay:nth-child(6)::after': { content: '"Sex"' },
    '.rdrWeekDay:nth-child(7)::after': { content: '"Sáb"' },
    '.rdrDayNumber': { zIndex: 2 },
    '.rdrDayNumber span': { color: theme.textPrimary },
    '.rdrDayPassive .rdrDayNumber span': {
        color: theme.textSecondary,
        opacity: 0.4,
    },
    '.rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span, .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span, .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span': {
        color: `${primaryText} !important`,
        fontWeight: 'bold',
    },
});