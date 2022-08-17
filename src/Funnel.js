import { Button } from "@mui/material";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import InsuranceStepper from "./InsuranceStepper";

/**
 * Now doing
 * - Handles whole flow from start to finish
 * - Handles routing between insurance steps
 * - Handles validation in a step
 * - Handles arrays of insurances
 *
 * Missing
 * - Persist and rehydrate form state
 * - Persist and rehydrate route
 *
 * Considerations
 * - Context for the insurance?
 *    - We could have some helper function for the form register..
 *    Would make things a bit easier. You would not need to know in which route you are..
 */

const AddInsuranceButton = ({ insurance }) => {
  const navigate = useNavigate();
  const { control } = useFormContext();
  const { append, fields } = useFieldArray({
    control,
    name: insurance.keyName
  });

  return (
    <>
      <Button
        onClick={() => {
          append({});
          navigate(`/${insurance.path}/${fields.length}/1`);
        }}
        variant="primary"
      >
        {insurance.title}
      </Button>
    </>
  );
};

const initSteps = (steps) =>
  steps.map((step, i) => ({
    element: step[0],
    include: step[1],
    path: `${i + 1}`
  }));

const AutovakuutusStep3 = () => {
  const { register } = useFormContext();
  const { id } = useParams();

  return (
    <div>
      Auto kysymys 3<h3>Haluakko notta kaskon?</h3>
      <input
        {...register(`vehicles.${id}.name`, { required: true })}
        type="text"
      />
      <input {...register(`vehicles.${id}.kasko`)} type="checkbox" />
    </div>
  );
};

const HenkivakuutusStep2 = () => {
  const { register } = useFormContext();
  const { id } = useParams();

  return (
    <div>
      Henkivakuutus kysymys 2<h3>Mikä sun nimi o?</h3>
      <input
        {...register(`personalInsurances.${id}.name`, { required: true })}
        type="text"
      />
    </div>
  );
};

const showWhenKasko = (fnValues) => fnValues.kasko;

const Funnel = () => {
  const form = useFormContext();
  const location = useLocation();

  const autovakuutusSteps = initSteps([
    [<div>Auto kysymys 1</div>],
    [<div>Auto kysymys 2</div>],
    [<AutovakuutusStep3 />],
    [<div>Auto kysymys 5</div>, showWhenKasko],
    [<div>Auto kysymys 6</div>, showWhenKasko],
    [<div>Auto kysymys 8</div>, showWhenKasko],
    [<div>Auto kysymys 9</div>]
  ]);

  const henkivakuutusSteps = initSteps([
    [<div>Henk kysymys 1</div>],
    [<HenkivakuutusStep2 />],
    [<div>Henk kysymys 3</div>],
    [<div>Henk kysymys 4</div>]
  ]);

  const insurances = [
    {
      keyName: "vehicles",
      path: "autovakuutus",
      steps: autovakuutusSteps,
      title: "Autovakuutus"
    },
    {
      keyName: "personalInsurances",
      path: "henkivakuutus",
      steps: henkivakuutusSteps,
      title: "Henkivakuutus"
    }
  ];

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Nonii tervetuloa! Mistäs alootetaan?</h1>
              {insurances.map((insurance) => (
                <AddInsuranceButton
                  key={insurance.title}
                  insurance={insurance}
                />
              ))}
            </div>
          }
        />
        <Route
          path="valmis"
          element={
            <div>
              <h1>Valmis</h1>
              <h2>Mitäs sitte laitetaan?</h2>
              {insurances.map((insurance) => (
                <AddInsuranceButton
                  key={insurance.title}
                  insurance={insurance}
                />
              ))}
            </div>
          }
        />
        {insurances.map((insurance) =>
          insurance.steps.map((step) => (
            <Route
              key={step.path}
              path={[insurance.path, ":id", step.path].join("/")}
              element={
                <InsuranceStepper insurance={insurance}>
                  {step.element}
                </InsuranceStepper>
              }
            />
          ))
        )}
      </Routes>
      <h3 style={{ marginTop: "300px" }}>Dev tool</h3>
      <h4>Tämän hetkinen appis tila</h4>
      <div>{JSON.stringify(form.watch(), null, 2)}</div>
      <h4>Tämän hetkinen reitti</h4>
      <div>{location.pathname}</div>
    </>
  );
};

export default Funnel;
