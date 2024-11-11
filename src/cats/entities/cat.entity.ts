import { Breed } from 'src/breeds/entities/breed.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @ManyToOne(() => Breed, (breed) => breed.id, {
    // cascade: true,
    eager: true, // para que traiga las raza al hacer un findOne
  })
  breed: Breed;

  @DeleteDateColumn()
  deletedAt: Date;
}
