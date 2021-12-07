import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShopperDto } from './DTO/shopperCreation.dto';
import { Shopper } from './models/shopper.model';
import * as bcrypt from 'bcrypt';
import { Store } from './models/store.model';
import { CreateStoreDto } from './DTO/storeCreation.dto';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Shopper')
    private readonly userModel: Model<Shopper>,
    @InjectModel('Store')
    private readonly storeModel: Model<Store>,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  async registerShopper(userData: CreateShopperDto): Promise<any> {
    const email = userData.email;
    const firstname = userData.firstname;
    const lastname = userData.lastname;
    const username = `${firstname}-${lastname}`;

    if (await this.userModel.findOne({ email })) {
      throw new ConflictException(`This email  is already used`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
      username,
      bankDetails: {
        owner: '',
        number: '',
        expirationdate: '',
      },
      address: '',
    });

    const confirmToken = await this.authService.createConfirmToken({
      username: user.username,
      sub: user._id,
    });

    const info = await this.mailService.sendUserConfirmation(
      {
        email: user.email,
        username: user.username,
      },
      confirmToken,
    );

    return 'shopper created';
  }

  async registerStore(userData: CreateStoreDto): Promise<any> {
    const email = userData.email;

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    if (await this.userModel.findOne({ email })) {
      return new ConflictException(`This email  is already used`);
    }

    const user = await this.storeModel.create({
      ...userData,
      password: hashedPassword,
      address: [],
    });

    return 'store created';
  }
}
