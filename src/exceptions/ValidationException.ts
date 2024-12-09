import { HttpException, HttpStatus } from "@nestjs/common";

const ValidationException = (error: string) => {
    return new HttpException(
        error,
        HttpStatus.BAD_REQUEST,
      );
};

export default ValidationException;