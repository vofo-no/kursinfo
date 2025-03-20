import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeAccessToken } from "@kinde-oss/kinde-auth-nextjs/types";

interface KindeAccessTokenWithOrgId extends KindeAccessToken {
  external_org_id?: string;
}

export async function getOrgId() {
  const { getAccessToken } = getKindeServerSession();
  const accessToken = (await getAccessToken()) as
    | KindeAccessTokenWithOrgId
    | undefined;

  return accessToken?.external_org_id;
}
