import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { UserResponseModel, RegisterUserRequestModel } from 'src/model/user.model';
// import { CreateDto } from './dto/create-.dto';
// import { UpdateDto } from './dto/update-.dto';
// import { sService } from './s.service';
import { webResponse } from '../model/web.model';
import { LoginUserRequestModel, RegisterUserRequestModel, UserResponseModel } from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('/register')
  @HttpCode(200)
  async create(@Body() request: RegisterUserRequestModel): Promise<webResponse<UserResponseModel>> {
    const result = await this.userService.create(request);

    return {
      data: result
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequestModel,
  ): Promise<webResponse<UserResponseModel>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  // @Get()
  // findAll() {
  //   return this.sService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  //   return this.sService.update(+id, updateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sService.remove(+id);
  // }
}
