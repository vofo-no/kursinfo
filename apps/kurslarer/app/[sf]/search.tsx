"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Checkbox,
  ChipRemovable,
  Dialog,
  DialogBlock,
  DialogTrigger,
  DialogTriggerContext,
  Search as DSSearch,
  Field,
  Fieldset,
  FieldsetLegend,
  Heading,
  Label,
  SearchButton,
  SearchClear,
  SearchInput,
  useCheckboxGroup,
} from "@digdir/designsystemet-react";
import { FadersIcon } from "@phosphor-icons/react/ssr";

export function Search({
  counties,
  organizations,
}: {
  counties: string[];
  organizations: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const qRef = useRef<HTMLInputElement>(null);
  const { getCheckboxProps: getEmneCheckboxProps, setValue: setCountyValue } =
    useCheckboxGroup({
      onChange: (nextValue) => handleChange("fylke", nextValue),
    });
  const { getCheckboxProps: getOrgCheckboxProps, setValue: setOrgValue } =
    useCheckboxGroup({
      onChange: (nextValue) => handleChange("org", nextValue),
    });
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setCountyValue(searchParams.getAll("fylke"));
    setOrgValue(searchParams.getAll("org"));
  }, [searchParams, setCountyValue, setOrgValue]);

  const handleChange = useCallback(
    (name: string, value?: string | string[]) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        if (Array.isArray(value)) {
          params.delete(name);
          value.forEach((val) => params.append(name, val));
        } else {
          params.set(name, value);
        }
      } else {
        params.delete(name);
      }
      router.push([pathName, params.toString()].filter(Boolean).join("?"), {
        scroll: false,
      });
    },
    [pathName, router, searchParams],
  );

  const hasFilters = searchParams.has("fylke") || searchParams.has("org");

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("fylke");
    params.delete("org");
    router.push([pathName, params.toString()].filter(Boolean).join("?"), {
      scroll: false,
    });
  }, [pathName, router, searchParams]);

  return (
    <div className="flex flex-col gap-8 mb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleChange("q", qRef.current?.value || "");
        }}
        className="flex gap-4 flex-wrap not-sm:flex-col sm:items-end max-w-2xl w-full"
      >
        <Field className="grow">
          <Label>Søk etter kurslærere</Label>
          <DSSearch>
            <SearchInput
              type="text"
              name="q"
              placeholder="f.eks. strikking, treskjæring, folkedans"
              id="q-input"
              ref={qRef}
              defaultValue={searchParams.get("q") || ""}
              key={`filterq-${searchParams.get("q")}`}
            />
            <SearchClear />
            <SearchButton />
          </DSSearch>
        </Field>
        <DialogTriggerContext>
          <DialogTrigger variant="secondary">
            <FadersIcon aria-hidden />
            Filter
          </DialogTrigger>
          <Dialog
            modal
            closedby="any"
            placement="right"
            style={{ zIndex: "10" }}
            ref={dialogRef}
          >
            <DialogBlock>
              <Heading level={1}>Velg filter</Heading>
            </DialogBlock>
            <DialogBlock className="max-h-[calc(100vh-184px)] overflow-y-scroll">
              <div className="flex flex-col my-8 gap-8">
                <Fieldset>
                  <FieldsetLegend>Fylker</FieldsetLegend>
                  {counties.map((item) => (
                    <Checkbox
                      label={item}
                      {...getEmneCheckboxProps(item)}
                      key={item}
                    />
                  ))}
                </Fieldset>
                <Fieldset>
                  <FieldsetLegend>Organisasjon</FieldsetLegend>
                  {organizations.map((item) => (
                    <Checkbox
                      label={item}
                      {...getOrgCheckboxProps(item)}
                      key={item}
                    />
                  ))}
                </Fieldset>
              </div>
            </DialogBlock>
            <DialogBlock className="flex gap-4">
              <Button
                onClick={() => dialogRef.current?.close()}
                variant="primary"
                className="flex-1"
              >
                Vis kurslærere
              </Button>
              <Button
                type="button"
                variant="secondary"
                data-color="danger"
                disabled={!hasFilters}
                onClick={() => {
                  clearFilters();
                  dialogRef.current?.close();
                }}
              >
                Fjern filtre
              </Button>
            </DialogBlock>
          </Dialog>
        </DialogTriggerContext>
      </form>
      <div className="gap-2 flex flex-wrap">
        {searchParams.get("q") && (
          <ChipRemovable
            onClick={() => {
              if (qRef.current) qRef.current.value = "";
              handleChange("q", "");
            }}
          >
            Søkeord: {searchParams.get("q")}
          </ChipRemovable>
        )}
        {searchParams.getAll("fylke").map((item) => {
          return (
            <ChipRemovable
              key={`rchip-fylke-${item}`}
              data-color="brand1"
              onClick={() =>
                handleChange(
                  "fylke",
                  searchParams.getAll("fylke").filter((i) => i !== item),
                )
              }
            >
              {item}
            </ChipRemovable>
          );
        })}
        {searchParams.getAll("org").map((item) => {
          return (
            <ChipRemovable
              key={`rchip-org-${item}`}
              data-color="brand2"
              onClick={() =>
                handleChange(
                  "org",
                  searchParams.getAll("org").filter((i) => i !== item),
                )
              }
            >
              {item}
            </ChipRemovable>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxGroup({
  legend,
  name,
  values,
  checked,
}: {
  legend: string;
  name: string;
  values: string[];
  checked: string[];
}) {
  if (values.length === 0) return null;
  return (
    <details open={checked.length > 0}>
      <summary>
        {legend}
        {checked.length > 0 && ` (${checked.length})`}
      </summary>
      <fieldset className="mt-2 grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">{legend}</legend>
        {values.map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              value={value}
              defaultChecked={checked.includes(value)}
            />
            {value}
          </label>
        ))}
      </fieldset>
    </details>
  );
}
