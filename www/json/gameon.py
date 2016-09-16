import SimpleHTTPServer
import SOcketServer

PORT=8000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SOcketServer.TCPServer(('',PORT),handler)

print "serving at port",PORT
httpd.serve_forever()