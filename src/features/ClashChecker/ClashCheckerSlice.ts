import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Event,
  EquipmentList,
  EquipmentItem,
  Overlap,
  shop,
  vehicle,
} from "../../lib/types";

type ClashState = {
  events: Event[];
  equipmentLists: EquipmentList[];
  inventory: EquipmentItem[];
  overlaps: Overlap[];
  hasClashes: boolean;
  loading: boolean;
  error?: string;
};

const initialState: ClashState = {
  events: [],
  equipmentLists: [],
  inventory: [],
  overlaps: [],
  hasClashes: false,
  loading: false,
};

export const fetchClashData = createAsyncThunk("clash/fetchAll", async () => {
  const [eventsRes, listsRes, invRes] = await Promise.all([
    fetch("https://tom-the-shop-server.onrender.com/all-event-details"),
    fetch("https://tom-the-shop-server.onrender.com/get-equipment-lists"),
    fetch("https://tom-the-shop-server.onrender.com/get-inventory"),
  ]);

  const events: Event[] = await eventsRes.json();
  const equipmentLists: EquipmentList[] = await listsRes.json();
  const inventory: EquipmentItem[] = await invRes.json();

  return { events, equipmentLists, inventory };
});

function findOverlappingEvents(events: Event[]): Overlap[] {
  const results: Overlap[] = [];
  for (let i = 0; i < events.length; i++) {
    const a = events[i];
    const overlapsWith: Event[] = [];
    for (let j = i + 1; j < events.length; j++) {
      const b = events[j];
      const overlap =
        new Date(a.start) < new Date(b.end) &&
        new Date(a.end) > new Date(b.start);
      if (overlap) overlapsWith.push(b);
    }
    if (overlapsWith.length > 0) results.push({ event: a, overlapsWith });
  }
  return results;
}

export function isCurrent(dateStr: string): boolean {
  const endDate = new Date(dateStr);
  const today = new Date();
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);
  return endDate >= dayBeforeYesterday;
}

export function getSharedShops(e1: Event, e2: Event): shop[] {
  return e1.shops.filter((s1) => e2.shops.some((s2) => s2.id === s1.id));
}

export function getSharedVehicles(e1: Event, e2: Event): vehicle[] {
  return e1.vehicles.filter((v1) => e2.vehicles.some((v2) => v2.id === v1.id));
}

export function getEventEquipmentTotals(
  event: Event,
  equipmentListsState: EquipmentList[] | undefined,
) {
  if (!equipmentListsState)
    return {} as Record<number, { name: string; amount: number }>;
  const totals: Record<number, { name: string; amount: number }> = {};
  event.shops.forEach((shop) => {
    const list = equipmentListsState.find((el) => el.shop_id === shop.id);
    if (!list) return;
    list.equipment.forEach((item) => {
      if (!totals[item.equipment_id]) {
        totals[item.equipment_id] = { name: item.equipment_name, amount: 0 };
      }
      totals[item.equipment_id].amount += item.required_amount;
    });
  });
  return totals;
}

export function getGroupEquipmentShortages(
  events: Event[],
  equipmentListsState: EquipmentList[] | undefined,
  inventory: EquipmentItem[],
) {
  if (!equipmentListsState)
    return [] as Array<{
      equipment_name: string;
      required: number;
      available: number;
      shortage: number;
    }>;
  const combined: Record<number, { name: string; amount: number }> = {};
  events.forEach((ev) => {
    const totals = getEventEquipmentTotals(ev, equipmentListsState);
    for (const id in totals) {
      if (!combined[id]) {
        combined[id] = { ...totals[id] };
      } else {
        combined[id].amount += totals[id].amount;
      }
    }
  });

  const shortages: Array<{
    equipment_name: string;
    required: number;
    available: number;
    shortage: number;
  }> = [];
  for (const id in combined) {
    const req = combined[id];
    const inv = inventory.find((i) => i.id === Number(id));
    if (inv && req.amount > inv.current_amount) {
      shortages.push({
        equipment_name: req.name,
        required: req.amount,
        available: inv.current_amount,
        shortage: req.amount - inv.current_amount,
      });
    }
  }
  return shortages;
}

const slice = createSlice({
  name: "clash",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Event[]>) {
      const filtered = action.payload.filter((e) => isCurrent(e.end));
      state.events = filtered;
      state.overlaps = findOverlappingEvents(state.events);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClashData.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchClashData.fulfilled, (state, action) => {
        state.loading = false;
        const filtered = action.payload.events.filter((e) => isCurrent(e.end));
        state.events = filtered;
        state.equipmentLists = action.payload.equipmentLists;
        state.inventory = action.payload.inventory;
        state.overlaps = findOverlappingEvents(state.events);
        state.hasClashes = state.overlaps.length > 0;
      })
      .addCase(fetchClashData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setEvents } = slice.actions;

export default slice.reducer;

export const selectEvents = (s: { clash: ClashState }) => s.clash.events;
export const selectEquipmentLists = (s: { clash: ClashState }) =>
  s.clash.equipmentLists;
export const selectInventory = (s: { clash: ClashState }) => s.clash.inventory;
export const selectOverlaps = (s: { clash: ClashState }) => s.clash.overlaps;
export const selectHasClashes = (s: { clash: ClashState }) =>
  s.clash.hasClashes;
