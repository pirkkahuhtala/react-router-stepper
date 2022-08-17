import { LinearProgress } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { resolvePath, useLocation, useNavigate, useParams } from "react-router";

const useInsuranceStepper = ({ insurance }) => {
  // Routing
  const location = useLocation();
  const navigate = useNavigate();
  let { id } = useParams();

  // Form
  const form = useFormContext();
  const values = form.watch();
  const { remove } = useFieldArray({
    control: form.control,
    name: insurance.keyName
  });

  // State
  const steps = insurance.steps.filter(
    (step) => !step.include || step.include(values[insurance.keyName][id])
  );
  const parent = resolvePath("../../", location.pathname).pathname;
  let current = steps.findIndex((step) =>
    location.pathname.endsWith(step.path)
  );

  if (current < 0) {
    current = 0;
  }

  const currentProgress = (current / (steps.length - 1)) * 100;

  // Actions
  const backward = () => {
    if (current > 0) {
      navigate(parent + [id, steps[current - 1].path].join("/"));
    } else {
      remove(id);
      navigate("/");
    }
  };

  const forward = async () => {
    const valid = await form.trigger();

    if (!valid) {
      return;
    }

    if (current < steps.length - 1) {
      navigate(parent + [id, steps[current + 1].path].join("/"));
    } else {
      navigate("/valmis");
    }
  };

  return [{ currentProgress }, { backward, forward }];
};

const InsuranceStepper = ({ children, insurance }) => {
  const [{ currentProgress }, { backward, forward }] = useInsuranceStepper({
    insurance
  });

  return (
    <div>
      <h1>{insurance.title}</h1>
      <LinearProgress variant="determinate" value={currentProgress} />
      <div style={{ padding: "2rem" }}>{children}</div>
      <div
        style={{
          display: "flex",
          padding: "1rem",
          justifyContent: "center",
          gap: "1rem"
        }}
      >
        <button onClick={backward}>Edellinen</button>
        <button onClick={forward}>Seuraava</button>
      </div>
    </div>
  );
};

export default InsuranceStepper;
