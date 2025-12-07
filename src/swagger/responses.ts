import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' })
  userId: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;
}

export class DeleteUserResponse {
  @ApiProperty({ example: true })
  deleted: boolean;

  @ApiProperty({ example: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' })
  userId: string;
}

export class ErrorResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'User with ID xyz not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
