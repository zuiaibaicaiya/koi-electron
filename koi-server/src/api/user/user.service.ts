import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/api/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll(page = 1, pageSize = 16) {
    return this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }

  findOne(id: number) {
    return this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id })
      .getOne();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.softDelete(id);
  }
}
