import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Person = {
  name: string;
  earning: number;
};

type Expense = {
  name: string;
  amount: number;
};

type FairSplitStore = {
  persons: Person[];
  expenses: Expense[];
  totalEarning: () => number;
  addPerson: () => void;
  updatePerson: (index: number, person: Partial<Person>) => void;
  removePerson: (index: number) => void;
  addExpense: () => void;
  updateExpense: (index: number, expense: Partial<Expense>) => void;
  removeExpense: (index: number) => void;
  resetStore: () => void;
};

const randomNames = ["Bob", "Charlie", "Diana", "Eve", "Frank", "Grace"];
const getRandomName = () =>
  randomNames[Math.floor(Math.random() * randomNames.length)];
const getRandomEarning = (min = 1_000, max = 5_000) =>
  Math.floor(Math.random() * max) + min;

const generateDefaultState = () =>
  ({
    persons: [
      { name: getRandomName(), earning: getRandomEarning() },
      { name: getRandomName(), earning: getRandomEarning() },
    ],
    expenses: [
      { name: "Rent", amount: 1400 },
      { name: "Food", amount: 600 },
      { name: "Entertainment", amount: 200 },
    ],
  } satisfies Partial<FairSplitStore>);
const generateEmptyState = () => ({
  persons: [{ name: "", earning: 0 }],
  expenses: [{ name: "", amount: 0 }],
});

const getTotalEarning = (persons: Person[]) => {
  return persons.reduce((total, person) => total + person.earning, 0);
};

export const useFairSplitStore = create(
  persist<FairSplitStore>(
    (set, get) => ({
      ...generateDefaultState(),

      totalEarning: () => getTotalEarning(get().persons),

      addPerson: () =>
        set((state) => ({
          persons: [...state.persons, { name: "", earning: 0 }],
        })),

      updatePerson: (index, person) =>
        set((state) => {
          const persons = [...state.persons];
          persons[index] = { ...persons[index], ...person };
          return { persons };
        }),

      removePerson: (index) =>
        set((state) => ({
          persons: state.persons.filter((_, i) => i !== index),
        })),

      addExpense: () =>
        set((state) => ({
          expenses: [...state.expenses, { name: "", amount: 0 }],
        })),

      updateExpense: (index, expense) =>
        set((state) => {
          const expenses = [...state.expenses];
          expenses[index] = { ...expenses[index], ...expense };
          return { expenses };
        }),

      removeExpense: (index) =>
        set((state) => ({
          expenses: state.expenses.filter((_, i) => i !== index),
        })),

      resetStore: () => set(generateEmptyState()),
    }),
    {
      name: "fair-split-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
