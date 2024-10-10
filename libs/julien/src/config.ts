const configDefaults = {
  hideExtraGrants: false,
  hidePlannedGrants: false,
  showFacilitationGrants: false,
  showGrantsSpecifications: false,
  useAllParticipants: false,
  useTitleColumn: false,
};

interface Config {
  hideExtraGrants: boolean;
  hidePlannedGrants: boolean;
  reportSchema?: string;
  showFacilitationGrants: boolean;
  showGrantsSpecifications: boolean;
  useAllParticipants: boolean;
  useTitleColumn: boolean;
}

/**
 * Merges partial config with default values.
 */
export function getConfig(config: Partial<Config> = {}): Config {
  return { ...configDefaults, ...config };
}
