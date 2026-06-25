import { useState, useMemo } from 'react';
import { iconOptions } from '../../constants/icons/iconOptions';

const ITEMS_PER_PAGE = 30;

export const useIconSelectionModal = () => {
    const [iconSearch, setIconSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const handleSearchChange = (value: string) => {
    setIconSearch(value);
    setCurrentPage(0);
};

    const filteredIcons = useMemo(() => {
        return iconOptions.filter(icon =>
            icon.label.toLowerCase().includes(iconSearch.toLowerCase())
        );
    }, [iconSearch]);

    const totalPages = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);

    const paginatedIcons = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return filteredIcons.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredIcons, currentPage]);

    const goToPrevPage = () => setCurrentPage(p => Math.max(0, p - 1));
    const goToNextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

    return {
        iconSearch,
        handleSearchChange,
        currentPage, totalPages,
        paginatedIcons, filteredIcons,
        goToPrevPage, goToNextPage,
    };
};