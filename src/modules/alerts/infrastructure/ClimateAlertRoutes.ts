import { Router, type Request, type Response } from "express";
import Joi from "joi";
import { AppDataSource } from "../../../infraestructure/config/data-base";
import { authenticateToken } from "../../../infraestructure/web/authMiddleware";
import { ClimateRiskAgent } from "../application/ClimateRiskAgent";
import { climateHazards, type NewClimateAlert, type ReviewStatus } from "../domain/ClimateAlert";
import { ClimateAlertEntity } from "./ClimateAlertEntity";

const router = Router();
const agent = new ClimateRiskAgent();
const alertSchema = Joi.object({
  title: Joi.string().trim().min(3).max(160).required(),
  description: Joi.string().trim().min(5).max(5000).required(),
  municipality: Joi.string().trim().min(2).max(120).required(),
  department: Joi.string().trim().min(2).max(120).required(),
  vereda: Joi.string().trim().min(2).max(120).required(),
  hazardType: Joi.string().valid(...climateHazards).required(),
  severity: Joi.number().integer().min(1).max(5).required(),
  exposedPopulationEstimate: Joi.number().integer().min(0).max(100000000).required(),
  exposedPopulationSource: Joi.string().trim().min(3).max(500).required(),
  populationReferenceDate: Joi.string().isoDate().required(),
  vulnerability: Joi.number().integer().min(1).max(5).required(),
  forecastConfidence: Joi.number().integer().min(0).max(100).required(),
}).required();

router.use(authenticateToken);

router.post("/", async (req: Request, res: Response) => {
  const { error, value } = alertSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: "Datos de alerta inválidos", details: error.details.map((detail) => detail.message) });
  }

  try {
    const input = value as NewClimateAlert;
    const assessment = agent.assess(input);
    const alert = AppDataSource.getRepository(ClimateAlertEntity).create({
      ...input,
      riskScore: assessment.score,
      riskLevel: assessment.level,
      agentAssessment: assessment,
      reviewStatus: "pendiente",
      reviewerNotes: null,
    });
    const saved = await AppDataSource.getRepository(ClimateAlertEntity).save(alert);
    return res.status(201).json(saved);
  } catch {
    return res.status(500).json({ error: "No se pudo guardar la alerta" });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const alerts = await AppDataSource.getRepository(ClimateAlertEntity).find({ order: { createdAt: "DESC" } });
    return res.status(200).json(alerts);
  } catch {
    return res.status(500).json({ error: "No se pudieron consultar las alertas" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID de alerta inválido" });
  try {
    const alert = await AppDataSource.getRepository(ClimateAlertEntity).findOneBy({ id });
    if (!alert) return res.status(404).json({ error: "Alerta no encontrada" });
    return res.status(200).json(alert);
  } catch {
    return res.status(500).json({ error: "No se pudo consultar la alerta" });
  }
});

router.patch("/:id/review", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID de alerta inválido" });
  const schema = Joi.object({
    decision: Joi.string().valid("aprobada", "rechazada").required(),
    notes: Joi.string().trim().max(2000).allow("").default(""),
  }).required();
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: "Decisión de revisión inválida", details: error.details.map((detail) => detail.message) });

  try {
    const repository = AppDataSource.getRepository(ClimateAlertEntity);
    const alert = await repository.findOneBy({ id });
    if (!alert) return res.status(404).json({ error: "Alerta no encontrada" });
    if (alert.reviewStatus !== "pendiente") return res.status(409).json({ error: "La alerta ya fue revisada" });
    alert.reviewStatus = value.decision as ReviewStatus;
    alert.reviewerNotes = value.notes;
    await repository.save(alert);
    return res.status(200).json(alert);
  } catch {
    return res.status(500).json({ error: "No se pudo guardar la revisión" });
  }
});

export default router;
