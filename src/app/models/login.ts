import { user } from "./users";

export interface loginMutationResponse  {
  access_token: string,
  refresh_token: string,
  user: user
}