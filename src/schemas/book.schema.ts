import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
    @Prop({required: true, unique: true, index: true})
    title: string;

    @Prop()
    chapters: number;

    @Prop()
    pages: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Author' }] }) // Reference to Author
    authors: Types.ObjectId[];
}

export const BookSchema = SchemaFactory.createForClass(Book);