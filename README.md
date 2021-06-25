# Lovelace OpenSprinkler Card

Collect [OpenSprinkler][opensprinkler] status into a card for [Home Assistant][home-assistant].

You will need the [OpenSprinkler integration][opensprinkler-integration] installed.

![Screenshots](https://raw.githubusercontent.com/rianadon/opensprinkler-card/main/images/readme.png)

## Install

OpenSprinkler Card is available from [HACS][hacs] (search for "opensprinkler card"). If you don't have [HACS][hacs] installed, follow the [manual installation](#manual-installation) instructions.

## Options

| Name              | Type    | Requirement  | Description                                                 |
| ----------------- | ------- | ------------ | ------------------------------------------------------------|
| type              | string  | **Required** | `custom:opensprinkler-card`                                 |
| device            | string  | **Required** | Device id of the OpenSprinkler in Home Assistant            |
| name              | string  | **Optional** | Card title (e.g. "Sprinkler")                               |
| icon              | string  | **Optional** | Card icon (e.g. "mdi:sprinkler-variant")                    |
| bars              | dict    | **Optional** | Configuration for the progress bars                         |
| hide_disabled     | bool    | **Optional** | If `true`, hide disabled stations and programs in the popup |
| extra_entities    | array   | **Optional** | Entities to always show in the card                         |
| input_number      | string  | **Optional** | Configuration for run-duration-choosing entity              |

Finding device ids is tricky, so I recommend using the dropdown in the visual card editor rather than YAML.

## Entity ID requirements

This card locates your OpenSprinkler entities by using their entity ids. If you haven't changed these, you have nothing to worry about.

Otherwise, make sure:
- The ids of station status sensors end with `_status`
- The ids of program running binary sensors end with `_program_running`
- The id of the OpenSprinkler controller enabled switch ends with `_enabled`
- The ids of program & station enabled switches end with `_enabled`

## Extra entities and duration control

By default, the only way to control stations is to first click on the 3 dots in the top-right corner of the card. If you'd like to have a few stations controls always accessible from the dashboard, you can add them to the bottom of the card with the `extra_entities` option. You can also add programs or even any entity type (`switch`es, `light`s, etc).

<img alt="Screenshot" src="https://raw.githubusercontent.com/rianadon/opensprinkler-card/main/images/input-stations.png" width="455" height="196" />

Stations also default to a runtime of 1 minute. To extend the length they run for, make an `input_number` entity then link it to the card via the `input_number` option. The slider or box input will appear in the popup, and if you are using the `extra_entities` option, in the card as well.

<table> <tr>
<th> Entity configuration </th> <th> Home Assistant configuration.yaml </th>
</tr> <tr> <td>

```yaml
type: custom:opensprinkler-card
device: 3e0a97a098f4609215aed92fe19bb7fb
extra_entities:
  - sensor.front_lawn_station_status
  - sensor.arbor_drip_station_status
input_number:
  entity: input_number.slider
```

</td>
<td>

```yaml

input_number:
  slider:
    name: Station Duration
    initial: 5 # in minutes
    min: 1
    max: 30
    step: 1
    # You can also use mode: box
```

</td> </tr> </table>

You can also use custom cards for the duration control, like [numberbox-card](https://github.com/htmltiger/numberbox-card). As well as headings inside the `extra_entities`! (anything without a `.` is a heading)

<table> <tr>
<td>

<img alt="Screenshot" src="https://raw.githubusercontent.com/rianadon/opensprinkler-card/main/images/numberbox-images.png" width="375" height="331" />

</td> <td>

```yaml
...
input_number:
  entity: input_number.slider1
  type: custom:numberbox-card
  unit: m
  icon: mdi:timelapse
extra_entities:
  - Stations
  - sensor.front_lawn_station_status
  - sensor.arbor_drip_station_status
  - sensor.s15_station_status
  - Sensors
  - sensor.opensprinkler_water_level
  - sensor.upstairs_humidity
```

</td> </tr> </table>

## Progress bar customization

The OpenSprinkler card depends on the [Timer Bar Card](https://github.com/rianadon/timer-bar-card) for rendering progress bars. You can use Timer Bar customization options inside the OpenSprinkler card by inserting your configurations under the `bars` option. You'll need to switch to the code (YAML) editor to use these options. Fields under the [Customization](https://github.com/rianadon/timer-bar-card#customization) section are supported. For an example:

<img alt="Screenshot" src="https://raw.githubusercontent.com/rianadon/opensprinkler-card/main/images/progressbar-customization.png" width="457" height="202" />

```yaml
type: custom:opensprinkler-card
device: 3e0a97a098f4609215aed92fe19bb7fb
name: Sprinkler
bars:
  bar_foreground: pink
  icon: mdi:tortoise
  active_icon: mdi:rabbit
```

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
