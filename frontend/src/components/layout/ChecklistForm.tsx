import {
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, Button, VStack, FormControl,
  FormLabel, Textarea, Box, Flex, Text, Heading, Badge,
  Input, SimpleGrid, Spinner, Image, useColorModeValue,
} from '@chakra-ui/react';
import { AnimatedFileText, AnimatedFileCheck2 } from '../icons/NewAnimatedIcons';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useChecklistForm } from '../../hooks/checklist/useChecklistForm';
import { ChecklistConfirmModal } from './ChecklistConfirmModal';
import { ChecklistItemsGrid } from './ChecklistItemsGrid';
import { ChecklistSignatureBox } from './ChecklistSignatureBox';
import logoApp from '../../assets/img/new-logo-transparent-branding.svg';
import type { ChecklistFormProps } from '../../types';

export const ChecklistForm = ({ isOpen, onClose, ticket, currentUser, onSuccess }: ChecklistFormProps) => {
  const theme = useMinimalTheme();
  const isDarkMode = useColorModeValue(false, true);

  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const readOnlyInputBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  const greenNeon = isDarkMode ? '#48BB78' : '#2F855A';

  const metaBadgeBorder = useColorModeValue('gray.300', 'whiteAlpha.300');

  const {
    template, loadingTemplate,
    items, fields,
    content, setFieldValue,
    canFill, isViewMode, canDownloadPdf,
    safeChecks, allChecked, isIndeterminate,
    isSubmitting, isDownloading,
    hoverPdf, setHoverPdf,
    hoverSubmit, setHoverSubmit,
    isConfirmOpen, onCloseConfirm,
    handleCheckChange,
    handleMasterCheckboxChange,
    handleConfirmSelectAll,
    handleDownloadPdf,
    handleSubmit,
  } = useChecklistForm({ isOpen, ticket, currentUser, onSuccess, onClose, isDarkMode });

  if (!ticket) return null;

  const schema = template?.schema;
  const title = schema?.title || 'Checklist';

  const metaBadges = [
    schema?.emissionDate && `Emissão: ${schema.emissionDate}`,
    schema?.revision,
    schema?.elaboratedBy && `Elaborado: ${schema.elaboratedBy}`,
    schema?.approvedBy && `Aprovado: ${schema.approvedBy}`,
  ].filter(Boolean) as string[];

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen} size="full">
      <DrawerOverlay backdropFilter="blur(3px)" />
      <DrawerContent
        bg={theme.cardBg}
        boxShadow="2xl"
        maxH="96vh"
        maxW="1280px"
        mx="auto"
        borderTopRadius="24px"
        borderTopWidth="1px"
        borderColor={theme.cardBorder}
      >
        <DrawerCloseButton color={theme.textSecondary} top={4} right={4} zIndex={3} />

        <DrawerHeader borderBottomWidth="1px" py={4} borderColor={theme.cardBorder}>
          <Flex align="center" justify="space-between" gap={4} wrap="nowrap">
            <Box w={{ base: '120px', md: '180px' }} flexShrink={0}>
              <Image
                src={logoApp}
                alt="Logo"
                h="32px"
                w="auto"
                objectFit="contain"
              />
            </Box>

            <Box flex="1" textAlign="center" px={4}>
              <Heading size="md" mb={2} color={theme.textPrimary}>{title}</Heading>

              <Flex gap={2} align="center" justify="center" mb={2} wrap="wrap">
                <Badge colorScheme="orange">Ticket ID {ticket.id}</Badge>
                {ticket.lineName && (
                  <Text fontSize="sm" color={theme.textSecondary}>{ticket.lineName}</Text>
                )}
              </Flex>

              {metaBadges.length > 0 && (
                <Flex gap={2} wrap="wrap" justify="center">
                  {metaBadges.map((b, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      borderColor={metaBadgeBorder}
                      color={theme.textSecondary}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                    >
                      {b}
                    </Badge>
                  ))}
                </Flex>
              )}
            </Box>

            <Box
              w={{ base: '120px', md: '180px' }}
              flexShrink={0}
              textAlign="right"
              pr={{ base: 6, md: 10 }}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              {schema?.documentCode && (
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight="bold"
                  letterSpacing="wide"
                  color={theme.textPrimary}
                  whiteSpace="nowrap"
                >
                  {schema.documentCode}
                </Text>
              )}
            </Box>
          </Flex>
        </DrawerHeader>

        <DrawerBody px={{ base: 4, md: 8 }} py={6}>
          {loadingTemplate ? (
            <Flex justify="center" align="center" py={20}>
              <Spinner size="lg" color={theme.textSecondary} />
            </Flex>
          ) : (
            <VStack spacing={6} align="stretch">
              {canDownloadPdf && (
                <Box
                  bg="transparent" borderWidth="1px" borderColor={greenNeon} borderRadius="lg" p={3}
                  boxShadow={`0 0 10px ${greenNeon}88, inset 0 0 10px ${greenNeon}55`}
                >
                  <Flex align="center" gap={2}>
                    <AnimatedFileCheck2 isHovered={true} size={20} color={greenNeon} />
                    <Text fontSize="sm" fontWeight="medium" color={greenNeon}>
                      Checklist preenchido! Download do PDF disponível.
                    </Text>
                  </Flex>
                </Box>
              )}

              {fields.length > 0 && (
                <Box bg={inputBg} p={5} borderRadius="lg" borderWidth="1px" borderColor={theme.cardBorder}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={5}>
                    {fields.map(field => {
                      const readOnly = isViewMode || field.readOnly;
                      const value = content.fields[field.id] || field.defaultValue || '';
                      const isWide = field.type === 'textarea';
                      return (
                        <FormControl
                          key={field.id}
                          isRequired={field.required && !isViewMode}
                          gridColumn={isWide ? { md: '1 / -1' } : undefined}
                        >
                          <FormLabel fontWeight="bold" color={theme.textPrimary}>{field.label}</FormLabel>
                          {isWide ? (
                            <Textarea
                              rows={3} value={value} isReadOnly={readOnly}
                              tabIndex={readOnly ? -1 : undefined}
                              placeholder={readOnly ? '' : 'Digite aqui...'}
                              bg={readOnly ? readOnlyInputBg : theme.bgApp} color={theme.textPrimary}
                              borderColor={theme.cardBorder}
                              focusBorderColor={theme.inputFocusBorder}
                              cursor={readOnly ? 'not-allowed' : 'text'}
                              pointerEvents={readOnly ? 'none' : 'auto'}
                              _focus={readOnly ? { boxShadow: 'none', borderColor: theme.cardBorder } : undefined}
                              onChange={(e) => setFieldValue(field.id, e.target.value)}
                            />
                          ) : (
                            <Input
                              value={value} isReadOnly={readOnly}
                              tabIndex={readOnly ? -1 : undefined}
                              placeholder={readOnly ? '' : 'Digite aqui...'}
                              bg={readOnly ? readOnlyInputBg : theme.bgApp} color={theme.textPrimary}
                              borderColor={theme.cardBorder}
                              focusBorderColor={theme.inputFocusBorder}
                              cursor={readOnly ? 'not-allowed' : 'text'}
                              pointerEvents={readOnly ? 'none' : 'auto'}
                              _focus={readOnly ? { boxShadow: 'none', borderColor: theme.cardBorder } : undefined}
                              onChange={(e) => setFieldValue(field.id, e.target.value)}
                            />
                          )}
                        </FormControl>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              )}

              <ChecklistItemsGrid
                items={items}
                safeChecks={safeChecks}
                isViewMode={isViewMode}
                isMonitor={canFill}
                allChecked={allChecked}
                isIndeterminate={isIndeterminate}
                onCheckChange={handleCheckChange}
                onMasterChange={handleMasterCheckboxChange}
              />

              <ChecklistConfirmModal
                isOpen={isConfirmOpen}
                onClose={onCloseConfirm}
                onConfirm={handleConfirmSelectAll}
              />

              <ChecklistSignatureBox
                isViewMode={isViewMode}
                currentUserName={currentUser?.name}
                monitorName={ticket.monitorName}
                startedAt={ticket.startedAt}
                finishedAt={ticket.finishedAt}
              />
            </VStack>
          )}
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" pb={6} borderColor={theme.cardBorder}>
          <Flex w="100%" gap={3}>
            <Button
              variant="outline" onClick={onClose} h="50px" flex={1}
              color={theme.textPrimary} borderColor={theme.cardBorder}
              _hover={{ bg: theme.buttonHoverBg }}
            >
              {isViewMode ? 'Fechar' : 'Cancelar'}
            </Button>

            {canDownloadPdf && (
              <Button
                bg="red.500" color="white" _hover={{ bg: 'red.600' }}
                onClick={handleDownloadPdf} isLoading={isDownloading}
                h="50px" flex={1}
                onMouseEnter={() => setHoverPdf(true)}
                onMouseLeave={() => setHoverPdf(false)}
                leftIcon={<AnimatedFileText isHovered={hoverPdf} size={20} />}
              >
                Baixar PDF
              </Button>
            )}

            {canFill && (
              <Button
                colorScheme="green" onClick={handleSubmit}
                isLoading={isSubmitting} h="50px" flex={1}
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
                leftIcon={<AnimatedFileCheck2 isHovered={hoverSubmit} size={20} />}
              >
                Confirmar e Enviar
              </Button>
            )}
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};