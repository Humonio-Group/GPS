export interface User {
  id: number;
  key: string;
  avatar?: string;
  name: {
    first: string;
    last: string;
    full: string;
  };
  biography: {
    base: string;
    long: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  social: {
    linkedin: string;
  };
}
