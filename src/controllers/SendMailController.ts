import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailSrvice from '../services/SendMailSrvice';
import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    // CONSULTA SE O USUÁRIO(USER) JÁ EXISTE PELO E-MAIL
    const user = await usersRepository.findOne({ email });
    
    if (!user) {
      throw new AppError('User does not exists.');
    }

    // CONSULTA SE A CONSULTA(SURVEY) JÁ EXISTE PELO ID
    const survey = await surveysRepository.findOne({
      id: survey_id
    });

    if (!survey) {
      throw new AppError('Survey does not exists.');
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"]
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL
    }

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;

      await SendMailSrvice.execute(email, survey.title, variables, npsPath);

      return response.json(surveyUserAlreadyExists);
    }

    // SALVA AS INFORMAÇÕES NA TABELA
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);
    
    // ENVIAR E-MAIL PARA O USUÁRIO
    variables.id = surveyUser.id;
    
    await SendMailSrvice.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }

  async show(request: Request, response: Response) {
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const all = await surveysUsersRepository.find();

    return response.json(all);
  }
}

export { SendMailController }