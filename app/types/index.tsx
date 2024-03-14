interface ChildrenCheckBox {
  id: string;
  name: string;
  level: number;
  children: ChildrenCheckBox[];
  checked: boolean;
}

export interface DataCheckBox {
  id: string;
  name: string;
  level: number;
  children: ChildrenCheckBox[];
  checked: boolean;
}
