import {
  StudieforbundGenerateMetadata,
  StudieforbundPage,
} from "app/(studieforbund)/_components/StudieforbundPage";

import { config } from "./config";

export const generateMetadata = StudieforbundGenerateMetadata(config);
export default StudieforbundPage(config);
