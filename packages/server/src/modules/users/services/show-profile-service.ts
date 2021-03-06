import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/app-error';
import { IUsersRepository } from '../repositories/interface-users-repository';

import { User } from '../infra/typeorm/entities/user';

interface IRequest {
  user_id: string;
}

@injectable()
export class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}
