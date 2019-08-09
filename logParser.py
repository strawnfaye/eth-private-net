import re
import sys

if (len(sys.argv) != 2):
	print("Error: expected command line arg, file to parse")
	sys.exit()	
	
log_file_path = sys.argv[1]
#regex = re.compile(r".*Locking control of sender.*|.*Releasing control of sender.*")
regexLock = re.compile(r".*Locking control of sender.*")
regexRelease = re.compile(r".*Releasing control of sender.*")
parallelTransactionCtr = 0

with open(log_file_path, "r") as file:
		for line in file:
			if (regexLock.search(line)):
				parallelTransactionCtr += 1
				print(line)
				print(parallelTransactionCtr, " transactions read in parallel.")

			if (regexRelease.search(line)):
				if parallelTransactionCtr > 0:
					parallelTransactionCtr -= 1
					print(line)
					print(parallelTransactionCtr, " transactions read in parallel.")

file.close()
