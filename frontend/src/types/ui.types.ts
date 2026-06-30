import type { ElementType, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';
import type { Variants, useAnimation } from 'framer-motion';
import type { IconType } from 'react-icons/lib';
import { TicketStatus, type User, type ProductionLine, type Ticket, type FormFieldSchema, type DynamicFieldValue, type DynamicAnswersRecord, type Department, type LinePrefix, type MockTicketStatus, type ChecklistTemplate, type ChecklistItemSchema, type ChecklistFieldSchema, type FieldTemplate, type FieldTreeNode } from './models.types';
import * as AnimatedIcons from '../components/icons/NewAnimatedIcons';
import type { AvailableRoleOption, ProductionLinesByPrefix, DepartmentAnalyticsDto, CreateFieldTemplatePayload } from './api.types';
import type { DowntimeDashboardDto, DashboardFilterParams, TimeSeriesAnalyticsDto, OpenTicketsSeriesDto, ResponseTimeSeriesDto, DowntimeSeriesDto } from './api.types';
import type { Range, RangeKeyDict } from 'react-date-range';
import type { CurveType } from 'recharts/types/shape/Curve';

export type AvailableIconName = keyof typeof AnimatedIcons;
export type DynamicLocationFieldProps = DynamicFieldProps;
export type LineStopFieldProps = DynamicFieldProps;
export type CardRadioFieldProps = DynamicFieldProps;
export type AnimatedIconKey = keyof typeof AnimatedIcons;
export type RechartsValueType = number | string | readonly (number | string)[] | undefined;
export type RechartsDataPoint = Record<string, string | number | undefined>;
export type RoleOption = string;
export type DepartmentBuilderStep = 1 | 2 | 3 | 4;
export type DepartmentEditorView = 'selection' | 'editing';
export type ProductionLineAction = 'deactivate' | 'delete';

export interface DepartmentOption {
  id: number;
  name: string;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

export interface PrefixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface PrefixOption {
  value: string;
  label: string;
}

export interface ProductionLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  line?: ProductionLine | null;
}

export interface ChecklistFormProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  currentUser: User | null;
  onSuccess: () => void;
}

export interface SidebarItemProps {
  icon: ElementType;
  label: string;
  isActive?: boolean;
  children?: ReactNode;
  isSidebarExpanded: boolean;
  onClick?: () => void;
}

export interface SubItemProps {
  label: string;
  icon?: ElementType;
  onClick?: () => void;
}

export interface ActionCardProps {
  title: string;
  description?: string;
  badges?: string[];
  subDescription?: string;
  icon: ElementType;
  colorScheme: string;
  cardColorHex?: string;
  onClick: () => void;
  extraElement?: ReactNode;
  isLoading?: boolean;
}

export interface DashboardActionCardProps {
  title: string;
  description: string;
  badges?: string[];
  animatedIcon: React.ReactElement<AnimatedIconProps>;
  buttonText: string;
  buttonColor?: string;
  onClick: () => void;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
  isActive?: boolean;
  iconName: AvailableIconName;
  badges?: string[];
  cardColorHex?: string;
  summaryFields?: string[];
  allowedRoles?: string[];
  formSchema: {
    title?: string;
    theme?: string;
    fields: FormFieldSchema[];
  };
}

export interface StatCardProps {
  label: string;
  value: number;
  helpText: string;
  icon?: IconType;
  animatedIcon?: React.ReactElement<AnimatedIconProps>;
  color: string;
}

export interface TicketFilterOption {
  value: number | string;
  label: string;
  color: string;
  borderColor?: string;
  icon?: IconType;
  darkColor?: string;
  darkBorderColor?: string;
}

export interface TicketStatusOption {
  value: number;
  label: string;
  color: string;
  icon: IconType;
}

export interface TicketSectorOption {
  value: string;
  label: string;
  color: string;
  icon?: IconType;
}

export interface TicketFiltersProps {
  filterMyTickets: boolean;
  setFilterMyTickets: (value: boolean) => void;
  filterTypes: number[];
  setFilterTypes: (value: number[] | ((prev: number[]) => number[])) => void;
  filterStatus: number[];
  setFilterStatus: (value: number[] | ((prev: number[]) => number[])) => void;
  typeOptions?: TicketFilterOption[];
  statusOptions: TicketStatusOption[];
  myTicketsColor?: string;
  filterSectors?: string[];
  setFilterSectors?: (value: string[] | ((prev: string[]) => string[])) => void;
  sectorOptions?: TicketSectorOption[];
  searchTerm?: string;
  setSearchTerm: (value: string) => void;
}

export interface DashboardStats {
  totalLines: number;
  activeLines: number;
  totalUsers: number;
  totalPrefixes: number;
}

export interface IconProps extends LucideProps {
  size?: number;
  color?: string;
  isHovered?: boolean;
}

export interface AnimatedIconProps extends LucideProps {
  size?: number;
  color?: string;
  isHovered?: boolean;
}

export interface IconWrapperProps {
  children: React.ReactNode;
  controls: ReturnType<typeof useAnimation>;
  size?: number;
  color?: string;
  strokeWidth?: string | number;
  variants?: Variants;
  className?: string;
  style?: React.CSSProperties;
}

export interface UseIconAnimationOptions {
  loop?: boolean;
  loopInterval?: number;
}

export interface SubTheme {
  text: string;
  bg: string;
  border: string;
  iconColor: string;
  buttonHex: string;
  buttonHexDark: string;
}

export interface DepartmentThemeData {
  primary: string;
  badge: string;
  badgeText: string;
  main: SubTheme;
  material?: SubTheme;
  log?: SubTheme;
  systems?: SubTheme;
  tools?: SubTheme;
  badgeBorder?: string;
  emptyStatePrimary?: string;
  attention?: SubTheme;
}

export interface ActionCardTheme {
  topBg: string;
  bottomBg: string;
  iconColor: string;
  badgeBg: string;
  hoverButtonBg: string;
  hoverIconColor: string;
  groupHoverIconColor: string;
  cockpitButtonBg: string;
  cockpitButtonHoverBg: string;
}

export interface DynamicField {
    id: string;
    label: string;
    value: string;
    rawValue: DynamicFieldValue;
}

export interface FormattedBoardTicket {
    id: string;
    departmentId: number;
    departmentName: string;
    departmentColor: string;
    lineName: string;
    openedBy: string;
    openedAt: string;
    isLineStopped: boolean;
    status: TicketStatus;
    dynamicFields: DynamicField[];
    startedBy?: string;
    startedAt?: string;
    startedByRole?: string;
    finishedBy?: string;
    finishedAt?: string;
    finishedByRole?: string;
    resolutionFeedback?: string;
    canAddFeedback?: boolean;
}

export interface CardData {
    name: string;
    description: string;
    iconName: AnimatedIconKey | string;
    badgeInput: string;
    cardColorHex: string;
}

export interface CardBuilderStepProps {
    data: CardData;
    onChange: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
    headerTitle?: string;
    entityNameLabel?: string;
    namePlaceholder?: string;
    descriptionPlaceholder?: string;
    showBadges?: boolean;
    iconModalTitle?: string;
}

export interface FormBuilderStepProps {
    fields: FormFieldSchema[];
    onChange: (fields: FormFieldSchema[]) => void;
    departmentName: string;
}

export interface ActiveIconSelection {
    fieldIndex: number;
    optionIndex: number;
}

export interface FieldEditorItemProps {
    field: FormFieldSchema;
    index: number;
    allFields: FormFieldSchema[];
    isDarkMode: boolean;
    fieldTemplates: FieldTemplate[];
    hideConditional?: boolean;
    hideRemove?: boolean;
    onUpdate: <K extends keyof FormFieldSchema>(index: number, key: K, value: FormFieldSchema[K]) => void;
    onTypeChange: (index: number, value: string) => void;
    onRemove: (index: number) => void;
    onAddOption: (fieldIndex: number) => void;
    onUpdateOption: (fieldIndex: number, optionIndex: number, newLabel: string) => void;
    onRemoveOption: (fieldIndex: number, optionIndex: number) => void;
    onSelectOptionIcon: (fieldIndex: number, optionIndex: number, iconName: string) => void;
    onOpenIconModal: (fieldIndex: number, optionIndex: number) => void;
    onChangeFields: (fields: FormFieldSchema[]) => void;
}

export interface FieldTreeViewProps {
    nodes: FieldTreeNode[];
    fields: FormFieldSchema[];
    isDarkMode: boolean;
    fieldTemplates: FieldTemplate[];
    isCollapsed: (id: string) => boolean;
    onToggleCollapse: (id: string) => void;
    onAddRoot: (asCard: boolean) => void;
    onAddChildUnderOption: (parentId: string, optionValue: string, asCard: boolean) => void;
    onRemoveSubtree: (fieldId: string) => void;
    onReorderSiblings: (parentUid: string | null, optionValue: string | null, orderedUids: string[]) => void;
    onUpdate: <K extends keyof FormFieldSchema>(index: number, key: K, value: FormFieldSchema[K]) => void;
    onTypeChange: (index: number, value: string) => void;
    onAddOption: (fieldIndex: number) => void;
    onUpdateOption: (fieldIndex: number, optionIndex: number, newLabel: string) => void;
    onRemoveOption: (fieldIndex: number, optionIndex: number) => void;
    onSelectOptionIcon: (fieldIndex: number, optionIndex: number, iconName: string) => void;
    onOpenIconModal: (fieldIndex: number, optionIndex: number) => void;
    onChangeFields: (fields: FormFieldSchema[]) => void;
}

export interface FieldTreeNodeItemProps extends Omit<FieldTreeViewProps, 'nodes' | 'onAddRoot'> {
    node: FieldTreeNode;
    depth: number;
}

export interface FieldTypeBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: FieldTemplate[];
    isSaving: boolean;
    onCreate: (payload: CreateFieldTemplatePayload) => Promise<FieldTemplate | null>;
    onUpdate: (id: number, payload: CreateFieldTemplatePayload) => Promise<FieldTemplate | null>;
    onDelete: (template: FieldTemplate) => void;
}

export interface FormBuilderPreviewProps {
    fields: FormFieldSchema[];
    departmentName: string;
}

export interface IconOption {
    value: string;
    label: string;
    component: React.ComponentType<AnimatedIconProps>;
}

export interface IconSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
    selectedIcon?: string;
    title?: string;
}

export interface IconPreviewBoxProps {
    iconData: IconOption;
    selectedIcon?: string;
    isDarkMode: boolean;
    onSelect: (value: string) => void;
}

export interface RolesBuilderStepProps {
    allowedRoles: string[];
    onChange: (roles: string[]) => void;
}

export interface RolesAccessSummaryProps {
    allowedRoles: string[];
    availableRoles: AvailableRoleOption[];
    isDarkMode: boolean;
    onRemove: (role: string) => void;
}

export interface DepartmentConfigSummary {
    name: string;
    iconName: string;
    cardColorHex: string;
}

export interface SummaryBuilderStepProps {
    fields: FormFieldSchema[];
    summaryFields: string[];
    onChange: (selectedIds: string[]) => void;
    departmentConfig: DepartmentConfigSummary;
}

export interface ProductionLineFormData {
    lineName: string;
    prefix: string;
    description?: string | null;
    isActive: boolean;
}

export interface ProductionLineModalFormErrors {
    lineName: string;
    prefix: string;
}

export interface KpiItem {
    label: string;
    value: string | number;
    series: TimeSeriesAnalyticsDto[] | OpenTicketsSeriesDto[] | ResponseTimeSeriesDto[] | DowntimeSeriesDto[];
    dataKey: string;
}

export interface ExpandedKpiCarrosselProps {
    globalData: DowntimeDashboardDto | null;
    filters: DashboardFilterParams;
    color?: string;
}

export type SparklineDataPoint =
    | TimeSeriesAnalyticsDto
    | OpenTicketsSeriesDto
    | ResponseTimeSeriesDto
    | DowntimeSeriesDto;

export interface SparklineKpiCardProps {
    label: string;
    value: string | number;
    sparklineData: SparklineDataPoint[];
    dataKey: string;
    color?: string;
}

export type DashboardStatCardProps = Omit<StatCardProps, 'color' | 'value'> & {
    loading: boolean;
    value: string | number;
};

export interface DynamicFieldProps {
    field: FormFieldSchema;
    answers: DynamicAnswersRecord;
    onChange: (fieldId: string, value: DynamicFieldValue) => void;
}

export interface DynamicFormRendererProps {
    fields: FormFieldSchema[];
    answers: DynamicAnswersRecord;
    onAnswerChange: (fieldId: string, value: DynamicFieldValue) => void;
}

export interface ChecklistConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export interface ChecklistItemsGridProps {
    items: ChecklistItemSchema[];
    safeChecks: boolean[];
    isViewMode: boolean;
    isMonitor: boolean;
    allChecked: boolean;
    isIndeterminate: boolean;
    onCheckChange: (index: number, checked: boolean) => void;
    onMasterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ChecklistSignatureBoxProps {
    isViewMode: boolean;
    currentUserName?: string;
    monitorName?: string;
    startedAt?: string;
    finishedAt?: string;
}

export interface TicketModalData {
    id: string | number;
    status: TicketStatus;
    departmentColor: string;
    lineName: string;
    isLineStopped: boolean;
    openedBy: string;
    openedAt: string;
    startedByRole?: string;
    startedBy?: string;
    startedAt?: string;
    finishedByRole?: string;
    finishedBy?: string;
    finishedAt?: string;
    canAddFeedback?: boolean;
    resolutionFeedback?: string;
    dynamicFields: DynamicField[];
}

export interface TimelineStepProps {
    isActive: boolean;
    isCompleted: boolean;
    isLast?: boolean;
    icon: ReactNode;
    title: string;
    description: string;
    time: string;
    theme: Record<string, string>; 
    isDarkMode: boolean;
}

export interface TicketDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTicket: TicketModalData | null;
    actionLoadingId?: string | number | null;
    handleTicketAction: (ticket: TicketModalData, e: React.MouseEvent) => void;
    animatingBite: boolean;
    animatingTear: boolean;
    onOpenFeedback?: (id: number) => void;
    canManageTickets?: boolean;
}

export interface TicketFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: number | null;
    onSubmitFeedback: (ticketId: number, feedback: string) => Promise<void>;
}

export interface TicketFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    departments: Department[];
    dynamicFilters: Record<string, string>;
    onDynamicFilterChange: (fieldId: string, value: string) => void;
    onClearFilters: () => void;
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export interface TicketSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketData: FormattedBoardTicket | null;
    actionType?: 'create' | 'start' | 'resolve';
}

export interface ETicketTemplateProps {
    ticketData: FormattedBoardTicket | null;
    isDarkMode: boolean;
    printRef: React.RefObject<HTMLDivElement | null>;
}

export interface CustomDateRangeProps {
    rangeState: Range[];
    onChange: (item: RangeKeyDict) => void;
    onClose: () => void;
}

export interface CockpitStats {
    totalLines: number;
    activeLines: number;
    totalUsers: number;
    totalPrefixes: number;
    totalDepartments: number;
}

export interface CockpitStatCardProps {
    label: string;
    value: number | string;
    helpText: string;
    animatedIcon?: React.ReactElement<{ isHovered?: boolean; size?: number }>;
    actionLabel?: string;
    onActionClick?: () => void;
    loading?: boolean;
}

export interface AdminActionCardProps {
    title: string;
    description: string;
    animatedIcon: React.ReactElement<{ isHovered?: boolean; size?: number }>;
    buttonText: string;
    onClick: () => void;
    loading?: boolean;
}

export interface DepartmentBuilderData {
    name: string;
    description: string;
    iconName: AnimatedIconKey;
    badgeInput: string;
    cardColorHex: string;
    summaryFields: string[];
    allowedRoles: string[];
}

export interface DepartmentEditData {
    id: number;
    name: string;
    description: string;
    iconName: AnimatedIconKey;
    badgeInput: string;
    cardColorHex: string;
    isActive: boolean;
    summaryFields: string[];
    allowedRoles: string[];
}

export interface DepartmentSelectionViewProps {
    departments: Department[];
    filteredDepartments: Department[];
    loading: boolean;
    onSelectDepartment: (dept: Department) => void;
}

export interface DepartmentEditingViewProps {
    editData: DepartmentEditData;
    editFields: FormFieldSchema[];
    isSaving: boolean;
    onEditDataChange: <K extends keyof DepartmentEditData>(field: K, value: DepartmentEditData[K]) => void;
    onFieldsChange: (fields: FormFieldSchema[]) => void;
    onToggleStatus: () => void;
    onSave: () => void;
    onBack: () => void;
}

export interface PrefixesTableProps {
    prefixes: LinePrefix[];
    loading: boolean;
    onDelete: (prefix: LinePrefix) => void;
}

export interface ProductionLineRowProps {
    line: ProductionLine;
    onEdit: (line: ProductionLine) => void;
    onAction: (line: ProductionLine, action: ProductionLineAction) => void;
    onActivate: (line: ProductionLine) => void;
}

export interface ProductionLinesTableProps {
    filteredLinesByPrefix: ProductionLinesByPrefix[];
    loading: boolean;
    searchTerm: string;
    onEdit: (line: ProductionLine) => void;
    onAction: (line: ProductionLine, action: ProductionLineAction) => void;
    onActivate: (line: ProductionLine) => void;
}

export interface DateRangeState {
    startDate: Date;
    endDate: Date;
    key: string;
}

export interface HistoricalFilterBarProps {
    loading: boolean;
    isDarkMode: boolean;
    activeShiftFilter: string;
    departments: Department[];
    departmentId: string;
    rangeState: DateRangeState[];
    showCalendar: boolean;
    onShiftFilterChange: (value: string) => void;
    onDepartmentChange: (value: string) => void;
    onToggleCalendar: () => void;
    onRangeChange: (range: DateRangeState[]) => void;
    onCalendarClose: () => void;
    onRefresh: () => void;
}

export interface HistoricalVolumeChartProps {
    loading: boolean;
    isDarkMode: boolean;
    data: DowntimeDashboardDto | null;
    lineType: CurveType;
    isFullscreen: boolean;
    onToggleLineType: () => void;
    onToggleFullscreen: () => void;
    formatChartDate: (val: string | number) => string;
    formatTooltipLabel: (val: React.ReactNode) => string;
    formatTooltipValue: (value: RechartsValueType) => [string, string];
}

export interface DepartmentPerformanceTableProps {
    loading: boolean;
    isDarkMode: boolean;
    departmentAnalytics: DepartmentAnalyticsDto[];
}

export interface LiveVolumeChartProps {
    data: TimeSeriesAnalyticsDto[] | undefined;
    loading: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    lineType: CurveType;
    toggleLineType: () => void;
    chartFormatters: {
        formatChartDate: (val: string | number) => string;
        formatTooltipLabel: (val: ReactNode) => string;
        formatTooltipValue: (value: RechartsValueType) => [string, string];
    };
}

export interface MockTicket {
    id: string;
    departmentName: string;
    departmentColor: string;
    lineName: string;
    openedBy: string;
    openedAt: string;
    isLineStopped: boolean;
    status: MockTicketStatus;
    dynamicFields: DynamicField[];
}

export type ChecklistBuilderStep = 1 | 2 | 3 | 4;
export type ChecklistBuilderView = 'selection' | 'building' | 'editing';

export interface ChecklistLinkData {
    departmentId: number | null;
    triggerFieldId: string | null;
    triggerFieldValue: string | null;
}

export interface ChecklistLinkStepProps {
    departments: Department[];
    loading: boolean;
    link: ChecklistLinkData;
    onChange: <K extends keyof ChecklistLinkData>(field: K, value: ChecklistLinkData[K]) => void;
}

export interface ChecklistMetaData {
    title: string;
    documentCode: string;
    emissionDate: string;
    revision: string;
    elaboratedBy: string;
    approvedBy: string;
    actingDepartment: string;
}

export interface ChecklistItemsBuilderStepProps {
    items: ChecklistItemSchema[];
    onChange: (items: ChecklistItemSchema[]) => void;
    checklistName: string;
}

export interface ChecklistMetaBuilderStepProps {
    meta: ChecklistMetaData;
    onMetaChange: <K extends keyof ChecklistMetaData>(field: K, value: ChecklistMetaData[K]) => void;
    fields: ChecklistFieldSchema[];
    onFieldsChange: (fields: ChecklistFieldSchema[]) => void;
}

export interface ChecklistSelectionViewProps {
    templates: ChecklistTemplate[];
    filteredTemplates: ChecklistTemplate[];
    loading: boolean;
    onSelectTemplate: (template: ChecklistTemplate) => void;
    onCreateNew: () => void;
}