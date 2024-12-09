import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from 'src/schemas/book.schema';
import { AuthorSchema } from 'src/schemas/author.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Author', schema: AuthorSchema },
    { name: 'Book', schema: BookSchema },
  ])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
