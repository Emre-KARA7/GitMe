import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 404,
    type: CreateUserDto,
    description: 'User Not Found',
  })
  @ApiOperation({
    summary: 'This Endpoint Creates a User',
    description: 'Desctiption of the endpoint',
  })
  @Post()
  @Roles() // This is a public route
  // @Roles('admin', 'user') // This is a protected route only for admin and user
  // @Roles('admin') // This is a protected route only for admin
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/email')
  findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
