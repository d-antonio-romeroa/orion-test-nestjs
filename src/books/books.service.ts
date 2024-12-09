import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from 'src/schemas/book.schema';
import { Model } from 'mongoose';
import ValidationException from 'src/exceptions/ValidationException';
import { Author } from 'src/schemas/author.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Book.name) private bookModel: Model<Book>
  ) { }

  async create(createBookDto: CreateBookDto) {
    try {
      // const book = new this.bookModel(createBookDto);
      // return await book.save();
      const { title, authors } = createBookDto;

      // Handle nested authors
      const authorIds = [];
      if (authors && authors.length > 0) {
        for (const authorDto of authors) {
          const existingAuthor = await this.authorModel.findOne({ name: authorDto.name });
          if (existingAuthor) {
            authorIds.push(existingAuthor._id);
          } else {
            const newAuthor = new this.authorModel({ name: authorDto.name });
            const savedAuthor = await newAuthor.save();
            authorIds.push(savedAuthor._id);
          }
        }
      }

      // Create the book with associated authors
      const book = new this.bookModel({
        title,
        authors: authorIds,
      });

      const savedBook = await book.save();

      // Add the book to each author's list of books
      await this.authorModel.updateMany(
        { _id: { $in: authorIds } },
        { $addToSet: { books: savedBook._id } } // Add the book to the authors' book lists
      );

      return savedBook.populate('authors');

    } catch (error) {
      if (error && error.name === 'MongoServerError') {
        throw ValidationException(error.message);
      }
    }
  }

  findAll(): Promise<Book[]> {
    return this.bookModel.find().populate('authors', 'name').exec();
  }

  async getBooksAveragePagesPerChapter(): Promise<{ bookId: string; average: number }[]> {
    const result = await this.bookModel.aggregate([
      {
        $match: {
          chapters: { $gt: 0 }, // Avoid division by zero
        },
      },
      {
        $project: {
          _id: 1,
          averagePagesPerChapter: {
            $round: [{ $divide: ['$pages', '$chapters'] }, 2], // Calculate and round to 2 decimals
          },
        },
      },
    ]);
  
    return result.map((book) => ({
      bookId: book._id.toString(),
      average: book.averagePagesPerChapter,
    }));
  }

}
