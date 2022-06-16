export class Person {
  public externalId: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public username: string;
  public password: string;
  public address: string;
  public phoneFix: string;
  public phoneMobile: string;
  public profileImageUrl: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public role: string; //ROLE_USER, ROLE_ADMIN
  public authorities: [];
  public isActive: boolean;
  public isNotLocked: boolean;

  constructor() {
    this.externalId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.password = '';
    this.email = '';
    this.phoneFix = '';
    this.phoneMobile = '';
    this.address = '';
    this.isActive = false;
    this.isNotLocked = false;
    this.role = '';
    this.authorities = [];
  }

}
