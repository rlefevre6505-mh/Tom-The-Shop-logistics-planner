import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Event,
  EquipmentList,
  EquipmentItem,
  Overlap,
  requirement,
  shop,
  vehicle,
} from "../../lib/types";

type ClashState = {
  events: Event[];
  equipmentLists: EquipmentList[];
  inventory: EquipmentItem[];
  overlaps: Overlap[];
  requiredVehicles: requirement[];
  hasClashes: boolean;
  loading: boolean;
  error?: string;
};

const initialState: ClashState = {
  events: [],
  equipmentLists: [],
  inventory: [],
  overlaps: [],
  requiredVehicles: [],
  hasClashes: false,
  loading: false,
};

export const fetchClashData = createAsyncThunk("clash/fetchAll", async () => {
  const [eventsRes, listsRes, invRes, reqRes] = await Promise.all([
    fetch("https://tom-the-shop-server.onrender.com/all-event-details"),
    fetch("https://tom-the-shop-server.onrender.com/get-equipment-lists"),
    fetch("https://tom-the-shop-server.onrender.com/get-inventory"),
    fetch("https://tom-the-shop-server.onrender.com/get-required-vehicles"),
  ]);

  const events: Event[] = await eventsRes.json();
  const equipmentLists: EquipmentList[] = await listsRes.json();
  const inventory: EquipmentItem[] = await invRes.json();
  const requiredVehicles: requirement[] = await reqRes.json();

  return { events, equipmentLists, inventory, requiredVehicles };
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

export function getEventAllocationWarnings(
  event: Event,
  requirements: requirement[],
) {
  const warnings: string[] = [];

  if (event.shops.length !== event.num_of_shops) {
    warnings.push(
      `Event "${event.title}" has ${event.shops.length} shops assigned but requires ${event.num_of_shops}.`,
    );
  }

  if (event.vehicles.length !== event.num_of_vehicles) {
    warnings.push(
      `Event "${event.title}" has ${event.vehicles.length} vehicles assigned but requires ${event.num_of_vehicles}.`,
    );
  }

  const unmetRequirements = requirements.filter((req) => {
    const shopAssigned = event.shops.some((shop) => shop.id === req.shop_id);
    if (!shopAssigned) return false;
    const vehicleAssigned = event.vehicles.some((v) => v.id === req.vehicle_id);
    return !vehicleAssigned;
  });

  unmetRequirements.forEach((req) => {
    warnings.push(
      `Shop "${req.shop_name}" requires vehicle "${req.vehicle_name}" but it is not assigned to "${event.title}".`,
    );
  });

  return warnings;
}

export function getAllocationWarningCount(
  events: Event[],
  requirements: requirement[],
) {
  return events.reduce(
    (count, event) => count + getEventAllocationWarnings(event, requirements).length,
    0,
  );
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
        state.requiredVehicles = action.payload.requiredVehicles;
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
export const selectRequiredVehicles = (s: { clash: ClashState }) =>
  s.clash.requiredVehicles;
export const selectOverlaps = (s: { clash: ClashState }) => s.clash.overlaps;
export const selectHasClashes = (s: { clash: ClashState }) =>
  s.clash.hasClashes;
export const selectClashCount = (s: { clash: ClashState }) =>
  s.clash.overlaps.length +
  getAllocationWarningCount(s.clash.events, s.clash.requiredVehicles);
