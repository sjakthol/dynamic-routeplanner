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
        patterns: [],
      },
      "id2": {
        timestamp: Date.now(),
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
