export interface CreateListing {
  propertyTitle: string;
  totalUnits: bigint;
  totalUnitsNumber: bigint;
  category: number;
  userAddress?: string;
}
