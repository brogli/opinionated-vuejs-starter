{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    {
      devShells = nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShellNoCC {
            packages = with pkgs; [
              nodejs_24
              pnpm_11
              treefmt
              nixfmt
            ];

            env = {
              # Must be the same Playwright version as @playwright/test in package.json.
              PLAYWRIGHT_BROWSERS_PATH = pkgs.playwright-driver.browsers.override {
                withFirefox = false;
                withWebkit = false;
              };
              PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
            };
          };
        }
      );
    };
}
