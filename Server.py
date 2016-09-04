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
		self.write("ok lol")

#used to define where files are stored and where the source files are located
settings = {
	"static_path": os.path.join(os.path.dirname(__file__), "static"),
}
#bind handlers to the application urls
application = tornado.web.Application([
	(r"/", Index),
	(r"/save", SaveFile),
], **settings)

if __name__ == "__main__":
	print ('enteringApplication, listening on port ' + str(port))
	#connect to the database here later
	tornado.options.parse_command_line()
	signal.signal(signal.SIGINT, signal_handler)
	application.listen(port)
	tornado.ioloop.PeriodicCallback(try_exit, 100).start() 
	tornado.ioloop.IOLoop.instance().start()