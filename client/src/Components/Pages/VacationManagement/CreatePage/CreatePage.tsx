import React from "react";
import { FormPage } from "../Form/FormPage";

export function CreatePage(): JSX.Element {
  return (
    <section className="CreatePage">
      <FormPage isEdit={false} Id={null} vacation={null} />
    </section>
  );
}
