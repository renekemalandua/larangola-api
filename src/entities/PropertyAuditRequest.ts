export class PropertyAuditRequest {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public description: string | null,
    public address: string | null,
    public city: string | null,
    public state: string | null,
    public bedrooms: number | null,
    public bathrooms: number | null,
    public area: number | null,
    public price: number | null,
    public currency: string,
    public propertyType: string,
    public listingType: string,
    public images: any | null,
    public status: 'PENDING' | 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'CANCELED',
    public notes: string | null,
    public claimedByAgentId: string | null,
    public claimedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
    public claimedAgent?: { name: string; phone: string; }
  ) {}
}
