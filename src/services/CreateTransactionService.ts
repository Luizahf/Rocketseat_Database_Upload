import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string, 
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: RequestDTO ): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    
    if(type !== 'income' && type !=='outcome') {
      throw new AppError('Type invalido');
    }

    const { total } = await transactionsRepository.getBalance();

    if ( total < value && type === 'outcome') {
      throw new AppError('Saldo Insuficiente!');
    }

    const category_id = await this.getCategory(category);
    const transaction = await transactionsRepository.create({
      title, value, type, category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }

  private async getCategory(category_name: string) : Promise<string> {
    const categoryRepository = getRepository(Category);

    const checkCategory = await categoryRepository.findOne({
      where: { title: category_name},
    });

    if (!checkCategory) {
      const newCategory = await categoryRepository.create({
        title: category_name, 
      });

      await categoryRepository.save(newCategory);

      return newCategory.id;
    }

    return checkCategory.id;
  }
}

export default CreateTransactionService;
