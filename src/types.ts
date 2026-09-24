export type BlockCategory = 'passenger' | 'freight' | 'maintenance' | 'inspection';

export interface ScheduleBlock {
  id: string;
  timeSlot: string;
  startTime: string; // e.g. "06:00"
  endTime: string;   // e.g. "10:00"
  category: BlockCategory;
  activity: string;
  benefit: string;
  trainsAllowed: string;
  trackStatus?: string;
  safetyProtocol?: string;
  department?: string;
  speedLimit?: string;
}

export interface SectionSummary {
  sectionName: string;
  zone: string;
  totalCapacitySlots: number;
  assetAvailabilityPercent: number;
  maintenanceHoursTotal: number;
  passengerTrainsScheduled: number;
  freightRakesScheduled: number;
  clashesDetected: number;
  safetyIndexPercent: number;
}

export interface BlockPlanData {
  sectionSummary: SectionSummary;
  scheduleBlocks: ScheduleBlock[];
  aiOptimizationInsights: string[];
  simpleExplanation: string;
}

export interface RoutePreset {
  id: string;
  name: string;
  zone: string;
  distanceKm: number;
  lines: string;
  description: string;
}
