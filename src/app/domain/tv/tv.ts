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

}
