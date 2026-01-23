import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProgrammingLanguage } from "./programming-language.entity";

@Injectable()
export class ProgrammingLanguageService {
  constructor(
    @InjectRepository(ProgrammingLanguage)
    private programmingLanguageRepository: Repository<ProgrammingLanguage>
  ) {}

  // Create
  async create(data: Partial<ProgrammingLanguage>): Promise<ProgrammingLanguage> {
    const programmingLanguage = this.programmingLanguageRepository.create(data);
    return this.programmingLanguageRepository.save(programmingLanguage);
  }

  // Read - Find All
  async findAll(options?: {
    isActive?: boolean;
  }): Promise<ProgrammingLanguage[]> {
    const queryBuilder = this.programmingLanguageRepository.createQueryBuilder('pl');

    if (options?.isActive) {
      queryBuilder.where('pl.isActive = :isActive', { isActive: options.isActive });
    }

    return queryBuilder.getMany();
  }

  // Read - Find Active Only (default)
  async findAllActive(): Promise<ProgrammingLanguage[]> {
    return this.findAll({ isActive: true });
  }

  // Read - Find By ID
  async findById(id: string, includeSensitive = false): Promise<ProgrammingLanguage | null> {
    const queryBuilder = this.programmingLanguageRepository.createQueryBuilder('pl');

    if (includeSensitive) {
      queryBuilder.addSelect('pl.runCommand');
      queryBuilder.addSelect('pl.dockerImage');
      queryBuilder.addSelect('pl.timeout');
    }

    return queryBuilder.where('pl.id = :id', { id }).getOne();
  }

  async assertExists(id: string, checkActive = false, includeSensitive = false): Promise<ProgrammingLanguage> {
    const programmingLanguage = await this.findById(id, includeSensitive);
    if (!programmingLanguage) {
      throw new NotFoundException(`Not Found Programming Language with id ${id}`);
    }
    if (checkActive && !programmingLanguage.isActive) {
      throw new NotFoundException(`Programming Language with id ${id} is not active`);
    }
    return programmingLanguage;
  }

  // Update
  async update(
    id: string,
    data: Partial<ProgrammingLanguage>
  ): Promise<ProgrammingLanguage> {
    const programmingLanguage = await this.findById(id);
    if (!programmingLanguage) {
      throw new NotFoundException(`Programming language with ID ${id} not found`);
    }

    await this.programmingLanguageRepository.update(id, data);
    const updated = await this.findById(id); // Include sensitive fields after update
    if (!updated) {
      throw new NotFoundException(`Programming language with ID ${id} not found after update`);
    }
    return updated;
  }

  // Activate (Reactivate a deactivated language)
  async activate(id: string): Promise<ProgrammingLanguage> {
    return this.update(id, { isActive: true });
  }
}
