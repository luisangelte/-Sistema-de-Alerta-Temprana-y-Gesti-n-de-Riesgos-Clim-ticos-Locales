export const climateHazards = [
  "inundacion",
  "deslizamiento",
  "marejada",
  "sequia",
  "ola_de_calor",
  "tormenta",
  "otro",
] as const;

export type ClimateHazard = (typeof climateHazards)[number];
export type RiskLevel = "bajo" | "moderado" | "alto" | "critico";
export type ReviewStatus = "pendiente" | "aprobada" | "rechazada";

export interface NewClimateAlert {
  title: string;
  description: string;
  municipality: string;
  department: string;
  vereda: string;
  hazardType: ClimateHazard;
  severity: number;
  exposedPopulationEstimate: number;
  exposedPopulationSource: string;
  populationReferenceDate: string;
  vulnerability: number;
  forecastConfidence: number;
}

export interface AgentAssessment {
  score: number;
  level: RiskLevel;
  explanation: string[];
  recommendedActions: string[];
}
