#Created by Artemijs Poznaks
#Created on : 29/08/16
''' file path is passed with a _js instead of .js, because html doesnt like "."'''

import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.autoreload
import collections
import json
import ast
import signal
import logging
import cgi, sys, os, random, string, shutil
import pymysql
import base64
from binascii import a2b_base64

from intel  import File_Parser

from tornado.options import options
is_closing = False
port = 5555

#begin exiting server
def signal_handler(signum, frame):
	global is_closing
	logging.info('exiting...')
	is_closing = True
#exit server
def try_exit():
	global is_closing
	if is_closing:
		# clean up here
		tornado.ioloop.IOLoop.instance().stop()
		logging.info('exit success')
#serve the index file
class Index(tornado.web.RequestHandler):
	def get(self):
		self.render("index.html")

#saves text
class SaveFile(tornado.web.RequestHandler):
	def post(self):
		print("saving file")
		message = self.request.body.decode("utf-8")
		print (message)
		self.write("dobra")

#return directory and file list for the project view panel
class ProjectFileList(tornado.web.RequestHandler):
	def post(self):
		some_dir = self.request.body.decode("utf-8")
		level = 1
		some_dir = some_dir.rstrip(os.path.sep)
		some_dir = "./static/"+some_dir
		print(some_dir)
		assert os.path.isdir(some_dir)
		some_dir = some_dir[:-1]#remove last "/"
		list_of_dirs = [some_dir[9:].replace("/",""),]#find the parent folder

		for root, dirs, files in os.walk(some_dir):
			depth = root.count(os.path.sep)
			if depth < level:
				list_of_dirs += dirs + files
				#print("files  :: "+str(files))
		print("result")
		print(list_of_dirs)
		self.write(json.dumps(list_of_dirs))

#return text inside a file
#so turns out tornado doesnt allow to change files while its running, if a change is made the server must be restarted
class GetFileText(tornado.web.RequestHandler):
	def get(self):
		path = self.get_argument('file_path')
		path = path[:-1]
		ind = path.rfind("_")
		path = path[:ind] + "." + path[ind+1:]
		path = "./static/" + path
		print(" opening file :			 "+path)
		content = ""
		with open(path) as f:
			content = f.read()
		self.write(content)

#save text to file
class SaveCode(tornado.web.RequestHandler):
	def post(self):
		path = self.get_argument('file_path')
		path = path[:-1]
		ind = path.rfind("_")
		path = path[:ind] + "." + path[ind+1:]
		path = "./static/" + path
		code = self.get_argument('code')
		print("\n")
		print("saving file "+path)
		
		with open(path, "w") as f:
			f.write(code)
		intel = File_Parser()
		lstr = intel.parse_json(path)
		self.write(lstr)

#rename files por folders
class Rename(tornado.web.RequestHandler):
	def post(self):
		path = self.get_argument('file_path')
		path = "./static/"+path[:-1]
		path = path.replace("_",".")
		print()
		print("renaming from "+path)
		new_path = self.get_argument('new_file_path')
		ind = new_path.rfind("_")
		if ind != -1 :
			new_path = new_path[:ind] + "." + new_path[ind+1:]
		new_path = "./static/"+new_path[:-1]
		print("to "+new_path)
		#assert os.path.isdir(path)
		#assert os.path.isdir(new_path)
		os.rename(path, new_path)
		self.write("dobra")

#create a new folder
class NewFolder(tornado.web.RequestHandler):
	def post(self):
		path = self.get_argument('file_path')
		path = "./static/"+path[:-1]
		print()
		print("creating "+path)
		os.makedirs(path)
		self.write("dobra")

#create a new file
class NewFile(tornado.web.RequestHandler):
	def post(self):
		path = self.get_argument('file_path')
		path = "./static/"+path[:-1]
		print()
		print("creating "+path)
		open(path, 'a').close()
		self.write("dobra")
class RemoveFile(tornado.web.RequestHandler):
	def post(self):
		path = self.get_argument('file_path')
		isFile = self.get_argument("type")
		ind = path.rfind("_")
		if ind != -1 :
			path = path[:ind] + "." + path[ind+1:]
		path = "./static/"+path[:-1]
		print()
		print("deleting file: "+isFile+" "+path)
		if isFile == "yes":
			os.remove(path)
		else:
			shutil.rmtree(path)
		self.write("dobra")

#create a new project
class NewProject(tornado.web.RequestHandler):
	def post(self):
		print()
		print("creating a new project")
		shutil.copytree("./static/project_template", "./static/projects/project_template")
		os.rename("./static/projects/project_template", "./static/projects/"+self.get_argument("name"))
		self.write("dobra")

#run project
class RunProject(tornado.web.RequestHandler):
	def post(self):
		print()
		path = self.get_argument("project_path")
		print("running project " + path)
		#index.html
		content = ""
		path = "./static/"+path
		srcpath = path[:-10]
		with open(path) as f:
			content = f.read()
		content = content.replace("{{project_name}}",self.get_argument("project_name"))
		self.write(content)

#send back the contents of a js file
class GetJSFile(tornado.web.RequestHandler):
	def get(self):
		path = self.get_argument('file_path')
		print()
		path = "./static/projects/"+path
		print(" sending js file :			 "+path)
		content = ""
		with open(path) as f:
			content = f.read()
		self.write(content)

#get the intelisense data
class GetIntelisense(tornado.web.RequestHandler):
	def get(self):
		path = self.get_argument('file_path')
		path = path.replace("_",".")
		path = "./static/"+path[:-1]
		intel = File_Parser()
		lstr = intel.parse_json(path)
		print()
		print("getting intel for " + path)
		print("sending "+lstr)
		self.write(lstr)

#used to define where files are stored and where the source files are located
settings = {
	"static_path": os.path.join(os.path.dirname(__file__), "static"),
}
#bind handlers to the application urls
application = tornado.web.Application([
	(r"/", Index),
	(r"/save", SaveFile),
	(r"/save_code", SaveCode),
	(r"/file_panel", ProjectFileList),
	(r"/file", GetFileText),
	(r"/rename", Rename),
	(r"/new_folder", NewFolder),
	(r"/new_file", NewFile),
	(r"/remove", RemoveFile),
	(r"/new_project", NewProject),
	(r"/run_project", RunProject),
	(r"/get_file", GetJSFile),
	(r"/get_intel", GetIntelisense),
], **settings)

if __name__ == "__main__":
	print ('enteringApplication, listening on port ' + str(port))
	#connect to the database here later
	
	tornado.options.parse_command_line()
	signal.signal(signal.SIGINT, signal_handler)
	application.listen(port)
	tornado.ioloop.PeriodicCallback(try_exit, 100).start() 
	tornado.ioloop.IOLoop.instance().start()
	
