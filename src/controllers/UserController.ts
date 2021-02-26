import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

import { UsersRepository } from '../repositories/UsersRepository';


class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;
    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório.'),
      email: yup.string().email().required('E-mail é obrigtório ou inválido.')
    });

    // if (!(await schema.isValid(request.body))) {
    //   return response.status(400).json({
    //     error: 'Validation failed.'
    //   });
    // }
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error);
    }
    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new AppError('User already exists.');
    }

    const user = userRepository.create({
      name, email
    });

    await userRepository.save(user);
    
    return response.status(201).json(user);
  }

  async show(request: Request, response: Response) {
    const userRepository = getCustomRepository(UsersRepository);

    const all = await userRepository.find();

    if (!all) {
      return response.status(400).json({
        error: 'User already exists'
      });
    }

    return response.json(all);
  }
}

export { UserController };
