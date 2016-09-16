import json
#import time
#for
#if
#else
#elseif
#while
#function
#all these have their own scope
#some of these can be written without a {}
#i have to identify which it is maybe
keys = ["for","else if", "if", "else", "while", "function"]
#if there is no { then the scope is only the next line, no need to check
#lets try sorting it somehow by which is in what scope
class File_Parser:
	long_str = ""
	level=0
	skip_count =0
	line_count = 1
	def get_scope_name(self, line, key):
		if key != "function": return key
		if line[line.find(key)+len(key)] == '(':return key
		else:
			return (line[(line.find(key)+len(key)+1): line.rfind(")")+1])

	def get_var_name(self, line):
		if line.count("=") >0 :
			return '"'+(line[(line.find("var")+4): line.find("=")])+'"'
		else:
			return '"'+(line[(line.find("var")+4): line.find(";")])+'"'

	def tab_times(self, count_of_tabs):
		output = ""
		while count_of_tabs > 0:
			count_of_tabs-=1
			output+="\t"
		return output



	def get_function_args(line):
		args = (line[line.rfind("(")+1:line.rfind(")")])
		args = args.split(",")
		output = ""
		for arg in args:
			output+= tab_times(level)+'["'+arg+'", '+str(line_count)+'],' +"\n"
		return output

	def check_keys(self, line):
		for key in keys:
			if line.count(key) > 0:
				if line.count("{")> 0:
					line= line.rstrip("\n")
					return '"'+self.get_scope_name(line,key)+'"'
				break #there can only be ONE
		return "none"

	def parse_json(self, path):
		#start_time = time.time()
		long_comment = False;
		with open(path) as f:
			for line in f:
				if line.count("/*")>0:
					long_comment = True
				if long_comment and line.count("*/")>0:
					long_comment = False
				if long_comment:
					continue
				#banish anything thats a comment to the fucking oblivion and may it rot in worms for giving me so much trouble
				if line.count("//"):
					line = line[:line.find("//")]
				#find the start of scope
				found = False
				scope_name = self.check_keys(line)
				if scope_name != "none":
					File_Parser.long_str += self.tab_times(File_Parser.level)+"["+scope_name+", "+str(File_Parser.line_count)+", [\n"
					File_Parser.level+=1
					found = True
				if not found:
					if line.count("{") > 0:
						#if theres a { but no keyword
						File_Parser.skip_count+=1

				#find the end of scope
				if line.count("}") > 0 :
					if File_Parser.skip_count > 0:#skip it if needed
						File_Parser.skip_count -=1
					else:
						File_Parser.level-=1
						las_C = File_Parser.long_str[-2:]
						if las_C[0] ==",":
							File_Parser.long_str = File_Parser.long_str[:-2]+"\n"#this part right here slows down the code by a lot
						File_Parser.long_str += self.tab_times(File_Parser.level)+"], "+str(File_Parser.line_count)+" ],\n"
					
				if line.count("var") > 0:
					File_Parser.long_str += self.tab_times(File_Parser.level)+"["+self.get_var_name(line)+", "+str(File_Parser.line_count)+"],\n"
				File_Parser.line_count+=1;
		File_Parser.long_str = "["+File_Parser.long_str[:-2]+"]"
		return File_Parser.long_str
		#print("--- %s seconds ---" % (time.time() - start_time))



'''
sttr = File_Parser().parse_json("./file_viewer.js")
with open('file_to_write', 'w') as f:
	f.write(sttr)
print("finished")
'''