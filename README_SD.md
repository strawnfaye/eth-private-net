# Concurrency Testing on the Private Net

## Setup

### Refresh the environment

```
$ ./eth-private-net clean
$ ./eth-private-net init
```

### Start up the nodes in separate windows

```
$ ./eth-private-net start bob
```

```
$ ./eth-private-net start alice
```

```
$ ./eth-private-net start lily
```

### Run the bash script

This script connects the three nodes, starts bob's miner, and sends a small amount of ether from alice to lily.

```
$ ./tx-test
```

_if you have issues with permissions when executing the bash script, run_ `chmod 0755 tx-test` .

The debug information for this test can be found in _bob/console.log_
