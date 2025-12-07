import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Password' })
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'johndoe', description: 'Username' })
  username?: string;

  @ApiPropertyOptional({ example: 'john@example.com', description: 'Email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'newPassword123', description: 'Password' })
  password?: string;
}
