import { AccountType } from '../../users/enums/account-type.enum';

export class JwtPayloadDto {
  sub: string;
  username: string;
  accountType: AccountType;
}
