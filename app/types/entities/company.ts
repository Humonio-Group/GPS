export interface Company {
  id: number;
  key: string;
  alias: string;
  name: string;
  drive: boolean;
  colors: {
    first: string;
    second: string;
  };
  icon: string;
  logo: string;
}
