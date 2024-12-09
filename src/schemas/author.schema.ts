import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
    @Prop({ required: true, unique: true })
    name: string;
  
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] }) // Reference to Book
    books: Types.ObjectId[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);