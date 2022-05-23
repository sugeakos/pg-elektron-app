import {Person} from "../person/person";
import {TvCategory} from "../tv-category/tv-category";

export class Tv {
  public externalId: string;
  public person: Person;
  public tvCategory: TvCategory;
  public errorSeenByCustomer: string;
  public reservedDateToRepair: Date;
  public repairedError: string;
  public dateOfCorrection: Date;
  public price: number;
  public isItStillInProgress: boolean;

  constructor() {
    this.externalId = '';
    this.person = null;
    this.tvCategory = null;
    this.errorSeenByCustomer = '';
    this.reservedDateToRepair = null;
    this.repairedError = '';
    this.dateOfCorrection = null;
    this.price = 0;
    this.isItStillInProgress = true;
  }
}
