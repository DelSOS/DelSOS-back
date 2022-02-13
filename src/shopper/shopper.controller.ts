import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/auth-guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { EmailDto } from 'src/auth/DTO/email.dto';
import { ForgotPasswordDto } from 'src/auth/DTO/forgotPassword.dto';
import { Password } from 'src/auth/DTO/password.dto';
import { editFileName } from 'src/utils/constants';
import { Roles } from 'src/utils/decorators/role.decorator';
import { ROLE } from 'src/utils/enum';
import { RolesGuard } from 'src/utils/guards/role.guard';
import { PaginationParams } from 'src/utils/pagination.params';
import { CreateShopperDto } from './DTO/shopperCreation.dto';
import { Shopper } from './models/shopper.model';
import { ShopperService } from './shopper.service';

@Controller('shopper')
export class ShopperController {
  constructor(private readonly shopperService: ShopperService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
  async shopperRregister(@Body() createShopperDto: CreateShopperDto) {
    console.log(createShopperDto);
    return await this.shopperService.registerShopper(createShopperDto);
  }

  @Get('/:id')
  @Roles(ROLE.shopper, ROLE.admin)
  async getShopperById(@Param('id') id: string) {
    console.log("id",id);
    
    return this.shopperService.getShopper(id);
  }
  @Get('/shoppers/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.admin)
  async getAllShoppers(): Promise<Shopper[]> {
    return this.shopperService.getAll();
  }
  @Get('get/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(ROLE.admin)
  async getAllWithPagination(
    @Query() { skip, limit }: PaginationParams,
  ): Promise<Shopper[]> {
    return this.shopperService.getAll_v2(skip, limit);
  }

  
  @Post('/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.shopper,ROLE.admin)
  @UseInterceptors(
    FileInterceptor('cin', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async updateShopper(
    @Body() newShopper,
    @GetUser() shopper,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    console.log('controller')
    return this.shopperService.updateShopper(shopper._id,newShopper,file);
  }

  @Post('/add-pic')
  @Roles(ROLE.shopper)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @UseInterceptors(
    FileInterceptor('pic', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async updatePic(
    @GetUser() shopper,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.shopperService.addPic(shopper._id,file);
  }

  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for authentification.',
  })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(ROLE.shopper)
  @Post('/update-password')
  async updatePasswordShopper(
    @Body() passwordData: Password,
    @GetUser() shopper,
  ): Promise<any> {
    return this.shopperService.updateShopperPassword(passwordData, shopper._id);
  }

  @Delete('/delete/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.shopper,ROLE.admin)
  async deleteShopper(@Param('id') id: string): Promise<any> {
    return this.shopperService.deleteShopper(id);
  }

  @Post('/forgot-password')
  @ApiCreatedResponse({})
  async forgotPassword(@Body() emailInfo: EmailDto) {
    return await this.shopperService.forgotPassword(emailInfo.email);
  }

  @ApiHeader({
    name: 'Bearer',
    description: 'the token we need for authentification.',
  })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(ROLE.shopper,ROLE.admin)
  @Post('/reset-password')
  @ApiCreatedResponse({})
  async resetPassword(
    @Body() passwordInfo: ForgotPasswordDto,
    @GetUser() user,
  ) {
    return await this.shopperService.resetPassword(passwordInfo, user);
  }
}
