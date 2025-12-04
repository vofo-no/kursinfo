import Form from "next/form";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Search({ query }: { query?: string }) {
  return (
    <Form action="">
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="q">Hva trenger du kurslærer til?</FieldLabel>
              <div className="flex space-x-3">
                <Input
                  id="q"
                  name="q"
                  defaultValue={query || ""}
                  placeholder="f.eks. strikking, treskjæring, folkedans"
                  required
                />
                <Button type="submit">Søk</Button>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </Form>
  );
}
