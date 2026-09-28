export function toUKdate(dateStr: string) {
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

export function handleInputChangeFactory<T>(
  setFormValues: React.Dispatch<React.SetStateAction<T>>,
) {
  return function (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
}
//! REPLACES
// export   const { name, value, type } = e.target;
//   setFormValues({
//     ...formValues,
//     [name]: type === "number" ? Number(value) : value,
//   });
// }

export function handleEditChangeFactory<T>(
  setEditValues: React.Dispatch<React.SetStateAction<T>>,
) {
  return function (e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]:
        name === "current_amount" ? (value === "" ? "" : Number(value)) : value,
    }));
  };
}
//! REPLACES
// function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
//   const { name, value } = e.target;
//   setEditValues((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// }

export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let serverMessage = "";

      try {
        const err = await response.json();
        serverMessage = `${err.code || response.status}: ${err.message}`;
      } catch {
        serverMessage = `Server error: ${response.status}`;
      }

      return { ok: false, data: null, error: serverMessage };
    }

    const data = await response.json();
    return { ok: true, data, error: null };

  } catch {
    return { ok: false, data: null, error: "Network error — server unreachable" };
  }
}
