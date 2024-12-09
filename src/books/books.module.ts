import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from 'src/schemas/book.schema';
import { AuthorSchema } from 'src/schemas/author.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Author', schema: AuthorSchema },
    { name: 'Book', schema: BookSchema }
  ])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
