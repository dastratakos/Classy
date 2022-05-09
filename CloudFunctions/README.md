## Usage

To run the emulator locally, run the following command:

```sh
firebase emulators:start
```

To deploy functions, run the following command:

```sh
firebase deploy --only functions
```

If you get an error that Port 8080 is not open on localhost, you can find and
kill the previous instance of the emulator with these commands:

```sh
lsof -i tcp:8080
kill -15 [PID]
```