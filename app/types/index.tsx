interface ChildrenCheckBox {
  id: string;
  name: string;
  level: number;
  children: ChildrenCheckBox[];
}

export interface DataCheckBox {
  id: string;
  name: string;
  level: number;
  children: ChildrenCheckBox[];
}


export interface Data {
  [key: string]: {
    id: string;
    name: string;
    level: number;
    children: Data;
  };
}