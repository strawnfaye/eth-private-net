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

_note: I recommend creating aliases in your `.bashrc` or `.bash_profile` for above commands (i.e. one for both refresh commands, then 3 separate ones for starting the nodes). It feels way less frustrating when the commands are just one word!_

### Run the bash script

This script connects the five nodes, starts bob's miner, and then performs a series of transactions from multiple senders to multiple receivers.
in parallel.

```
$ ./tx-test
```

_if you have issues with permissions when executing the bash script, run_ `chmod 0755 tx-test` .

The debug information for this test can be found in _bob/console.log_
