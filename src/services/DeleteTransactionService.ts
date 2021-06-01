import AppError from '../errors/AppError';
import { getRepository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checkTransaction = await transactionsRepository.findOne(id);

    if (!checkTransaction) {
      throw new AppError("Transaction não existente!");
    }
    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
