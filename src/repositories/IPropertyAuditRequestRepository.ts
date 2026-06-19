import { PropertyAuditRequest } from '../entities/PropertyAuditRequest';

export abstract class IPropertyAuditRequestRepository {
  abstract create(data: Omit<PropertyAuditRequest, 'id' | 'createdAt' | 'updatedAt' | 'claimedByAgentId' | 'claimedAt' | 'notes' | 'status'>): Promise<PropertyAuditRequest>;
  abstract findById(id: string): Promise<PropertyAuditRequest | null>;
  abstract findPending(): Promise<PropertyAuditRequest[]>;
  abstract findByAgentId(agentId: string): Promise<PropertyAuditRequest[]>;
  abstract updateStatus(id: string, status: string, agentId?: string | null, notes?: string): Promise<PropertyAuditRequest>;
  abstract resetExpiredValidations(timeoutHours: number): Promise<number>;
}
