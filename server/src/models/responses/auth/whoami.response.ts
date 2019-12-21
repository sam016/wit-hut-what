
class WhoAmIProfile {
  id: number;
  name: string;
  email: string;
}

export class WhoAmIResponse {
  profile: WhoAmIProfile;
  exp: number;
}
