import { getAllStatesAction } from "@/domain/state/state.actions";
import StateIndexClient from "./components/StateIndexClient";

interface State {
  id?: string;
  name: string;
  type?: string | null;
  country: {
    name: string;
    cca3: string;
  };
  _count: {
    cities: number;
  };
}

export default async function StateIndexPage() {
  const result = await getAllStatesAction({
    limit: 50,
  });

  const initialStates =
    result.success && "data" in result
      ? (result.data as unknown as State[])
      : [];

  return <StateIndexClient initialStates={initialStates} />;
}
