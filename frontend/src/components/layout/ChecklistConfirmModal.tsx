import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, Button, Text
} from '@chakra-ui/react';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import type { ChecklistConfirmModalProps } from '../../types';

export const ChecklistConfirmModal = ({ isOpen, onClose, onConfirm }: ChecklistConfirmModalProps) => {
    const theme = useMinimalTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={theme.cardBg} borderColor={theme.cardBorder} borderWidth="1px">
                <ModalHeader color={theme.textPrimary}>Confirmação de Preenchimento</ModalHeader>
                <ModalBody>
                    <Text color={theme.textSecondary}>
                        Tem certeza que quer preencher todo o checklist? Essa ação não poderá ser desfeita.
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} color={theme.textPrimary}>
                        Cancelar
                    </Button>
                    <Button colorScheme="blue" onClick={onConfirm}>
                        Sim, preencher tudo
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};