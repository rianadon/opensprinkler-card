# Default Card Configuration

```yaml
name: "Sprinkler"
icon: "mdi:sprinkler-variant"

hide_dots: false
hide_disabled: false

card_line_height: "small"
timer_line_height: "medium"
popup_line_height: "small"

icons: {
  # If any of these icons are set to `false`,
  # the default entity icon will be used
  run_once: 'mdi:auto-fix'
  station: {
    active: 'mdi:water'
    active_disabled: 'mdi:water-off'
    idle: 'mdi:water-outline'
    idle_disabled: 'mdi:water-off-outline'
  }
  program: {
    active: 'mdi:timer'
    active_disabled: 'mdi:timer-off'
    idle: 'mdi:timer-outline'
    idle_disabled: 'mdi:timer-off-outline'
  }
}
```
