import { ApiProperty } from '@nestjs/swagger';
export class LoginResponseDto {
  @ApiProperty({
    description: 'token',
  })
  token: string;
}
