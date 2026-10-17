import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import type {
  AgentAssessment,
  ClimateHazard,
  ReviewStatus,
  RiskLevel,
} from "../domain/ClimateAlert";

@Entity("climate_alert")
export class ClimateAlertEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 160 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 120 })
  municipality!: string;

  @Column({ type: "varchar", length: 120 })
  department!: string;

  @Column({ type: "varchar", length: 120 })
  vereda!: string;

  @Column({ type: "varchar", length: 32 })
  hazardType!: ClimateHazard;

  @Column({ type: "integer" })
  severity!: number;

  @Column({ type: "integer" })
  exposedPopulationEstimate!: number;

  @Column({ type: "varchar", length: 500 })
  exposedPopulationSource!: string;

  @Column({ type: "date" })
  populationReferenceDate!: string;

  @Column({ type: "integer" })
  vulnerability!: number;

  @Column({ type: "integer" })
  forecastConfidence!: number;

  @Column({ type: "integer" })
  riskScore!: number;

  @Column({ type: "varchar", length: 16 })
  riskLevel!: RiskLevel;

  @Column({ type: "jsonb" })
  agentAssessment!: AgentAssessment;

  @Column({ type: "varchar", length: 16, default: "pendiente" })
  reviewStatus!: ReviewStatus;

  @Column({ type: "text", nullable: true })
  reviewerNotes!: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
