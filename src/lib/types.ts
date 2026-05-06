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

// export type FormValues = {
//   event_id: number | undefined;
//   title: string | undefined;
//   start: string | undefined;
//   end: string | undefined;
//   date_added: Date;
//   location: string | undefined;
//   num_of_shops: number | undefined;
//   shops: shop[];
//   num_of_vehicles: number | undefined;
//   vehicles: vehicle[];
//   note: note;
// };

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
