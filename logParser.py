import re
import sys

if (len(sys.argv) < 2):
	print("Error: expected command line arg, file to parse")
	sys.exit()	


#regex = re.compile(r".*Locking control of sender.*|.*Releasing control of sender.*")
regexLock = re.compile(r".*Locking control of sender.*")
regexRelease = re.compile(r".*Releasing control of sender.*")

logBuffer = ""

for i in range(1,len(sys.argv)):
	log_file_path = sys.argv[i]
	parallelTransactionCtr = 0
	maxDegreeOfConcurrency = 0

	with open(log_file_path, "r") as file:
			for line in file:
				if (regexLock.search(line)):
					parallelTransactionCtr += 1
					if (parallelTransactionCtr > maxDegreeOfConcurrency):
						maxDegreeOfConcurrency = parallelTransactionCtr
					logBuffer += str(line) + "\n"
					logBuffer += str(parallelTransactionCtr) + " transactions being attempted.\n"

				if (regexRelease.search(line)):
					if parallelTransactionCtr > 0:
						parallelTransactionCtr -= 1
						logBuffer += str(line) + "\n"
						logBuffer += str(parallelTransactionCtr) + " transactions being attempted.\n"

	file.close()

	if (maxDegreeOfConcurrency > 1):
		print(logBuffer)

	print()
	print("Max of ", maxDegreeOfConcurrency, " transactions run in parallel found in ", log_file_path)
