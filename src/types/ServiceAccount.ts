
    import { User } from "./User";
    export interface ServiceAccount {
          id: number;
  name: string;
  client_id: string;
  client_secret: string;
  createdon: Date;
  updatedby: User;
  updatedon: Date;
  expireson: Date | null | undefined;
    }