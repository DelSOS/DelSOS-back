import { ConflictException, NotFoundException,Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateShopperDto } from "./DTO/shopperCreation.dto";
import { Shopper } from './models/shopper.model';
import * as bcrypt from 'bcrypt';
import { Store } from "./models/store.model";
import { CreateStoreDto } from "./DTO/storeCreation.dto";

@Injectable()
export class UserService {
 
   constructor(
    @InjectModel('Shopper') 
     private readonly userModel: Model<Shopper>,
     @InjectModel('Store')
     private readonly storeModel: Model<Store>
) {}
  
  async registerShopper(userData: CreateShopperDto): Promise<any> {
    const email = userData.email ;
    const name = userData.name ;
    const username = `${name}-${Math.random().toString(36).substr(2, 9)}`;
      console.log(username)
     if (await this.userModel.findOne({ email })) {
       
      throw new NotFoundException(`This email  is already used`);
    } 
       const user =  await this.userModel.create({
         ...userData,
         username, 
         bankDetails: {
           owner: "",
           number:"",
           expirationdate:""
         }, 
         address: ""
      });
      
      user.password = await bcrypt.hash(user.password,10);
      try {
        await user.save();
      } catch (e) {
        throw new ConflictException(`the email should be unique`);
      }
    return "shopper created";

    }
 
    async registerStore(userData: CreateStoreDto): Promise<any> {
      const email = userData.email ;
      const name = userData.name;

        
    if (await this.storeModel.findOne({ email })) {
         
        throw new NotFoundException(`This email  is already used`, `This email is already used`);
      } 
         const user =  await this.storeModel.create({
           ...userData,
           address: []
        });
        
        user.password = await bcrypt.hash(user.password,10);
        try {
          await user.save();
        } catch (e) {
          throw new ConflictException(`the email should be unique`);
        }
      return "store created";
  
      }


}