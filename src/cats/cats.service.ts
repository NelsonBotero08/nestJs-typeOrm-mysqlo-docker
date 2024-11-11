import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    try {
      const breed = await this.breedsRepository.findOneBy({
        name: createCatDto.breed,
      });

      if (!breed) {
        throw new BadRequestException('Breed not found');
      }

      const cat = this.catRepository.create({
        name: createCatDto.name,
        age: createCatDto.age,
        breed,
      });
      return await this.catRepository.save(cat);
    } catch (error) {
      throw new Error('Error creating cat: ' + error.message);
    }
  }

  async findAll() {
    return await this.catRepository.find();
  }

  // Si estás usando NestJS

  async findOne(id: number) {
    try {
      const catOne = await this.catRepository.findOneBy({ id });

      if (catOne === null) {
        throw new NotFoundException(`El gato con ID ${id} no existe`);
      }

      return catOne;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Error interno del servidor');
    }
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catRepository.findOneBy({ id });

    if (!cat) {
      throw new BadRequestException('Cat not found');
    }

    let breed;
    if (updateCatDto.breed) {
      breed = await this.breedsRepository.findOneBy({
        name: updateCatDto.breed,
      });

      if (!breed) {
        throw new BadRequestException('Breed not found');
      }
    }

    return await this.catRepository.save({
      ...cat,
      ...updateCatDto,
      breed,
    });
  }

  async remove(id: number) {
    try {
      const result = await this.catRepository.softDelete(id);

      if (result.affected === 0) {
        throw new Error(`Cat with ID ${id} not found.`);
      }

      // Si la eliminación fue exitosa
      return `Cat with ID ${id} has been successfully deleted.`;
    } catch (error) {
      // Si ocurrió un error en el proceso
      throw new Error(`Error deleting cat with ID ${id}: ${error.message}`);
    }
  }
}
