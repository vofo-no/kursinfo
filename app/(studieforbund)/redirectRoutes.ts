import injectDefaultParams from "app/(studieforbund)/_helpers/injectDefaultParams";
import { StudieforbundParams } from "app/(studieforbund)/types";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Partial<StudieforbundParams> },
) {
  const { year, county, organization, group } = injectDefaultParams(
    context.params,
  );
  const prefix = request.nextUrl.pathname.split("/")[1];

  redirect(`/${prefix}/${year}/${county}/${organization}/${group}`);
}
