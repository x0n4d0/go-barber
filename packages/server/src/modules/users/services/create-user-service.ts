import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/app-error';
import { ICacheProvider } from '@shared/container/providers/cache-provider/models/interface-cache-provider';
import { IUsersRepository } from '../repositories/interface-users-repository';
import { IHashProvider } from '../providers/hash-provider/models/interface-hash-provider';

import { User } from '../infra/typeorm/entities/user';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}
