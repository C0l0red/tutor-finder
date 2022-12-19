import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountType } from './enums/account-type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.userModel
      .findOne({ email: createUserDto.email })
      .then((existingUser) => {
        if (existingUser) throw new ConflictException('Email already taken');
      });

    const newUser = { ...createUserDto } as User;

    newUser.password = await this.hashPassword(createUserDto.password);

    if (createUserDto.accountType === AccountType.TUTOR) newUser.tutor = null;

    const user = await this.userModel.create(newUser);

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
    };
  }

  async update(updateUserDto: UpdateUserDto, { _id }: User) {
    const user = await this.findById(_id, true);

    if (updateUserDto.oldPassword) {
      await this.verifyPassword(user, updateUserDto.oldPassword, true);
      user.password = await this.hashPassword(updateUserDto.newPassword);
    }

    user.firstName = updateUserDto.firstName || user.firstName;
    user.lastName = updateUserDto.lastName || user.lastName;

    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      accountType: updatedUser.accountType,
    };
  }

  async remove(user: User) {
    await this.userModel.remove({ _id: new Types.ObjectId(user._id) });
  }

  async findOne() {}

  async findByEmail(email: string) {
    return this.userModel
      .findOne({ email })
      .select('+password')
      .populate('tutor');
  }

  async findById(userId: string, includePassword = false) {
    return this.userModel
      .findById(userId)
      .select(includePassword ? '+password' : undefined)
      .then((user) => {
        if (!user) throw new NotFoundException('User not found');

        return user;
      });
  }

  async verifyPassword(
    user: User,
    password: string,
    throwIfNotCorrect = false,
  ) {
    return bcrypt.compare(password, user.password).then((isCorrect) => {
      if (throwIfNotCorrect && !isCorrect)
        throw new BadRequestException('Invalid password');
      return isCorrect;
    });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async addTutorId(user: User, tutorId: string) {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(user._id) },
      { tutor: tutorId },
    );
  }
}
