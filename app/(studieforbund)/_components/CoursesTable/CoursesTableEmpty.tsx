"use client";

import getHref from "app/(studieforbund)/_helpers/getHref";
import { isDefaultCounty } from "app/(studieforbund)/_helpers/isDefaultCounty";
import { isDefaultOrganization } from "app/(studieforbund)/_helpers/isDefaultOrganization";
import { StudieforbundParams } from "app/(studieforbund)/types";
import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "lib/constants";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { AlertTriangle } from "react-feather";

export default function CoursesTableEmpty() {
  const params = useParams<StudieforbundParams>();
  const prefix = usePathname()?.split("/")[1] || "";

  return (
    <div className="w-full text-center mx-auto leading-10 py-12">
      <AlertTriangle size={42} className="mx-auto my-3 text-gray-500" />
      <p className="text-gray-700 font-medium text-lg text-center">
        Ingen data å vise
      </p>
      <p className="text-gray-500 text-center">
        Vi finner ikke noe data som passer med dette utvalget.
      </p>
      <div className="flex justify-center gap-4">
        {!isDefaultOrganization(params.organization) && (
          <Link
            href={getHref(prefix, params, {
              organization: DEFAULT_ORGANIZATION_PARAM,
            })}
          >
            Vis alle organisasjoner
          </Link>
        )}

        {!isDefaultCounty(params.county) && (
          <Link
            href={getHref(prefix, params, {
              county: DEFAULT_COUNTY_PARAM,
            })}
          >
            Vis hele landet
          </Link>
        )}
      </div>
    </div>
  );
}
