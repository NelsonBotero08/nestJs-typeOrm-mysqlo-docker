import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
  ) {}

  async create(createBreedDto: CreateBreedDto) {
    try {
      const breed = this.breedsRepository.create(createBreedDto);

      return await this.breedsRepository.save(breed);
    } catch (error) {
      new Error('Error creating cat: ' + error.message);
    }
  }

  async findAll() {
    return await this.breedsRepository.find();
  }

  async findOne(id: number) {
    const breedOne = await this.breedsRepository.findOneBy({ id });

    if (!breedOne) {
      throw new NotFoundException(`El gato con ID ${id} no existe`);
    }

    return breedOne;
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    try {
      const breedUpdate = await this.breedsRepository.update(
        id,
        updateBreedDto,
      );

      if (breedUpdate.affected === 0) {
        throw new NotFoundException(
          `El ${id} no existe no se actualizo la raza`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
    throw new Error('Error interno del servidor');
  }

  async remove(id: number) {
    try {
      const result = await this.breedsRepository.softDelete(id);

      if (result.affected === 0) {
        throw new Error(`Breed with ID ${id} not found.`);
      }

      return `Breed with ID ${id} has been successfully deleted.`;
    } catch (error) {
      throw new Error(`Error deleting breed with ID ${id}: ${error.message}`);
    }
  }
}
