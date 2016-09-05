#Created by Artemijs Poznaks
#Created on : 29/08/16
#Last Edited on : 29/08/16

import tornado.ioloop
import tornado.web
import tornado.websocket
import collections
import json
import ast
import signal
import logging
import cgi, sys, os, random, string
import pymysql
import base64
from binascii import a2b_base64

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
		print(some_dir)
		assert os.path.isdir(some_dir)
		some_dir = some_dir[:-1]
		list_of_dirs = [some_dir[some_dir.rindex("/")+1:],]

		for root, dirs, files in os.walk(some_dir):
			depth = root.count(os.path.sep)
			if depth < level:
				list_of_dirs+=dirs
		print("result")
		print(list_of_dirs)
		self.write(json.dumps(list_of_dirs))


#used to define where files are stored and where the source files are located
settings = {
	"static_path": os.path.join(os.path.dirname(__file__), "static"),
}
#bind handlers to the application urls
application = tornado.web.Application([
	(r"/", Index),
	(r"/save", SaveFile),
	(r"/file_panel", ProjectFileList),
], **settings)

if __name__ == "__main__":
	print ('enteringApplication, listening on port ' + str(port))
	#connect to the database here later
	tornado.options.parse_command_line()
	signal.signal(signal.SIGINT, signal_handler)
	application.listen(port)
	tornado.ioloop.PeriodicCallback(try_exit, 100).start() 
	tornado.ioloop.IOLoop.instance().start()