# Lovelace OpenSprinkler Card

Collect [OpenSprinkler][opensprinkler] status into a card for [Home Assistant][home-assistant].

You will need the [OpenSprinkler integration][opensprinkler-integration] installed.

![Screenshots](https://raw.githubusercontent.com/rianadon/opensprinkler-card/main/images/readme.png)

:warning: **BEWARE**: There are bugs :bug:

## Install

I haven't published to [HACS][hacs] yet, so there's an extra step here:
1. Add this repository to custom repositories by clicking the rotated-90-degrees-ellipses icon in the upper right of HACS and selecting custom repositories. Enter https://github.com/rianadon/opensprinkler-card as the url and Lovelace as the category.
2. Click add repositories and search for "opensprinkler card". Install the card.

If you don't have [HACS][hacs] installed, see [manual installation](#manual-installation).

## Options

| Name              | Type    | Requirement     | Description                                          |
| ----------------- | ------- | ------------    | -------------------------------------------          |
| type              | string  | **Required**    | `custom:opensprinkler-card`                              |
| device            | string  | **Required** | Device id of the OpenSprinkler in Home Assistant. |
| name            | string  | **Optional** | Card title. |

Finding device ids is tricky, so I recommend using the dropdown in the visual card editor rather than YAML.

## Entity id requirements

This card locates your OpenSprinkler entities by using their entity ids. If you haven't changed these, you have nothing to worry about.

Otherwise, make sure:
- The ids of Station status sensors end with `_status`
- The ids of Program running binary sensors end with `_program_running`
- The id of the Opensprinkler Enable switch ends with `opensprinkler_enabled`
- The ids of program & station enabled switches end with `_enabled`

## Manual installation

1. Download `opensprinkler-card.js` from the [latest release][release] and move this file to the `config/www` folder.
2. Ensure you have advanced mode enabled (accessible via your username in the bottom left corner)
3. Go to Configuration -> Lovelace Dashboards -> Resources.
4. Add `/local/opensprinkler-card.js` with type JS module.
5. Refresh the page? Or restart Home Assistant? The card should eventually be there.

[home-assistant]: https://github.com/home-assistant/home-assistant
[opensprinkler]: https://opensprinkler.com
[opensprinkler-integration]: https://github.com/vinteo/hass-opensprinkler
[hacs]: https://hacs.xyz/
[release]: https://github.com/rianadon/oepnsprinkler-card/releases
