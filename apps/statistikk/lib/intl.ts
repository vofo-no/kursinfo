import { createIntl, createIntlCache } from "@formatjs/intl";

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: "nb-NO",
    messages: {},
  },
  cache,
);

export default intl;
