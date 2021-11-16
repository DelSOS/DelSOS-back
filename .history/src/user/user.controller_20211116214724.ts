import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { CreateShopperDto } from './DTO/shopperCreation.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    ) {}
    @ApiHeader({
      name: 'Bearer',
      description: 'the token we need for auth.'
  })
  @Post('/create-shopper')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
    async register(@Body() createShopperDto: CreateShopperDto) {
      return createShopperDto.firstname;
   //   return await this.userService.register(createShopperDto);
  }
}

