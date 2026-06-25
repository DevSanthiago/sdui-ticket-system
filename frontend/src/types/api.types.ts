import type {
  ProductionLine,
  DepartmentFormSchema,
  DynamicAnswersRecord,
  UserRole,
  User,
  ChecklistTemplateSchema,
  FieldTemplateSchema
} from './models.types';

export interface CreateFieldTemplatePayload {
  name: string;
  schema: FieldTemplateSchema;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  refreshExpires?: string;
  userName: string;
  department: string;
  roles: UserRole[];
  user: User;
}

export interface AvailableRoleOption {
  label: string;
  value: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  cardColorHex?: string;
  iconName: string;
  badges: string[];
  formSchema: DepartmentFormSchema;
  allowedRoles: string[];
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  isActive: boolean;
}

export interface CreateChecklistTemplateDto {
  name: string;
  description?: string;
  cardColorHex?: string;
  iconName: string;
  schema: ChecklistTemplateSchema;
  allowedRoles: string[];
  departmentId?: number | null;
  triggerFieldId?: string | null;
  triggerFieldValue?: string | null;
}

export interface UpdateChecklistTemplateDto extends CreateChecklistTemplateDto {
  isActive: boolean;
}

export interface CreateTicketDto {
  departmentId: number;
  productionLineId: number;
  isLineStopped: boolean;
  lineStoppedTime?: string | null;
  dynamicAnswers: DynamicAnswersRecord;
}

export interface ProductionLinesByPrefix {
  prefix: string;
  prefixLabel: string;
  lines: ProductionLine[];
}

export interface CreateLinePrefixDto {
  value: string;
  label: string;
}

export interface CreateProductionLineDto {
  lineName: string;
  prefix: string;
  description?: string | null;
}

export interface UpdateProductionLineDto extends CreateProductionLineDto {
  isActive: boolean;
}

export interface GlobalAnalyticsDto {
  totalTickets: number;
  openTickets: number;
  averageResponseTimeMinutes: number;
  averageResolutionTimeMinutes: number;
  totalDowntimeHours: number;
}

export interface DepartmentAnalyticsDto {
  departmentId: number;
  departmentName: string;
  totalTickets: number;
  averageResponseTimeMinutes: number;
  averageResolutionTimeMinutes: number;
}

export interface TimeSeriesAnalyticsDto {
  date: string;
  ticketCount: number;
}

export interface OpenTicketsSeriesDto {
  date: string;
  value: number;
}

export interface ResponseTimeSeriesDto {
  date: string;
  value: number;
}

export interface DowntimeSeriesDto {
  date: string;
  value: number;
}

export interface DowntimeDashboardDto {
  globalAnalytics: GlobalAnalyticsDto;
  departmentAnalytics: DepartmentAnalyticsDto[];
  timeSeriesAnalytics: TimeSeriesAnalyticsDto[];
  
  openTicketsSeries: OpenTicketsSeriesDto[];
  responseTimeSeries: ResponseTimeSeriesDto[];
  downtimeSeries: DowntimeSeriesDto[];
}

export interface DashboardFilterParams {
  startDate?: string;
  endDate?: string;
  plantId?: number;
  departmentId?: number;
  groupBy?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  preset?: string;
  shift?: string;
}