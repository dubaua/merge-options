export type UserOptions = Record<string, unknown>;
export type RequiredPredicate = (userOptions: Readonly<Partial<UserOptions>>) => boolean;
export type Validator<T> = (value: T, userOptions: Readonly<Partial<UserOptions>>) => boolean;

export type OptionWithDefault<T> = {
  /**
   * - a flag or function accepts userOptions
   */
  required: never;
  /**
   * - default value for fallback if user option fail validation
   */
  default?: T;
  /**
   * - validator for user option. Accepts userValue and userOptions. Should return boolean value.
   */
  validator: Validator<T>;
  /**
   * - human readable validator description. Uses to compose an error message and warning
   */
  description: string;
};

export type RequiredOption<T> = {
  /**
   * - a flag or function accepts userOptions
   */
  required?: boolean | RequiredPredicate | undefined;
  /**
   * - default value for fallback if user option fail validation
   */
  default?: never;
  /**
   * - validator for user option. Accepts userValue and userOptions. Should return boolean value.
   */
  validator: Validator<T>;
  /**
   * - human readable validator description. Uses to compose an error message and warning
   */
  description: string;
};

export type Option<T = any> = OptionWithDefault<T> | RequiredOption<T>;

export type OptionConfig = Record<string, Option>;

// завели дженерик по конфигу
export type MergeOptionsParams<TConfig extends OptionConfig = OptionConfig> = {
  /**
   * - declarative option configuration
   */
  optionConfig: TConfig;
  /**
   * - user options needs validation before merge
   *   ключи только из optionConfig
   */
  userOptions?: Partial<Record<keyof TConfig, unknown>>;
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

export type MergeOptionsResult<TConfig extends OptionConfig = OptionConfig> = Record<keyof TConfig, unknown>;

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
declare function mergeOptions<TConfig extends OptionConfig>(
  config: MergeOptionsParams<TConfig>,
): MergeOptionsResult<TConfig>;
