
import { Repository, DeleteResult } from 'typeorm';
import { EvaluationEntity } from './evaluation.entity';
import { HttpException, Injectable } from '@mildjs/core';
import { InjectRepository } from '@mildjs/typeorm';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly repo: Repository<EvaluationEntity>,
  ) {}

  async createOrUpdate(item: EvaluationEntity): Promise<EvaluationEntity> {
    return await this.repo.save(item);
  }

  async findById(id: number): Promise<EvaluationEntity> {
    return await this.repo.findOne({ id });
  }

  async findAll(): Promise<EvaluationEntity[]> {
    return await this.repo.find();
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repo.delete({ id });
  }
}