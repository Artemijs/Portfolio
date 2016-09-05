# !/usr/bin/python
import os

some_dir = "./projects/project1"
list_of_dirs = [some_dir[some_dir.rindex("/"):],]



print("result")
print(list_of_dirs)
"""for root, dirs, files in os.walk(some_dir):
	num_sep_this = root.count(os.path.sep)
	if num_sep + level <= num_sep_this:
		del dirs[:]
	print(dirs)
"""
"""import os
for root, dirs, files in os.walk("./projects", topdown=False):
print(dirs)
for name in files:
print(os.path.join(root, name))
for name in dirs:
print(os.path.join(root, name))"""