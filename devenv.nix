{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/languages/
  languages.typescript.enable = true;
  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };
}
