# oneToOneChatApplication
Link of the hosted application:
http://ec2-54-84-24-247.compute-1.amazonaws.com
1)sign into the AWS 
2)Go to the EC2 dashboard
3)Click on launch instance
4)Select Ubuntu Server 16.04 LTS (HVM), SSD Volume Type
5)Choose an instance type free trial
6)Click on edit security group
  a)create a new security group
  b)Name the security group
  c)Click on add rule
  TYPE      Protocol    PortRange     source
  SSH       TCP          22           MYIP
  HTTP      TCP          80           Anywhere
7)Click on the launch in the review instance
8)Create a new key pair
9)Download the key pair and put it in the oneToOneChatApplication folder
10)Run the command chmod 400 oneToOneChatApplication.pem from the OneToOneChatApplication directory
11)Run the command sudo ssh -i "oneToOneChatApp.pem" ubuntu@ec2-54-84-24-247.compute-1.amazonaws.com from the 			oneToOneChatApplication directory
12)Now the server will be created
13)Install nginx on it
  Run the command
  a)sudo apt-get update
  b)sudo apt get install nginx 
  c)In the cd /etc/nginx
  Run the command sudo service nginx start
14)Connect to your instance using its Public DNS in the browser:
  a)ec2-54-84-24-247.compute-1.amazonaws.com
  b)you will get welcome nginx message
15)Get your oneToOneChatApplication from your github repository on the server
  Run the command
  sudo git clone https://github.com/BirendraRai1/oneToOneChatApplication.git
16)Run the command on the server to install nodejs and npm
  sudo apt-get install nodejs npm
17)Install the mongodb on the server
18)In the default file of sites-available directory of nginx write
  server {
	listen 80;
	root /home/ubuntu/oneToOneChatApplication;
	location /{
	proxy_pass http://127.0.0.1:3000;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	}
19)Run sudo mongod on the server
20)Run node app.js from oneToOneChatApplication directory on the server and your application is ready to run on AWS 
