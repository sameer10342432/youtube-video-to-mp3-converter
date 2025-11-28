import { type ConversionJob, type InsertConversionJob } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createConversionJob(job: InsertConversionJob): Promise<ConversionJob>;
  getConversionJob(id: string): Promise<ConversionJob | undefined>;
  updateConversionJob(id: string, updates: Partial<ConversionJob>): Promise<ConversionJob | undefined>;
  deleteConversionJob(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private jobs: Map<string, ConversionJob>;

  constructor() {
    this.jobs = new Map();
  }

  async createConversionJob(insertJob: InsertConversionJob): Promise<ConversionJob> {
    const id = randomUUID();
    const job: ConversionJob = {
      id,
      youtubeUrl: insertJob.youtubeUrl,
      status: "validating",
      progress: 0,
    };
    this.jobs.set(id, job);
    return job;
  }

  async getConversionJob(id: string): Promise<ConversionJob | undefined> {
    return this.jobs.get(id);
  }

  async updateConversionJob(id: string, updates: Partial<ConversionJob>): Promise<ConversionJob | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteConversionJob(id: string): Promise<void> {
    this.jobs.delete(id);
  }
}

export const storage = new MemStorage();
