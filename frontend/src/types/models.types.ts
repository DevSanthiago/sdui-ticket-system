export enum TicketStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
}

export enum ChecklistStatus {
  NotRequired = 0,
  Pending = 1,
  Completed = 2,
}

export interface UserRole {
  name: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  registration: number;
  department: string;
  roles: UserRole[];
  canManageTickets?: boolean;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  cardColorHex?: string;
  iconName: string;
  badges: string[];
  isActive: boolean;
  formSchema: DepartmentFormSchema;
  summaryFields: string[];
  allowedRoles: string[];
}

export interface Plant {
    id: number;
    name: string;
}

export interface ProductionLine {
  id: number;
  lineName: string;
  prefix: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdByUserName: string;
  updatedByUserName?: string;
}

export interface Ticket {
  id: number;
  departmentId: number;
  departmentName?: string;
  status: TicketStatus;
  monitorId: number;
  monitorName: string;
  productionLineId: number;
  lineName: string;
  isLineStopped: boolean;
  lineStoppedTime?: string;
  technicianId?: number;
  technicianName?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  dynamicAnswers: DynamicAnswersRecord;
  checklistContent?: string | null;
  checklistStatus?: ChecklistStatus;
  checklistTemplateId?: number | null;
}

export interface LinePrefix {
  id: number;
  value: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  createdByUserName?: string;
}

export type FormFieldType = 
  | 'text' | 'textarea' | 'select' | 'card_radio' 
  | 'button_group' | 'time' | 'dynamic_location' 
  | 'line_stop' | 'line' | 'setup_material';

export interface FormFieldOption {
  value: string;
  label: string;
  iconName?: string;
  colorHex?: string;
}

export interface FormFieldSchema {
  id: string;
  uid?: string;
  type: FormFieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  dependsOn?: { field: string; value: string | string[] };
  dataSource?: string;
  templateId?: number;
}

export interface DepartmentFormSchema {
  title: string;
  theme: string;
  fields: FormFieldSchema[];
  summaryFields?: string[];
}

export type FieldTemplateBaseType = Extract<FormFieldType, 'text' | 'textarea' | 'select' | 'card_radio'>;

export interface FieldTemplateSchema {
  baseType: FieldTemplateBaseType;
  label: string;
  required: boolean;
  options?: FormFieldOption[];
}

export interface FieldTemplate {
  id: number;
  name: string;
  schema: FieldTemplateSchema;
  createdAt: string;
  updatedAt?: string;
}

export interface FieldTreeBranch {
  option: FormFieldOption;
  children: FieldTreeNode[];
  isOrphan?: boolean;
}

export interface FieldTreeNode {
  field: FormFieldSchema;
  branches: FieldTreeBranch[];
}

export interface ParsedChecklistContent {
  produtoAtual: string;
  produtoSetup: string;
  liderLinha: string;
  observacao: string;
  checks: boolean[];
  assinadoPor?: string;
  dataAssinatura?: string;
}

export type ChecklistFieldType = 'text' | 'textarea';

export interface ChecklistItemSchema {
  id: string;
  label: string;
}

export interface ChecklistFieldSchema {
  id: string;
  type: ChecklistFieldType;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  sourceFieldId?: string;
}

export interface ChecklistTemplateSchema {
  title: string;
  documentCode?: string;
  emissionDate?: string;
  revision?: string;
  elaboratedBy?: string;
  approvedBy?: string;
  actingDepartment?: string;
  badges?: string[];
  fields: ChecklistFieldSchema[];
  items: ChecklistItemSchema[];
}

export interface ChecklistTemplate {
  id: number;
  name: string;
  description?: string;
  cardColorHex?: string;
  iconName: string;
  isActive: boolean;
  schema: ChecklistTemplateSchema;
  allowedRoles: string[];
  departmentId?: number | null;
  triggerFieldId?: string | null;
  triggerFieldValue?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ChecklistContent {
  fields: Record<string, string>;
  checks: Record<string, boolean>;
  signedBy?: string;
  signedAt?: string;
}

export type MockTicketStatus = 'ABERTO' | 'EM_ANDAMENTO' | 'RESOLVIDO';
export type DynamicFieldValue = string | number | boolean | string[] | null | undefined;
export type DynamicAnswersRecord = Record<string, DynamicFieldValue>;

export enum ConnectorSource {
  ProductionLines = 1,
}

export enum ConnectorPanel {
  Andon = 1,
  Heatmap = 2,
}

export interface PlantConnector {
  id: number;
  source: ConnectorSource;
  prefix: string | null;
  prefixLabel: string | null;
  lineCount: number;
  createdAt: string;
}

export interface CreatePlantConnectorPayload {
  source: ConnectorSource;
  prefix: string | null;
  panel?: ConnectorPanel;
}

export interface ConnectorBoardCard {
  lineId: number;
  lineName: string;
  prefix: string;
  prefixLabel: string;
  openCount: number;
}

export interface HeatmapTile {
  lineId: number;
  lineName: string;
  prefix: string;
  prefixLabel: string;
  openCount: number;
  oldestOpenStoppedAt: string | null;
}