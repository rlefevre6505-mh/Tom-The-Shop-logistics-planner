export type addEventFormValues = {
  title: string;
  start: string;
  end: string;
  date_added: Date;
  location: string;
  num_of_shops: number;
  shops: number[];
  num_of_vehicles: number;
  vehicles: number[];
};

export type addNoteFormValues = { note: string; event_id: number | undefined };
export type AddInventoryItemValues = { name: string; amount: number | string };

export type shop = {
  id: number;
  shop_name: string;
};

export type vehicle = {
  id: number;
  vehicle_name: string;
  vehicle_reg: string;
};

export type note = {
  note: string;
};

export type calendarEvent = {
  end?: string;
  id?: number;
  start?: string;
  title?: string;
};

export type eventDetailsObject = {
  id: number;
  title: string;
  start: string;
  end: string;
  date_added: Date;
  location?: string;
  num_of_shops?: number;
  shops?: shop[];
  num_of_vehicles?: number;
  vehicles?: vehicle[];
  notes?: note[];
};

export type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
  date_added: string;
  location: string;
  notes: note[];
  num_of_shops: number;
  num_of_vehicles: number;
  shops: shop[];
  vehicles: vehicle[];
};

export type EquipmentItem = {
  id: number;
  equipment_name: string;
  current_amount: number;
};
