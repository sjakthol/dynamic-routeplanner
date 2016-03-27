This repository contains Redux + React based demo POCs for the Aalto University School of Science [dynamic
routeplanner course project](https://dynaaminenseksti.wordpress.com/) (in Finnish).

Currently it contains a demo that shows the next departures for
a given stop in the Helsinki area: [live demo](http://sjakthol.github.io/drp/)


## Store Layout

```
{
  error: new Error("Human readable error message about an exception"),
  routing: ReactRouter data
  stops: {
    isFetching: false,
    stopData: {
      "id": {},
      "id2": {},
    },

    stopTimes: {
      "id": {
        timestamp: Date.now(),
        isFetching: true|false
        patterns: [],
      },
      "id2": {
        timestamp: Date.now(),
        isFetching: true|false
        patterns: [],
      },
    },

    selectedStop: {
      value: "stop-id",
      label: "stop-name",
    }
  }
}
```
