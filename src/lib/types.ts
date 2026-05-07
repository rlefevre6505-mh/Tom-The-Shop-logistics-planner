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

export type shop = {
  id: number;
  shop_name: string;
};

export type vehicle = {
  id: number;
  vehicle_name: string;
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
