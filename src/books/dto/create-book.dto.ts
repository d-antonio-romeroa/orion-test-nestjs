import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class NestedAuthorDto {
    @IsString()
    name: string;
}

export class CreateBookDto {
    @IsString()
    title: string;

    @IsNumber()
    chapters: number;

    @IsNumber()
    pages: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => NestedAuthorDto)
    authors: NestedAuthorDto[]; // IDs of authors
}
