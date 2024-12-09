import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from 'src/schemas/author.schema';
import { Model } from 'mongoose';
import ValidationException from 'src/exceptions/ValidationException';

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) { }

  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const book = new this.authorModel(createAuthorDto);
      return await book.save();
    } catch (error) {
      if(error && error.name === 'MongoServerError') {
        throw ValidationException(error.message);
      }
    }
  }

  findAll() {
    return this.authorModel.find().populate('books').exec();
  }

  async findAuthorWithBooks(authorId: string): Promise<Author> {
    return this.authorModel.findById(authorId).exec();
  }
}
