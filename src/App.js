import { FormProvider, useForm } from "react-hook-form";
import { MemoryRouter } from "react-router";
import Funnel from "./Funnel";
import "./styles.css";

export default function App() {
  const form = useForm();
  return (
    <div className="App">
      <FormProvider {...form}>
        <MemoryRouter>
          <Funnel />
        </MemoryRouter>
      </FormProvider>
    </div>
  );
}
