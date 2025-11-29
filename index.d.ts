export type UserOptions = Record<string, unknown>;

export type RequiredPredicate<TUserOptions extends UserOptions> = (
  userOptions: Readonly<Partial<TUserOptions>>,
) => boolean;

export type Validator<TValue, TUserOptions extends UserOptions> = (
  value: unknown,
  userOptions: Readonly<Partial<TUserOptions>>,
) => value is TValue;

export type Option<TValue, TUserOptions extends UserOptions = UserOptions> = {
  required?: boolean | RequiredPredicate<TUserOptions>;
  default?: TValue;
  validator: Validator<TValue, TUserOptions>;
  description: string;
};

export type OptionConfig<TUserOptions extends UserOptions = UserOptions> = Record<
  string,
  Option<unknown, TUserOptions>
>;

export type MergeOptionsParams<
  TConfig extends OptionConfig<TUserOptions>,
  TUserOptions extends UserOptions = UserOptions,
> = {
  optionConfig: TConfig;
  userOptions?: Partial<TUserOptions>;
  preffix?: string;
  suffix?: string;
  strict?: boolean;
};

export type MergeOptionsResult<TConfig extends OptionConfig> = {
  [K in keyof TConfig]: TConfig[K] extends Option<infer TValue, any> ? TValue : unknown;
};

export default function mergeOptions<
  TConfig extends OptionConfig<TUserOptions>,
  TUserOptions extends UserOptions = UserOptions,
>(params: MergeOptionsParams<TConfig, TUserOptions>): MergeOptionsResult<TConfig>;
