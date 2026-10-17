import type {
  AgentAssessment,
  ClimateHazard,
  NewClimateAlert,
  RiskLevel,
} from "../domain/ClimateAlert";

/**
 * Transparent decision-support agent. Its scoring rules are an initial prototype,
 * not an official forecast or a substitute for the local risk authority.
 */
export class ClimateRiskAgent {
  assess(alert: NewClimateAlert): AgentAssessment {
    const severityPoints = (alert.severity / 5) * 35;
    const exposureRatio = Math.min(Math.log10(alert.exposedPopulationEstimate + 1) / 5, 1);
    const exposurePoints = exposureRatio * 20;
    const vulnerabilityPoints = (alert.vulnerability / 5) * 25;
    const confidencePoints = (alert.forecastConfidence / 100) * 20;
    const score = Math.round(
      severityPoints + exposurePoints + vulnerabilityPoints + confidencePoints,
    );

    const level: RiskLevel =
      score >= 80 ? "critico" : score >= 60 ? "alto" : score >= 35 ? "moderado" : "bajo";

    return {
      score,
      level,
      explanation: [
        `Severidad reportada: ${alert.severity}/5 (${Math.round(severityPoints)}/35 puntos).`,
        `Población expuesta estimada: ${alert.exposedPopulationEstimate} (${Math.round(exposurePoints)}/20 puntos).`,
        `Vulnerabilidad reportada: ${alert.vulnerability}/5 (${Math.round(vulnerabilityPoints)}/25 puntos).`,
        `Confianza del pronóstico: ${alert.forecastConfidence}% (${Math.round(confidencePoints)}/20 puntos).`,
      ],
      recommendedActions: this.actionsFor(alert.hazardType, level),
    };
  }

  private actionsFor(hazard: ClimateHazard, level: RiskLevel): string[] {
    const common = [
      "Verificar el reporte con la autoridad local y las fuentes meteorológicas disponibles.",
      "Informar a la persona responsable de revisar la alerta; la evaluación automática requiere validación humana.",
    ];
    const hazardActions: Record<ClimateHazard, string[]> = {
      inundacion: ["Revisar niveles de ríos y drenajes; identificar rutas y puntos seguros."],
      deslizamiento: ["Inspeccionar laderas y vías; evitar zonas inestables y vigilar grietas o movimientos."],
      marejada: ["Monitorear condiciones costeras; revisar rutas de evacuación desde zonas bajas."],
      sequia: ["Verificar disponibilidad de agua y coordinar medidas de ahorro y abastecimiento."],
      ola_de_calor: ["Difundir recomendaciones de hidratación y revisar puntos de atención para población vulnerable."],
      tormenta: ["Monitorear lluvias, vientos y descargas eléctricas; asegurar refugios y rutas seguras."],
      otro: ["Solicitar más información sobre el fenómeno y confirmar las medidas con gestión del riesgo local."],
    };
    const urgency = level === "critico" || level === "alto"
      ? ["Priorizar la revisión inmediata por el equipo de gestión del riesgo."]
      : [];
    return [...urgency, ...hazardActions[hazard], ...common];
  }
}
