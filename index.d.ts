export type RequiredPredicate<TUserOptions extends Record<string, unknown>> = (
  userOptions: Readonly<Partial<TUserOptions>>,
) => boolean;
export type Validator<TValue, TUserOptions extends Record<string, unknown>> = (
  value: TValue,
  userOptions: Readonly<Partial<TUserOptions>>,
) => boolean;

export type OptionWithDefault<TValue = any, TUserOptions extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * - a flag or function accepts userOptions
   */
  required?: false;
  /**
   * - default value for fallback if user option fail validation
   */
  default: TValue;
  /**
   * - validator for user option. Accepts userValue and userOptions. Should return boolean value.
   */
  validator: Validator<TValue, TUserOptions>;
  /**
   * - human readable validator description. Uses to compose an error message and warning
   */
  description: string;
};

export type RequiredOption<TValue = any, TUserOptions extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * - a flag or function accepts userOptions
   */
  required: true | RequiredPredicate<TUserOptions>;
  /**
   * - default value for fallback if user option fail validation
   */
  default?: never;
  /**
   * - validator for user option. Accepts userValue and userOptions. Should return boolean value.
   */
  validator: Validator<TValue, TUserOptions>;
  /**
   * - human readable validator description. Uses to compose an error message and warning
   */
  description: string;
};

export type Option<TValue = any, TUserOptions extends Record<string, unknown> = Record<string, unknown>> =
  | OptionWithDefault<TValue, TUserOptions>
  | RequiredOption<TValue, TUserOptions>;

export type OptionConfig<TUserOptions extends Record<string, unknown> = Record<string, unknown>> = {
  [TKey in keyof TUserOptions]: Option<TUserOptions[TKey], TUserOptions>;
};

export type MergeOptionsParams<TUserOptions extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * - declarative option configuration
   */
  optionConfig: OptionConfig<TUserOptions>;
  /**
   * - user options needs validation before merge
   *   keys only from optionConfig
   */
  userOptions?: Partial<TUserOptions>;
  /**
   * - string before an error or warning message
   */
  preffix?: string;
  /**
   * - string after an error or warning message
   */
  suffix?: string;
  /**
   * - strict mode flag. Default = true. In strict mode the function throws an error when validation fails, otherwise falls back to default with warning.
   */
  strict?: boolean;
};

export type MergeOptionsResult<TUserOptions extends Record<string, unknown> = Record<string, unknown>> = {
  [TKey in keyof TUserOptions]-?: TUserOptions[TKey];
};

/**
 * Uses option configuration to iterate over passed user options.
 * Returns an object with user options passed validation and/or default not required values.
 * Throws an error for every missing required option.
 * Fallback to default value to every not required option.
 * If user value fails validation throws an error in strict mode or otherwise shows a warning message and fallback to default value.
 * All errors and warnings are verbose and composed based on description of options.
 * @param {MergeOptionsParams} config - configuration for mergeOptions
 * @returns {MergeOptionsResult} an object with all keys described in options with userOption values if they pass validation and/or default not required values.
 */
declare function mergeOptions<TUserOptions extends Record<string, unknown>>(
  config: MergeOptionsParams<TUserOptions>,
): MergeOptionsResult<TUserOptions>;
