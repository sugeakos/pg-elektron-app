import {Person} from "../../user/domain/person";
import {TvCategory} from "../../tv-category/domain/tv-category";

export class Tv {
  public externalId: string;
  public personEmail: string;
  public tvCategoryDescription: string;
  public errorSeenByCustomer: string;
  public reservedDateToRepair: number;
  public repairedError: string;
  public dateOfCorrection: number;
  public price: number;
  public isItStillInProgress: boolean;

  constructor() {
    this.externalId = '';
    this.personEmail = '';
    this.tvCategoryDescription = null;
    this.errorSeenByCustomer = '';
    this.reservedDateToRepair = null;
    this.repairedError = '';
    this.dateOfCorrection = null;
    this.price = null;
    this.isItStillInProgress = true;
  }
}
